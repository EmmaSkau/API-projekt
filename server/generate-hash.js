const bcrypt = require('bcryptjs');

const apiKey = 'kanjeg?'; // Lav adgangskode omn til hashet
const hashedKey = bcrypt.hashSync(apiKey, 10);

console.log(`Hashed API-nøgle: ${hashedKey}`);
