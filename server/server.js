const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Tillad frontend at kalde API'en (CORS)
app.use(cors());

// Dummy API-nøgle database
const apiKeys = {
    "abc123": "Admin",
    "def456": "Lærer",
    "ghi789": "Elev"
};

// Citat database
const citater = {
    "Admin": "“Livet er det, der sker, mens du har travlt med at lave andre planer.” – John Lennon",
    "Lærer": "“Succes er ikke nøglen til lykke. Lykke er nøglen til succes.” – Albert Schweitzer",
    "Elev": "“Den eneste måde at gøre et fantastisk arbejde på er at elske, hvad du laver.” – Steve Jobs"
};

// Middleware til API-nøgle validering
function apiKeyAuth(req, res, next) {
    const apiKey = req.headers['x-api-key']; // API-nøgle fra header

    if (!apiKey) {
        return res.status(401).json({ error: "API-nøgle mangler" });
    }

    const user = apiKeys[apiKey]; // Find bruger baseret på API-nøgle

    if (!user) {
        return res.status(403).json({ error: "Ugyldig API-nøgle" });
    }

    req.user = user; // Gem brugerinfo
    next();
}

// API-endpoint til at hente citater baseret på API-nøgle
app.get('/api/citat', apiKeyAuth, (req, res) => {
    const citat = citater[req.user] || "Ingen citat fundet.";
    res.json({ bruger: req.user, citat });
});

// Serverer statiske filer (frontend)
app.use(express.static("public"));

// Start serveren
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});
