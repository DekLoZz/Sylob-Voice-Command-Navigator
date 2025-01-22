const button = document.getElementById('enableMicrophone');
    const status = document.getElementById('status');

        button.addEventListener('click', () => {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    status.textContent = "Microphone activé avec succès !";
                    console.log("Microphone activé.");
                    stream.getTracks().forEach(track => track.stop()); // Stopper le flux après autorisation
                })
                .catch((error) => {
                    status.textContent = "Erreur : " + error.message;
                    console.error("Erreur lors de l'accès au microphone :", error);
                });
        });