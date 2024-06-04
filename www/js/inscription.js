
$(document).ready(function() {
    $('#formInscription').submit(function(e) {
        e.preventDefault(); // Empêche le rechargement de la page

        var userData = {
            nom: $('#lastname').val(),
            prenom: $('#firstname').val(),
            mail: $('#email').val(),
            tel: $('#tel').val(),
            mdp: $('#new-password').val(),
            pseudo: $('#username').val(),
        };
        // Log des données utilisateur pour vérifier avant l'envoi
        console.log("Données utilisateur :", userData);

        $.ajax({
            type: 'POST',
            url: 'https://api.civicalert.fr/inscription',
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: function(response) {
                // Log de la réponse en cas de succès
                console.log("Réponse du serveur :", response);
                Swal.fire({
                    title: 'Succès!',
                    html: '<p class="text-center">Inscription réussie</p>',
                    icon: 'success',
                    confirmButtonText: 'Se connecter',
                    showCancelButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Appliquer la transition avant la redirection
                        document.body.classList.add('fade-out');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 500); // Correspond à la durée de la transition en CSS
                    }
                });
            },
            error: function(xhr, status, error) {
                // Log des erreurs
                console.log("Erreur AJAX :", xhr.status, status, error);
                Swal.fire(
                    'Erreur!',
                    'Un problème est survenu lors de l\'inscription.',
                    'error'
                );
            }
        });
    });
});
