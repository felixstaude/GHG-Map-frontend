window.addEventListener('load', async () => {
    // load all pins
    const response = await fetch('http://localhost:8080/api/pin/get/all/json.json', { //just for testing
    //const response = await fetch('http://localhost:8080/api/pin/get/all', {
        method: 'GET'
    });
    const data = await response.json();

    let bastiIcon = L.icon({
        iconUrl: '../img/bastisticker-64x64.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
    });
    
    for (let pin in data) {
        L.marker([data[pin].lat, data[pin].lng], {icon:bastiIcon})
            .addTo(map)
            .bindPopup(`<h3 id="title-${pin}">:)</h3><p id="user-${pin}"></p><a id="imgLink-${pin}" target="_blank"><img id="img-${pin}" /></a><img loading="lazy" src="../img/a.webp" onload="loadPin(${pin})" style="height:1px;width:1px;opacity:0.1;"/>`,{minWidth:150});
    }

    //for add pin field
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

    document.getElementById('getPositionEl').addEventListener('click', getPosition);
    document.getElementById('manuelPositionEl').addEventListener('click', () => {
        const error = {code: 69};
        showError(error); //kein error aber damit code nicht doppelt ist
    })
});

//load pin when use clicks on on it
async function loadPin(id) {
    console.log('load pin ', id);
    let title = document.getElementById(`title-${id}`);
    let user = document.getElementById(`user-${id}`);
    let imgLink = document.getElementById(`imgLink-${id}`);
    let img = document.getElementById(`img-${id}`);

    const responsePin = await fetch(`http://localhost:8080/api/pin/get/data/pinId=3.json`, { // for testing
    //const responsePin = await fetch(`http://localhost:8080/api/pin/get/data?pinId=${id}`, {
        method: 'GET'
    })
    const dataPin = await responsePin.json();
    const username = await getUser(dataPin.userId);

    title.textContent = dataPin.description;
    user.textContent = 'von ' + username;
    imgLink.href = 'http://localhost:8080/' + dataPin.imagePath;
    img.src = 'http://localhost:8080/' + dataPin.imagePath;
    img.alt = `Bild zum Pin ${dataPin.description}`;
}



// Function to get the current position
   function getPosition() {
    const options = {enableHighAccuracy: true, maximumAge: 60000}

    let message = 'Geolocation wird von deinem Browser nicht unterstützt, du kannst deine Coords jedoch auch hier eintragen. Bitte tage es so ein, wie es das Beispiel zeigt:';
    let defaultValue = '51.163361,10.447683'

    let coords;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
    } else {
        coords = window.prompt(message, defaultValue);
        let lat = coords.split(',')[0];
        let lan = coords.split(',')[1];
    
        const position = {"coords": {"latitude": lat, "longitude": lan}}
        showPosition(position);
    }
}

// Function to show the position and update the map view
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    // Update the map view to the current position
    map.flyTo([latitude, longitude], 15);
    
    // add a marker to the current position
    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup('Du bist gerade ungefähr hier')
        .openPopup();
}

// Function to handle geolocation errors
function showError(error) {
    let message = ', du kannst deine Coords jedoch auch hier eintragen. Bitte trage sie so ein, wie es das Beispiel zeigt:';
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
        case 69:
            coords = window.prompt('Bitte trage sie so ein, wie es das Beispiel zeigt:', defaultValue)
            break;
    }
    let lat = coords.split(',')[0];
    let lan = coords.split(',')[1];

    const position = {"coords": {"latitude": lat, "longitude": lan}}
    showPosition(position, 'Hier ist der Ort, den du suchst')
}