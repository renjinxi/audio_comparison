import levenshtein from 'fast-levenshtein';
import diff_match_patch from "diff-match-patch"
import axios from "axios"

window.axios = axios

const dmp = new diff_match_patch();

const CryptoJS = require('crypto-js')

// 系统配置
let config = {
    // 请求地址
    hostUrl: "http://raasr.xfyun.cn/api/",
    // 在控制台-我的应用-语音转写获取
    appId: "1fe69965",
    // 在控制台-我的应用-语音转写获取
    secretKey: "fe2c51412e33a993af56c11be1fe9aff",
    file: null
    // 音频文件地址
    //filePath: "/Users/renjinxi/tmp/weblfasr_nodejs_demo/test.mp3"
    //file = 0
}

// 请求的接口名
const api = {
    prepare: 'prepare',
    upload: 'upload',
    merge: 'merge',
    getProgress: 'getProgress',
    getResult: 'getResult'
}

// 文件分片大小 10M
const FILE_PIECE_SICE = 10485760

// 鉴权签名
function getSigna(ts) {
    let md5 = CryptoJS.MD5(config.appId + ts).toString()
    let sha1 = CryptoJS.HmacSHA1(md5, config.secretKey)
    let signa = CryptoJS.enc.Base64.stringify(sha1)
    console.log("signa  is " + signa)
    return signa
}

// slice_id 生成器
class SliceIdGenerator {
    constructor() {
        this.__ch = 'aaaaaaaaa`'
    }

    getNextSliceId() {
        let ch = this.__ch
        let i = ch.length - 1
        while (i >= 0) {
            let ci = ch[i]
            if (ci !== 'z') {
                ch = ch.slice(0, i) + String.fromCharCode(ci.charCodeAt(0) + 1) + ch.slice(i + 1)
                break
            } else {
                ch = ch.slice(0, i) + 'a' + ch.slice(i + 1)
                i--
            }
        }
        this.__ch = ch
        return this.__ch
    }
}

class RequestApi {
    constructor({ appId, file }) {
        this.appId = appId
        this.file = file
        this.fileLen = file.size
        this.fileName = file.name
    }

    geneParams(apiName, taskId, sliceId) {
        // 获取当前时间戳
        let ts = parseInt(new Date().getTime() / 1000)

        //let { appId, fileLen, fileName } = this,
        let fileLen = this.file.size
        let fileName = this.file.name
        let signa = getSigna(ts)
        let paramDict = {
            app_id: this.appId,
            //language: "en",
            signa,
            ts
        }

        switch (apiName) {
            case api.prepare:
                let sliceNum = Math.ceil(fileLen / FILE_PIECE_SICE)
                paramDict.file_len = fileLen
                paramDict.file_name = fileName
                paramDict.slice_num = sliceNum
                break
            case api.upload:
                paramDict.task_id = taskId
                paramDict.slice_id = sliceId
                break
            case api.merge:
                paramDict.task_id = taskId
                paramDict.file_name = fileName
                break
            case api.getProgress:
            case api.getResult:
                paramDict.task_id = taskId
        }

        return paramDict
    }

    async geneRequest(apiName, data, file) {
        let options
        if (file) {
            options = {
                method: 'POST',
                //uri: config.hostUrl + apiName,
                url: "/" + apiName,
                baseUrl: config.hostUrl,
                formData: {
                    ...data,
                    content: file
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

        } else {
            options = {
                method: 'POST',
                url: "/" + apiName,
                baseUrl: config.hostUrl,
                form: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }
        }

        try {
            window.a = options
            let res = await axios(options)
            res = JSON.parse(res)

            if (res.ok == 0) {
                console.log(apiName + ' success ' + JSON.stringify(res))
            } else {
                console.log(apiName + ' error ' + JSON.stringify(res))
            }

            return res
        } catch (err) {
            console.log(apiName + ' error' + err)
        }
    }

    prepareRequest() {
        return this.geneRequest(api.prepare, this.geneParams(api.prepare))
    }

    async uploadRequest(taskId, file) {
        let self = this
        let fileLen = file.size

        return new Promise((resolve, reject) => {
            let index = 1,
                start = 0,
                sig = new SliceIdGenerator()

            async function loopUpload() {
                let len = fileLen < FILE_PIECE_SICE ? fileLen : FILE_PIECE_SICE,
                    end = start + len - 1

                let fileFragment = await self.getFileSliceAsync(file, start, end)

                let res = await self.geneRequest(api.upload,
                    self.geneParams(api.upload, taskId, sig.getNextSliceId()),
                    fileFragment)

                if (res.ok == 0) {
                    console.log('upload slice ' + index + ' success')
                    index++
                    start = end + 1
                    fileLen -= len

                    if (fileLen > 0) {
                        loopUpload()
                    } else {
                        resolve()
                    }
                }
            }

            loopUpload()
        })
    }

    mergeRequest(taskId) {
        return this.geneRequest(api.merge, this.geneParams(api.merge, taskId))
    }

    getProgressRequest(taskId) {
        let self = this

        return new Promise((resolve, reject) => {
            function sleep(time) {
                return new Promise((resolve) => {
                    setTimeout(resolve, time)
                });
            }

            async function loopGetProgress() {
                let res = await self.geneRequest(api.getProgress, self.geneParams(api.getProgress, taskId
                ))

                let data = JSON.parse(res.data)
                let taskStatus = data.status
                console.log('task ' + taskId + ' is in processing, task status ' + taskStatus)
                if (taskStatus == 9) {
                    console.log('task ' + taskId + ' finished')
                    resolve()
                } else {
                    sleep(20000).then(() => loopGetProgress())
                }
            }

            loopGetProgress()
        })
    }

    async getResultRequest(taskId) {
        let res = await this.geneRequest(api.getResult, this.geneParams(api.getResult, taskId))

        let data = JSON.parse(res.data),
            result = ''
        data.forEach(val => {
            result += val.onebest
        })
        console.log(result)
        return result
    }

    async allApiRequest() {
        try {
            let prepare = await this.prepareRequest()
            let taskId = prepare.data
            await this.uploadRequest(taskId, this.file)
            await this.mergeRequest(taskId)
            await this.getProgressRequest(taskId)
            return await this.getResultRequest(taskId)
        } catch (err) {
            console.log(err)
        }
    }

    async getFileSliceAsync(file, start, end) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const blob = new Blob([event.target.result.slice(start, end)]);
                resolve(blob);
            };
            reader.onerror = function(event) {
                reject(event.target.error);
            };
            reader.readAsArrayBuffer(file.slice(start, end));
        });
    }
}

function file_to_text(file) {
    config.file = file
    let ra = new RequestApi(config)
    return ra.allApiRequest()
}

const audioData = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x24, 0x08, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20]);

////// 将音频数据转换为Blob对象
const blob = new Blob([audioData], { type: 'audio/wav' });

////// 创建一个File对象
const file = new File([blob], 'audio.wav', { type: 'audio/wav' });
console.log(file_to_text(file))
////config.file = file
////console.log(file)











const distance = levenshtein.get('hello', 'hello');
console.log('Levenshtein distance:', distance);
window.levenshtein = levenshtein;
window.uploadedText = -1;

function cleanString(input) {
    // 使用正则表达式去除字符串中的换行符
    input = input.trim();
    input = input.replace(/[\r\n]+/g, ' ');
    // 简化多个连续空格为一个空格
    return input.replace(/\s+/g, ' ');
}

document.getElementById('fileInput').addEventListener('change', function() {
    var selectedFile = this.files[0];
    var selectedFileName = document.getElementById('selectedFileName');
    selectedFileName.textContent = selectedFile ? `File: ${selectedFile.name}` : '';

    if (selectedFile) {
        var audioURL = URL.createObjectURL(selectedFile);
        var audioPlayer = document.getElementById('audioPlayer');
        var audioSource = document.getElementById('audioSource');
        audioSource.src = audioURL;
        audioPlayer.load(); // 加载新的音频文件
        //audioPlayer.play().catch(e => console.error('Error playing audio:', e)); // 尝试播放音频文件
    }
});

document.getElementById('readyGo').addEventListener('click', function() {
    var audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
        //audioPlayer.currentTime = 0;  // Optionally, reset the audio to the start
    }
});

document.getElementById('textInputFile').addEventListener('change', function() {
    var file = this.files[0];
    var selectedTextFileName = document.getElementById('selectedTextFileName');
    selectedTextFileName.textContent = file ? `File: ${file.name}` : '';
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            window.uploadedText = e.target.result; // Store the content in a global variable
            window.uploadedText = cleanString(window.uploadedText);
            document.getElementById('accuracyDisplay').textContent = "Accuracy: --%";

        };
        reader.readAsText(file);
    }
});
document.getElementById('textInput').addEventListener('input', function() {
    var textInput = document.getElementById("textInput");
    textInput.style.height = "auto";
    textInput.style.height = textInput.scrollHeight + 'px';

    if (window.uploadedText == -1) {
        document.getElementById('accuracyDisplay').textContent = "Please Upload Text File";
        return;
    }
    let userInput = cleanString(this.value);
    let accuracy = calculateMatchPercentage(window.uploadedText, userInput);
    document.getElementById('accuracyDisplay').textContent = `Accuracy: ${accuracy}%`;
});

document.getElementById('compareText').addEventListener('click', function() {
    if (window.uploadedText == -1) {
        document.getElementById('accuracyDisplay').textContent = "Please Upload Text File";
        return;
    }
    //document.getElementById("compareContainer").style.display = "block";

    let userInput = cleanString(document.getElementById("textInput").value);
    //document.getElementById("originalTextDisplay").textContent = window.uploadedText
    displayDifferences(userInput, window.uploadedText);
});
function calculateMatchPercentage(s1, s2) {
    var distance = window.levenshtein.get(s1, s2);
    var maxLength = Math.max(s1.length, s2.length);
    if (maxLength === 0) return 100; // 防止除以零
    var percentage = (1 - distance / maxLength) * 100;
    return Math.floor(percentage); // 直接截断小数部分
}

function displayDifferences(text1, text2) {
    const diffs = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diffs);  // Optional cleanup to make the differences more readable

    const display = diffs.map(([operation, segment]) => {
        if (operation === 1) { // Insertion
            return `<span class="insert">${segment}</span>`;
        } else if (operation === -1) { // Deletion
            return `<span class="delete">${segment}</span>`;
        } else { // No change
            return `<span class="equal">${segment}</span>`;
        }
    }).join('');

    document.getElementById('differenceOutput').innerHTML = display;
}

function compareTexts() {
}
