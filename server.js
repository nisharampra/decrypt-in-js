
//server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Vigenère cipher decryption function
function generateKey(ciphertext, key) {
    key = key.split('');
    if (ciphertext.length === key.length) return key.join('');
    for (let i = 0; i < ciphertext.length - key.length; i++) {
        key.push(key[i % key.length]);
    }
    return key.join('');
}

function decryptText(ciphertext, key) {
    let plaintext = [];
    for (let i = 0; i < ciphertext.length; i++) {
        let x = (ciphertext.charCodeAt(i) - key.charCodeAt(i) + 26) % 26;
        x += 'A'.charCodeAt(0);
        plaintext.push(String.fromCharCode(x));
    }
    return plaintext.join('');
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle decryption
app.post('/decrypt', (req, res) => {
    const ciphertext = req.body.ciphertext.toUpperCase().replace(/ /g, '');
    const key = req.body.key.toUpperCase().replace(/ /g, '');

    const extendedKey = generateKey(ciphertext, key);
    const plaintext = decryptText(ciphertext, extendedKey);

    res.json({ ciphertext, key: extendedKey, plaintext });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
