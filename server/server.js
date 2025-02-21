const express = require('express');
const cors = require('cors'); //gør det muligt at kalde API’et fra en browse
const bcrypt = require('bcryptjs');
const sqlite3 = require('better-sqlite3');

const app = express(); 
const port = 3000;

// Tillad CORS og JSON body parsing
app.use(cors()); // Tillader API'et at blive tilgået fra browseren
app.use(express.json()); //Tillader API'et at modtage og sende data i JSON-format

// Opret forbindelse til SQLite database
const db = new sqlite3('users.db');

// Opret tabeller, hvis de ikke findes
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        api_key TEXT UNIQUE
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS citater (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT UNIQUE,
        citat TEXT
    )
`).run();

// **Middleware til API-nøgle validering**
const fs = require('fs'); // Importér fs for at skrive til logfil

const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; //læser api fra header
    const logFile = 'unauthorized_attempts.log'; 

    if (!apiKey) { // Hvis api-nøgle ikke godkendes
        const logEntry = `[${new Date().toISOString()}] - Uautoriseret adgang: Ingen API-nøgle indsendt\n`;
        fs.appendFileSync(logFile, logEntry);
        return res.status(401).json({ error: "API-nøgle mangler" });
    }

    const users = db.prepare('SELECT username, api_key FROM users').all();

    for (let u of users) { // Valider api-nøgle mod databsen
        if (bcrypt.compareSync(apiKey, u.api_key)) {
            req.user = u.username;
            return next();
        }
    }

    // Log mislykket adgang
    const logEntry = `[${new Date().toISOString()}] - Uautoriseret adgang: Ugyldig API-nøgle "${apiKey}"\n`;
    fs.appendFileSync(logFile, logEntry);

    return res.status(403).json({ error: "Ugyldig API-nøgle" });
};


// **API-endpoint til at hente citater**
app.get('/api/citat', apiKeyAuth, (req, res) => {
    const citatData = db.prepare('SELECT citat FROM citater WHERE role = ?').get(req.user);

    if (!citatData) {
        return res.status(404).json({ error: "Ingen citat fundet for denne bruger." });
    }

    res.json({ bruger: req.user, citat: citatData.citat });
});

// **Start serveren**
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});