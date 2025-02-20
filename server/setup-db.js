const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sqlite3 = require('better-sqlite3');

const app = express();
const port = 3000;

// Opsæt middleware
app.use(cors());
app.use(express.json());

// Opretter forbindelse til databasen
const db = new sqlite3('users.db');

// **Middleware til API-nøgle validering**
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: "API-nøgle mangler" });
    }

    const user = db.prepare('SELECT username FROM users WHERE api_key = ?').get(apiKey);

    if (!user) {
        return res.status(403).json({ error: "Ugyldig API-nøgle" });
    }

    req.user = user.username;
    next();
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
