async function hentCitat() {
    const apiKey = document.getElementById("apiKey").value;
    const outputDiv = document.getElementById("output");
    const outputTitle = document.getElementById("output-title");
    const outputText = document.getElementById("output-text");

    if (!apiKey) {
        outputDiv.style.display = "block";
        outputTitle.textContent = "Fejl!";
        outputText.textContent = "Indtast en API-nøgle!";
        return;
    }

    // Ryd API-nøgle inputfeltet
    document.getElementById("apiKey").value = "";

    outputDiv.style.display = "block";
    outputTitle.textContent = "Henter citat..."; // Loader-effekt
    outputText.textContent = "";

    try {
        let res = await fetch("http://localhost:3000/api/citat", {
            method: "GET",
            headers: { "x-api-key": apiKey }
        });

        let data = await res.json();

        if (res.ok) {
            outputTitle.textContent = `Hej ${data.bruger}!`;
            outputText.textContent = `"${data.citat}"`;
        } else {
            outputTitle.textContent = "Fejl!";
            outputText.textContent = `Fejl ${res.status}: ${data.error}`;
        }
    } catch (error) {
        outputTitle.textContent = "Fejl!";
        outputText.textContent = "Kunne ikke forbinde til API!";
    }
}
