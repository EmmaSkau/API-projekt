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
            output.textContent = `Bruger: ${data.bruger} - Citat: ${data.citat}`;
        } else {
            output.textContent = `Fejl: ${data.error}`;
        }
    } catch (error) {
        output.textContent = "Fejl ved forbindelse til API!";
    }
}
