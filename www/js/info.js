document.addEventListener("DOMContentLoaded", function () {
    var incidentImage = document.getElementById("incidentImage");
    var img = new Image();
    img.src = "path_to_incident_image.jpg"; // Replace with your image path
    img.onload = function () {
        incidentImage.style.backgroundImage = "url('path_to_incident_image.jpg')";
        incidentImage.style.backgroundSize = "cover";
        incidentImage.style.height = "auto";
    };

    var incidentData = localStorage.getItem('incidentData');
    if (incidentData) {
        var incident = JSON.parse(incidentData);
        console.log(incident);
        document.getElementById('titreIncident').innerHTML = incident.titre;
        document.getElementById('dateDeclarationIncident').innerHTML = `Déclarer le ` + formatDate(incident.date_event);
        document.getElementById('descriptionIncident').innerHTML = incident.description;
        document.getElementById('latitudeIncident').innerHTML = incident.latitude;
        document.getElementById('longitudeIncident').innerHTML = incident.longitude;
        const incidentImageElement = document.getElementById('incidentImage');
        if (incidentImageElement) {
            const imageUrl = incident.photo && incident.photo != 'URL_de_votre_image.jpg' ? incident.photo : 'img/default.png';
            incidentImageElement.innerHTML = `<img src="${imageUrl}" class="img-fluid" alt="Image de l'incident">`;
        }


    }

        const buttonPouce = document.getElementById('confirmerIncident');
        const IncidentEstConfirme = localStorage.getItem('IncidentEstConfirme');
        if (IncidentEstConfirme === 'true') {
            buttonPouce.innerHTML = `<img src="img/pouce-orange-full.png" alt="like" width="26"/>`;
        } else {
            buttonPouce.innerHTML = `<img src="img/pouce-orange.png" alt="like" width="26"/>`;
        }

        function confirmerIncident(idIncident) {
            fetch(`https://api.civicalert.fr/confirmer/${idIncident}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') // Ajoutez l'en-tête d'autorisation si nécessaire
                },
                body: JSON.stringify({
                    // Pas besoin de l'ID dans le corps car il est déjà dans l'URL
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`La requête a échoué avec le statut ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        console.error('Erreur :', data.error);
                    } else {
                        console.log(data.message);
                        localStorage.setItem('IncidentEstConfirme', 'true');
                        buttonPouce.innerHTML = `<img src="img/pouce-orange-full.png" alt="like" width="26"/>`;
                    }
                })
                .catch(error => {
                    console.error('Erreur :', error);
                });
        }

        buttonPouce.addEventListener('click', function () {
            const idIncident = localStorage.getItem('incidentId');
            if (idIncident) {
                confirmerIncident(idIncident);
            } else {
                console.error('Erreur : Aucun ID d\'incident trouvé dans le stockage local');
            }
        });



});





function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();