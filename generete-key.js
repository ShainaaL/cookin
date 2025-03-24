const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
console.log('Votre clé JWT secrète générée :');
console.log(secretKey);