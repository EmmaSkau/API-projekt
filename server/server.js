const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sqlite3 = require('better-sqlite3');

const app = express();
const port = 3000;

// Tillad CORS og JSON body parsing
app.use(cors());
app.use(express.json());

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

// Indsæt standard citater, hvis de ikke allerede er i databasen
const defaultCitater = [
    { role: "Admin", citat: "“Livet er det, der sker, mens du har travlt med at lave andre planer.” – John Lennon" },
    { role: "Lærer", citat: "“Succes er ikke nøglen til lykke. Lykke er nøglen til succes.” – Albert Schweitzer" },
    { role: "Elev", citat: "“Den eneste måde at gøre et fantastisk arbejde på er at elske, hvad du laver.” – Steve Jobs" }
];

defaultCitater.forEach(({ role, citat }) => {
    try {
        db.prepare('INSERT INTO citater (role, citat) VALUES (?, ?)').run(role, citat);
    } catch (err) {
        // Hvis citatet allerede findes, ignorerer vi fejlen
    }
});

// **Registrér en ny bruger og generér API-nøgle**
app.post('/api/register', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Brugernavn påkrævet" });
    }

    // Generér API-nøgle
    const apiKey = bcrypt.hashSync(username + Date.now(), 10);

    try {
        db.prepare('INSERT INTO users (username, api_key) VALUES (?, ?)').run(username, apiKey);
        res.json({ message: "Bruger oprettet!", api_key: apiKey });
    } catch (err) {
        res.status(500).json({ error: "Bruger kunne ikke oprettes, prøv et andet brugernavn." });
    }
});

// **Middleware til API-nøgle validering**
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: "API-nøgle mangler" });
    }

    const users = db.prepare('SELECT username, api_key FROM users').all();

    for (let u of users) {
        if (bcrypt.compareSync(apiKey, u.api_key)) {
            req.user = u.username;
            return next();
        }
    }

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


// **Serverer frontend-filer**
app.use(express.static("public"));

// **Start serveren**
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});
