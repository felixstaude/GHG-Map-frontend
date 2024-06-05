window.addEventListener('load', (e) => {
    document.getElementById('map').addEventListener('click', function() {

        //nicer input for description
        document.getElementById('description').addEventListener('input', (e) => {
            if (document.getElementById('description').value.length > 0) {
                document.getElementById('textDescription').innerHTML = '';
                document.getElementById('description').classList.add('filled');
            } else {
                document.getElementById('textDescription').innerHTML = 'Beschreibung';
                document.getElementById('description').classList.remove('filled');
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
    });
});