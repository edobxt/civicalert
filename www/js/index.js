document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    geoOptions = {
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

    var map = L.map("map").setView([lat, lon], /* zoom-level */ 15);

    var basemap = L.esri.basemapLayer("Topographic");
    basemap.addTo(map);

    map.invalidateSize();

    alert([lat, lon]);


    // Requête à l'API pour obtenir la liste des incidents
    fetch('https://api.civicalert.fr/listeIncidents')
        .then(response => response.json()) // Convertir la réponse en JSON
        .then(data => {
            console.log('Résultat de la requête:', data); // Afficher les données reçues dans la console
            data.map((item, i) => {
                var incident = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)], {icon: blueIcon});
                incident.addTo(map)
                
                incident.on('click', function(e) {
                    alert(item.titre);
                });
            })
        })
        .catch(error => {
            console.error('Erreur lors de la requête à l\'API:', error); // Gérer les erreurs potentielles
            alert('Erreur lors de la requête à l\'API:', error);
        });


    /*
    var currentLocation = L.marker([lat, lon], {icon: blueIcon});
    currentLocation.addTo(map);
    
    currentLocation.on('click', function(e) {
        var markerCoordinates = e.target.getLatLng(); // Récupération des coordonnées du marqueur
    
        map.flyTo(markerCoordinates, 25, {
            animate: true,
            duration: 0.5,
            easeLinearity: 0.25,
            noMoveStart: false
        });
    
        map.once('moveend', function() {
            setTimeout(function() {
                map.invalidateSize();
            }, 1000); // Retarde légèrement l'appel pour gérer les problèmes de timing
        });
    });*/

    
    
}

function onGeoError(error) {
    alert('code: '    + error.code    + '\n' +
    'message: ' + error.message + '\n');
}