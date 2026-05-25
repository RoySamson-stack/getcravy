const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/downloads/cravyapp.apk', (req, res) => {
    const apkPath = path.join(__dirname, 'downloads', 'cravyapp.apk');
    res.download(apkPath, 'cravyapp.apk', (err) => {
        if (err) {
            res.status(404).send('APK file not found. Please build the APK first.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`cravyapp website running at http://localhost:${PORT}`);
    console.log('Place your APK file at: ./downloads/cravyapp.apk');
});
