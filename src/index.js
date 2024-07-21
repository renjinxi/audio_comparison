import levenshtein from 'fast-levenshtein';
import diff_match_patch from "diff-match-patch"
import axios from "axios"
// import base64 from "base-64"

window.axios = axios
window.base_url = "https://cyberashes.yyboxdns.com:17749/"

const dmp = new diff_match_patch();

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

document.addEventListener('DOMContentLoaded', (event) => {
    const input = document.getElementById('textInput');

    let isSoundEnabled = false;
    // Path to the sound file
    const keySound = new Audio('sounds/typeSoft.wav'); // Make sure to replace this with your actual sound file path

    input.addEventListener('keypress', () => {
        // Play the sound
        if (isSoundEnabled) {
            keySound.currentTime = 0; // Rewind to the start
            keySound.play();
        }
    });
    toggleSoundButton.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        toggleSoundButton.textContent = isSoundEnabled ? 'Disable Keyboard Sound' : 'Enable Keyboard Sound';
    });
});
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

document.getElementById('uploadButton').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    var selectedFile = fileInput.files[0];

    if (!selectedFile) {
        alert('Please select an audio file first.');
        return;
    }

    var uploadButton = document.getElementById('uploadButton');
    uploadButton.classList.add('disabled'); // 禁用上传标签
    var reader = new FileReader();
    reader.onload = function(event) {
        var base64Audio = event.target.result.split(',')[1];

        // 上传音频文件并获取任务ID
        createAudioTask(base64Audio, selectedFile.name)
            .then(taskId => {
                console.log('Task ID:', taskId);
                return getAudioResult(taskId);
            })
            .then(result => {
                console.log('Transcription Result:', result);
                window.uploadedText = result; // Store the content in a global variable
                window.uploadedText = cleanString(window.uploadedText);
                document.getElementById('accuracyDisplay').textContent = "Accuracy: --%";
                uploadButton.classList.remove('disabled'); // 任务完成，启用上传标签
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('transcriptionResult').textContent = 'Error: ' + error.message;
                uploadButton.classList.remove('disabled'); // 任务完成，启用上传标签
            });
    };
    reader.readAsDataURL(selectedFile);
});

document.getElementById('uploadTextButton').addEventListener('click', function() {
    if (window.uploadedText == -1) {
        alert('Please Upload Text File.');
        return;
    }

    var uploadTextButton = document.getElementById('uploadTextButton');
    uploadTextButton.classList.add('disabled'); // 禁用上传标签
    createTextTask(window.uploadedText)
        .then(taskId => {
            console.log('Task ID:', taskId);
            return getTextResult(taskId);
        })
        .then(result => {
            const audioBase64String = result;
            const audioSrc = `data:audio/mpeg;base64,${audioBase64String}`;

            // Set the source of the audio element
            const audioPlayer = document.getElementById('audioPlayer');
            const source = document.getElementById('audioSource');
            source.src = audioSrc;
            source.type = 'audio/mpeg';
            audioPlayer.appendChild(source);
            uploadTextButton.classList.remove('disabled'); // 任务完成，启用上传标签
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error:", error);
            // document.getElementById('transcriptionResult').textContent = 'Error: ' + error.message;
            uploadTextButton.classList.remove('disabled'); // 任务完成，启用上传标签
        });
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

function createAudioTask(base64Audio, fileName) {
    return new Promise((resolve, reject) => {
        // 准备请求数据
        const audioData = {
            data: base64Audio,
            file_name: fileName,
        };

        // 发起POST请求上传音频
        axios.post(window.base_url + 'api/audio_upload/', audioData)
            .then(response => {
                if (response.status === 200 && response.data.msg && response.data.msg.task_id) {
                    resolve(response.data.msg.task_id);
                } else {
                    reject(new Error('Failed to create audio task'));
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getAudioResult(taskId) {
    return new Promise((resolve, reject) => {
        function checkResult() {
            axios.post(window.base_url + 'api/get_result/', null, {
                params: { task_id: taskId },
            })
                .then(response => {
                    if (response.status === 200 && response.data.msg) {
                        const { state, result } = response.data.msg;

                        if (state === 'completed') {
                            resolve(result);
                        } else if (state === 'failed') {
                            reject(new Error('Audio transcription failed'));
                        } else {
                            // 等待一段时间后重试
                            setTimeout(checkResult, 5000);
                        }
                    } else {
                        reject(new Error('Unexpected response structure'));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        }

        checkResult();
    });
}

function createTextTask(text) {
    return new Promise((resolve, reject) => {
        // 准备请求数据
        const audioData = {
            data: text,
        };

        // 发起POST请求上传音频
        axios.post(window.base_url + 'api/text_upload/', audioData)
            .then(response => {
                if (response.status === 200 && response.data.msg && response.data.msg.task_id) {
                    resolve(response.data.msg.task_id);
                } else {
                    reject(new Error('Failed to create audio task'));
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getTextResult(taskId) {
    return new Promise((resolve, reject) => {
        function checkResult() {
            axios.post(window.base_url + 'api/get_result/', null, {
                params: { task_id: taskId },
            })
                .then(response => {
                    if (response.status === 200 && response.data.msg) {
                        const { state, result } = response.data.msg;

                        if (state === 'completed') {
                            resolve(result);
                        } else if (state === 'failed') {
                            reject(new Error('Text transcription failed'));
                        } else {
                            // 等待一段时间后重试
                            setTimeout(checkResult, 5000);
                        }
                    } else {
                        reject(new Error('Unexpected response structure'));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        }

        checkResult();
    });
}

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
