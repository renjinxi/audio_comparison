window.uploadedText = -1;
function cleanString(input) {
    // 使用正则表达式去除字符串中的换行符
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
        audioPlayer.play().catch(e => console.error('Error playing audio:', e)); // 尝试播放音频文件
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
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

document.getElementById('textInput').addEventListener('input', function() {
    if (window.uploadedText == -1) {
        document.getElementById('accuracyDisplay').textContent = "Please Upload Text File";
        return;
    }
    let userInput = cleanString(this.value);
    let accuracy = calculateMatchPercentage(window.uploadedText, userInput);
    document.getElementById('accuracyDisplay').textContent = `Accuracy: ${accuracy}%`;
});

function calculateMatchPercentage(s1, s2) {
    var distance = window.levenshtein.get(s1, s2);
    var maxLength = Math.max(s1.length, s2.length);
    if (maxLength === 0) return 100; // 防止除以零
    var percentage = (1 - distance / maxLength) * 100;
    return Math.floor(percentage); // 直接截断小数部分
}
function calculateAccuracy(originalText, userInput) {
    var totalCharacters = originalText.length;
    var matchCount = 0;
    for (var i = 0; i < userInput.length && i < originalText.length;
        i++) {
        if (userInput[i] === originalText[i]) {
            matchCount++;
        }
    }
    return (matchCount / totalCharacters * 100).toFixed(2);
}
