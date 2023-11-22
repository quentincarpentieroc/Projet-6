document.addEventListener("DOMContentLoaded", function() {   
    const connectButton = document.getElementById("connection");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("mdp");

    connectButton.addEventListener("click", async function() {
        event.preventDefault()
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
                headers: {
                    accept: "application/json",
                    "Content-type": "application/json; charset=utf-8",
                },
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('authToken', data.token);
                window.location.href = "index.html";
            } else {
                const messageErreur = document.getElementById("messageErreur");
                messageErreur.textContent = 'Combinaison e-mail, mot de passe incorrect. Veuillez réessayer.';
            }
        } catch (error) {
            console.error("Erreur de connexion :", error);
        }
    });
})
