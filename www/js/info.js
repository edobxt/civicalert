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