console.log("Content script chargé.");

// Fonction qui remplit le champ de recherche et déclenche la recherche
function performSearch(query) {
    const searchInput = document.getElementById("launcher");
    if (searchInput) {
        // Simule un clic pour initialiser la barre de recherche
        searchInput.focus();
        searchInput.click();

        // Attendre un petit moment pour que la barre soit pleinement initialisée
        setTimeout(() => {
            searchInput.value = query;

            // Simuler l'appui sur la touche "Entrée"
            const event = new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key: "Enter",
                keyCode: 13
            });
            searchInput.dispatchEvent(event);
            console.log(`Recherche effectuée : ${query}`);
        }, 100); // Délai de 100ms pour laisser le temps à l'initialisation
    } else {
        console.error("Champ de recherche introuvable.");
    }
}

// Écouter les messages provenant du background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "performSearch") {
        console.log("Commande reçue pour effectuer une recherche :", message.query);
        performSearch(message.query);
        sendResponse({ status: "Recherche effectuée avec succès." });
    }
});
