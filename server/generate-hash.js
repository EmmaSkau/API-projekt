const bcrypt = require('bcryptjs');

const apiKey = 'kanjeg?'; // Skift API-nøglen, hvis nødvendigt
const hashedKey = bcrypt.hashSync(apiKey, 10);

console.log(`Hashed API-nøgle: ${hashedKey}`);
