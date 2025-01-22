chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("welcome.html") // Ouvre la page welcome.html
    });
    console.log("Page de bienvenue ouverte pour demander l'accès au microphone.");
});

  
// Fonction pour écouter les messages provenant du popup ou de l'extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "search") {
      // Envoyer le texte au content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log("j'ai reçu la requête bb");
            if (tabs[0]?.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: performSearch,
                    args: [message.query]
                });
            }
        });
      sendResponse({ status: "Recherche envoyée" });
    }
  });
  
// Fonction injectée dans le content.js
function performSearch(query) {
    const searchInput = document.getElementById("launcher");
    if (searchInput) {
        searchInput.value = query;
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            keyCode: 13
        });
        searchInput.dispatchEvent(event);
    } else {
        console.error("Champ de recherche introuvable.");
    }
}
  