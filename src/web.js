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
                uri: config.hostUrl + apiName,
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
                uri: config.hostUrl + apiName,
                form: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }
        }

        try {
            let res = await rp(options)
            res = JSON.parse(res)

            if (res.ok == 0) {
                console.log(apiName + ' success ' + JSON.stringify(res))
            } else {
                console.error(apiName + ' error ' + JSON.stringify(res))
            }

            return res
        } catch (err) {
            console.error(apiName + ' error' + err)
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
            console.error(err)
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
