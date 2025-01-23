chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("welcome.html") // Ouvre la page welcome.html
    });
    console.log("Page de bienvenue ouverte pour demander l'accès au microphone.");
});
// Fonction pour écouter les messages provenant du popup ou d'autres parties de l'extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "search") {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                const tabId = tabs[0].id;

                // Vérifiez si le fichier content.js est déjà injecté
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["content.js"]
                }, (injectionResults) => {
                    if (chrome.runtime.lastError) {
                        console.error("Erreur lors de l'injection du script :", chrome.runtime.lastError.message);
                        sendResponse({ status: "Erreur d'injection" });
                        return;
                    }

                    console.log("Script content.js injecté avec succès.");

                    // Envoyer le message au content script après l'injection
                    chrome.tabs.sendMessage(tabId, {
                        command: "performSearch",
                        query: message.query,
                    }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Erreur lors de l'envoi du message :", chrome.runtime.lastError.message);
                        } else {
                            console.log("Réponse reçue du content script :", response);
                        }
                    });

                    sendResponse({ status: "Message envoyé au content script." });
                });
            } else {
                console.error("Aucun onglet actif trouvé.");
                sendResponse({ status: "Aucun onglet actif trouvé." });
            }
        });

        // Indique que la réponse est asynchrone
        return true;
    }
});
