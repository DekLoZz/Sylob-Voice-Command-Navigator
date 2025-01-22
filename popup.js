const searchInput = document.getElementById("searchQuery");
const searchButton = document.getElementById("searchButton");
const voiceButton = document.getElementById("voiceButton");

// Envoyer une recherche manuelle
searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    console.log("Envoie de la recherche" + query);
    chrome.runtime.sendMessage({ command: "search", query });
});

// Activer la reconnaissance vocale
voiceButton.addEventListener("click", () => {
    if (!("webkitSpeechRecognition" in window)) {
        alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
        return;
    }



    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = "fr-FR"; // Définir la langue en français
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        console.log("Reconnaissance vocale activée...");
    };

    recognition.onspeechend = () => {
        console.log("L'utilisateur a cessé de parler. Reconnaissance terminée");
        recognition.stop();
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log(`Texte reconnu : ${transcript}`);
        searchInput.value = transcript;
        chrome.runtime.sendMessage({ command: "search", query: transcript });
    };

    recognition.onerror = (event) => {
        console.error("Erreur lors de la reconnaissance vocale : ", event.error);
    };

    recognition.onend = () => {
        console.log("Reconnaissance vocale terminée.");
    };

    recognition.start();
    setTimeout(() => {
        recognition.stop();  // Cela arrête la reconnaissance
        console.log("Reconnaissance vocale arrêtée manuellement.");
    }, 5000); // Arrêter après 5 secondes
});