console.log("Content script chargé.");

// Fonction qui remplit le champ de recherche et déclenche la recherche
function performSearch(query) {
    const searchInput = document.getElementById("launcher");
    if (searchInput) {
        // Simule un clic pour initialiser la barre de recherche
        searchInput.focus();
        searchInput.click();
        searchInput.value = query; // Remplir la barre de recherche
        simulateEnterKey(6000); //Simuler la touche entrée après un délai de 6 secondes 
    } else {
        console.error("Champ de recherche introuvable.");
    }
}
// Fonction auxiliaire pour simuler l'appui sur la touche "Entrée"
function simulateEnterKey(delay) {
    setTimeout(() => {
        console.log("Simulation de l'appui sur 'Entrée' après un délai de", delay, "ms.");
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            keyCode: 13
        });
        document.dispatchEvent(event); // Simuler l'appui sur "Entrée"
        console.log("Appui sur 'Entrée' simulé.");
    }, delay);
}

// Écouter les messages provenant du background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "checkInjected") {
        sendResponse({ injected: true });
        return;
    }


    if (message.command === "performSearch") {
        console.log("Commande reçue pour effectuer une recherche :", message.query);
        performSearch(message.query);
        sendResponse({ status: "Recherche effectuée avec succès." });
    }
});
