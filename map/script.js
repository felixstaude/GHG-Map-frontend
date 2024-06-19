window.addEventListener('load', (e) => {
    document.getElementById('map').addEventListener('click', function() {
        if (document.getElementById('description')) {
            //nicer input for description
            document.getElementById('description').addEventListener('input', (e) => {
                if (document.getElementById('description').value.length > 0) {
                    document.getElementById('textDescription').innerHTML = '&nbsp;';
                    document.getElementById('textDescription').classList.add('filled');
                } else {
                    document.getElementById('textDescription').innerHTML = 'Beschreibung';
                    document.getElementById('textDescription').classList.remove('filled');
                }
            });

            //nicer input for image
            document.getElementById('image').addEventListener('input', (e) => {
                let fileName = e.srcElement.value.split('C:\\fakepath\\')[1];
                if (fileName) { 
                    document.getElementById('textPicture').classList.add('filled');
                    document.getElementById('textPicture').innerHTML = fileName;
                } else {
                    document.getElementById('textPicture').classList.remove('filled');
                    document.getElementById('textPicture').innerHTML = 'Bild hochladen';
                }
            })
        }
    });

    /*if (e.currentTarget.clientInformation.userAgentData.platform = 'Windows') {
        document.getElementById('getPositionEl').remove();
    }*/
});



// Function to get the current position
   function getPosition() {
    const options = {enableHighAccuracy: true, maximumAge: 60000}

    let message = 'Geolocation wird von deinem Browser nicht unterstützt, du kannst deine Coords jedoch auch hier eintragen. Bitte tage es so ein, wie es das Beispiel zeigt:';
    let defaultValue = '51.163361,10.447683'

    let coords;
    if (Snavigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
    } else {
        coords = window.prompt(message, defaultValue);
        let lat = coords.split(',')[0];
        let lan = coords.split(',')[1];
    
        const position = {"coords": {"latitude": lat, "longitude": lan}}
        showPosition(position)
    }
}

// Function to show the position and update the map view
function showPosition(position, msg) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    // Update the map view to the current position
    map.flyTo([latitude, longitude], 18);
    
    // add a marker to the current position
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Du bist gerade hier').openPopup();
}

// Function to handle geolocation errors
function showError(error) {
    let message = ', du kannst deine Coords jedoch auch hier eintragen. Bitte tage es so ein, wie es das Beispiel zeigt:';
    let defaultValue = '51.163361,10.447683'
    let coords;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            coords = window.prompt('Die Webseite darf nicht auf deinen Standort zugreifen' + message, defaultValue);
            break;
        case error.POSITION_UNAVAILABLE:
            coords = window.prompt('Leider bist du gerade im Nirgendwo :/' + message, defaultValue);
            break;
        case error.TIMEOUT:
            coords = window.prompt('Die Anfrage hat zu lange gedauert' + message, defaultValue);
            break;
        case error.UNKNOWN_ERROR:
            coords = window.prompt('Ein unbekannter Fehler ist aufgetreten. Versuche es später erneut' + message, defaultValue);
            break;
    }
    let lat = coords.split(',')[0];
    let lan = coords.split(',')[1];

    const position = {"coords": {"latitude": lat, "longitude": lan}}
    showPosition(position)
}