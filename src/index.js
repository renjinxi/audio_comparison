import levenshtein from 'fast-levenshtein';
import diff_match_patch from "diff-match-patch"
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
