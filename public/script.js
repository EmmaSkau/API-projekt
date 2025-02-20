async function hentCitat() {
    const apiKey = document.getElementById("apiKey").value;
    const output = document.getElementById("output");

    if (!apiKey) {
        output.textContent = "Indtast en API-nøgle!";
        return;
    }

    try {
        let res = await fetch("http://localhost:3000/api/citat", {
            method: "GET",
            headers: { "x-api-key": apiKey }
        });

        let data = await res.json();

        if (res.ok) {
            output.textContent = `Hej ${data.bruger}! Her er dit citat: "${data.citat}"`;
        } else {
            output.textContent = `Fejl: ${data.error}`;
        }
    } catch (error) {
        output.textContent = "Fejl ved forbindelse til API!";
    }
}

// Funktion til at registrere en ny bruger
async function registrerBruger() {
    const brugernavn = prompt("Indtast dit brugernavn:");

    if (!brugernavn) return;

    try {
        let res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: brugernavn })
        });

        let data = await res.json();

        if (res.ok) {
            alert(`Bruger oprettet! Din API-nøgle: ${data.api_key}`);
        } else {
            alert(`Fejl: ${data.error}`);
        }
    } catch (error) {
        alert("Fejl ved forbindelse til API!");
    }
}
