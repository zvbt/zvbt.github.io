function getRandomImage() {
    let aaa = Math.floor(Math.random() * 120) + 1;
    var imgStr = '<img src="https://raw.githubusercontent.com/zvbt/animeclient-assets/main/assets/'  + aaa + '.png" >';
    document.write(imgStr); document.close();
}