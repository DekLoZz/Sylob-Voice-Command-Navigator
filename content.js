console.log("Content script chargé.");

// Fonction qui remplit le champ de recherche et déclenche la recherche
function performSearch(query) {
    const searchInput = document.getElementById("launcher");
    if (searchInput) {
        searchInput.value = query;

        // Déclenchement de l'événement "Enter"
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            keyCode: 13
        });
        searchInput.dispatchEvent(event);
        console.log(`Recherche effectuée : ${query}`);
    } else {
        console.error("Champ de recherche introuvable.");
  }
}

// Écouter les messages du background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "performSearch") {
        performSearch(message.query);
        sendResponse({ status: "Recherche déclenchée." });
    }
});
