async function hentCitat() {
    const apiKey = document.getElementById("apiKey").value;
    const output = document.getElementById("output");

    if (!apiKey) {
        output.textContent = "Indtast en API-nøgle!";
        return;
    }

    output.textContent = "Henter citat..."; // Loader-effekt

    try {
        let res = await fetch("http://localhost:3000/api/citat", {
            method: "GET",
            headers: { "x-api-key": apiKey }
        });

        let data = await res.json();

        if (res.ok) {
            output.textContent = `Hej ${data.bruger}! Her er dit citat: "${data.citat}"`;
        } else {
            output.textContent = `Fejl ${res.status}: ${data.error}`;
        }
    } catch (error) {
        output.textContent = `Netværksfejl: Kunne ikke forbinde til API!`;
    }
}