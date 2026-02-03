const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/downloads/goeat.apk', (req, res) => {
    const apkPath = path.join(__dirname, 'downloads', 'goeat.apk');
    res.download(apkPath, 'goeat.apk', (err) => {
        if (err) {
            res.status(404).send('APK file not found. Please build the APK first.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`GoEat website running at http://localhost:${PORT}`);
    console.log('Place your APK file at: ./downloads/goeat.apk');
});
