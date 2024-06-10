document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('deviceready', onDeviceReady, false);

    function onDeviceReady() {
        // Cordova is now initialized. Have fun!
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

        let geoOptions = {
            enableHighAccuracy: true
        }

        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, geoOptions);
    }

    function onGeoSuccess(position) {
        var blueIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        var map = L.map("map").setView([lat, lon],  15);

        var basemap = L.esri.basemapLayer("Topographic");
        basemap.addTo(map);

        map.invalidateSize();


        // Requête à l'API pour obtenir la liste des incidents
        fetch('https://api.civicalert.fr/listeIncidents')
            .then(response => response.json()) // Convertir la réponse en JSON
            .then(data => {
                console.log('Résultat de la requête:', data); // Afficher les données reçues dans la console
                data.map((item, i) => {
                    var incident = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)], {icon: blueIcon});
                    incident.addTo(map).on('click', () => {
                        showInfo(item);
                    });
                });
            })
            .catch(error => {
                console.error('Erreur lors de la requête à l\'API:', error); // Gérer les erreurs potentielles
                alert('Erreur lors de la requête à l\'API:', error);
            });
    }

    function showInfo(item) {
        var content = `
            <h3>${item.titre}</h3>
            <p>${item.description}</p>
            <div class="d-flex justify-content-between align-items-center">
                <p>Date: ${formatDate(item.date_event)}</p>
                <button class="btn" id="confirmerIncident">
                    <img src="img/pouce-black.png" alt="like" width="26"/>
                </button>
            </div>
            <a href="info.html"><p class="text-center">voir les détails</p></a>
        `;
        localStorage.setItem('incidentData', JSON.stringify(item));
        document.getElementById('incidentInfo').innerHTML = content;
        document.getElementById('infoPanel').style.display = 'block';
    }



    function closeInfoPanel() {
        document.getElementById('infoPanel').style.display = 'none';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function onGeoError(error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    document.getElementById('closeInfoPanel').addEventListener('click', closeInfoPanel);
});
