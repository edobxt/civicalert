
// CODE JS RECUPERATION DES INFORMATIONS EN PLACEHOLDER
document.addEventListener('DOMContentLoaded', () => {
    const id_citoyen = sessionStorage.getItem('idCitoyen');
    const pseudo_citoyen = sessionStorage.getItem('pseudoCitoyen') || "";
    document.querySelector('.user-pseudo').textContent = pseudo_citoyen;

    const fetchAndDisplayUserInfo = () => {
        if (id_citoyen) {
            fetch(`https://api.civicalert.fr/infosCitoyen/${id_citoyen}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.data) {
                    fillUserInfoForm(data.data);
                } else {
                    console.error('Failed to retrieve user data:', data.error);
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
        }
    };

    const fillUserInfoForm = (userInfo) => {
        document.getElementById('firstname').value = userInfo.prenom;
        document.getElementById('lastname').value = userInfo.nom;
        document.getElementById('email').value = userInfo.mail;
        document.getElementById('username').value = userInfo.pseudo;
        document.getElementById('tel').value = userInfo.tel;
    };

// CODE JS MODIFIER INFORMATIONS
const profileForm = document.getElementById('formEditInfos');
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const citoyenData = {
        id: id_citoyen,
        prenom: document.getElementById('firstname').value,
        nom: document.getElementById('lastname').value,
        mail: document.getElementById('email').value,
        pseudo: document.getElementById('username').value,
        tel: document.getElementById('tel').value
    };

    fetch('https://api.civicalert.fr/editCitoyen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(citoyenData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        if(data.code == "OK"){
            Swal.fire({
                icon: 'success',
                title: 'Modifications enregistrées !',
                text: "Vos informations personnelles ont été mises à jour avec succès",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                sessionStorage.setItem('pseudoCitoyen', citoyenData.pseudo);
                const nomUtilisateurElement = document.querySelector('.nom-utilisateur');
                if (nomUtilisateurElement) {
                    nomUtilisateurElement.textContent = citoyenData.pseudo;
                }
                setTimeout(() => {
                    location.reload();
                }, 100);
            });
        }

    })
    .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Une erreur est survenue lors de la tentative de modification des informations."
        });
    });
});


// CODE JS MODIFICATION MOT DE PASSE

    const passwordForm = document.getElementById('formPasswordChange');
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const expass = document.getElementById('expass').value;
        const newpass = document.getElementById('newpass').value;
        const newpassconf = document.getElementById('newpassconf').value;

        if (newpass !== newpassconf) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Les mots de passes ne correspondent pas"
            });
            return;
        }

        const citoyenData = {
            id: id_citoyen,
            expass: expass,
            newpass: newpass,
        };

        fetch('https://api.civicalert.fr/editPass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(citoyenData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            Swal.fire({
                icon: 'success',
                title: 'Mot de passe modifié !',
                text: data.message,
                timer: 2000,
                showConfirmButton: false
            });
            setTimeout(() => {
                location.reload();
            }, 2000);
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message
            });
        });
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('idCitoyen');
        localStorage.removeItem('pseudoCitoyen');

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('idCitoyen');
        sessionStorage.removeItem('pseudoCitoyen');

        window.location.href = "index.html";
    });

    // Initialisation des infos de l'utilisateur 
    fetchAndDisplayUserInfo();
});
