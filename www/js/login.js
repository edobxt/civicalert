document.addEventListener('DOMContentLoaded', function() {
    // Vérifier s'il y a un token dans le localStorage ou le sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
        window.location.href = 'content/app.html';
    }

    document.getElementById('formConnexion').addEventListener('submit', function(event) {
        event.preventDefault();

        // Récupérer les valeurs des champs email et mot de passe
        const email = document.getElementById('email').value;
        const password = document.getElementById('mdp').value;

        // Construire les données à envoyer à l'API
        const data = {
            mail: email,  // Utiliser 'mail' au lieu de 'email' pour correspondre à l'API
            mdp: password // Utiliser 'mdp' au lieu de 'password' pour correspondre à l'API
        };

        console.log('Données de connexion envoyées :', data);

        // Envoyer les données à l'API
        fetch('https://api.civicalert.fr/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            // Log de la réponse brute
            console.log('Réponse brute :', response);

            // Vérifier si la réponse est ok (status 200-299)
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.log('Erreur de réponse JSON :', errorData);
                    throw new Error(errorData.erreur || 'Erreur de connexion');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Données de réponse JSON :', data);

            if (data.token) {
                // Stocker le token dans le localStorage ou le sessionStorage selon le choix de l'utilisateur
                if (document.getElementById('remember').checked) {
                    localStorage.setItem('token', data.token);
                } else {
                    sessionStorage.setItem('token', data.token);
                }

                // Afficher un message de succès
                Swal.fire({
                    icon: 'success',
                    title: 'Connexion réussie!',
                    text: 'Bienvenue ' + data.prenom + ' ' + data.nom,
                    timer: 2000,
                    showConfirmButton: false
                });

                // Rediriger l'utilisateur vers une autre page (par exemple, tableau de bord)
                setTimeout(() => {
                    window.location.href = 'map.html';
                }, 500);
            } else {
                // Gérer les erreurs de connexion
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur de connexion',
                    text: 'Veuillez vérifier vos identifiants et réessayer.'
                });
            }
        })
        .catch(error => {
            console.error('Erreur attrapée :', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message
            });
        });
    });
});

// Ajouter un événement pour nettoyer le sessionStorage à la fermeture de la fenêtre
window.addEventListener('beforeunload', function() {
    // Supprimer le token uniquement du sessionStorage si la case "Se souvenir de moi" n'est pas cochée
    if (!localStorage.getItem('token')) {
        sessionStorage.removeItem('token');
    }
});
