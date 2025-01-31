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

                // Vérifiez si content.js est déjà injecté
                chrome.tabs.sendMessage(tabId, { command: "checkInjected" }, (response) => {
                    if (chrome.runtime.lastError || !response) {
                        // Injectez content.js si non injecté
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ["content.js"]
                        }, () => {
                            if (chrome.runtime.lastError) {
                                console.error("Erreur lors de l'injection :", chrome.runtime.lastError.message);
                                sendResponse({ status: "Erreur d'injection" });
                                return;
                            }

                            console.log("Script content.js injecté.");
                            // Envoyer le message après l'injection
                            chrome.tabs.sendMessage(tabId, {
                                command: "performSearch",
                                query: message.query,
                            });
                        });
                    } else {
                        // Si déjà injecté, envoyer directement le message
                        chrome.tabs.sendMessage(tabId, {
                            command: "performSearch",
                            query: message.query,
                        });
                    }
                });

                sendResponse({ status: "Message traité." });
            } else {
                console.error("Aucun onglet actif trouvé.");
                sendResponse({ status: "Aucun onglet actif trouvé." });
            }
        });

        return true;
    }
});
