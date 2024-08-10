document.addEventListener('DOMContentLoaded', async () =>{

    //get pins - unapproved
    const response = await fetch(`http://localhost:8080/api/pin/admin/all?userId=${localStorage.userId}`, {
        method: 'GET',
        headers: {'access_token': localStorage.accessToken}
    })
    const data = await response.json()
    if (data.ok) {
        data.pins.forEach(pin => {
            const title = document.createElement('span');
            title.classList.add('pinName');
            title.textContent = pin.description + ':';

            const link = document.createElement('a');
            link.setAttribute('href', `../map/?lat=${pin.lat}&lng=${pin.lng}&zoom=19`);
            link.classList.add('pinCoords');
            link.textContent = pin.town;
            
            const app = document.createElement('div')
            app.line.setAttribute('onclick', `decision('app',${pin.pinId})`);
            app.classList.add('approvePin');
            app.textContent = '&nbsp;✔️';

            const del = document.createElement('div')
            del.line.setAttribute('onclick', `decision('del', ${pin.pinId})`);
            del.classList.add('deletePin');
            del.textContent = '&nbsp;🪣';
            

            const line = document.createElement('li');
            line.setAttribute('id', `pin-${pin}`);

            line.appendChild(title);
            line.appendChild(link);
            line.appendChild(app);
            line.appendChild(del);
            document.getElementById('pinListUn').appendChild(line);
        })
    } else {
        console.log('no admin');
        return
    }

    async function decision(x, id) {
        console.log(x, id)
    }
})

//<li>
//    <span id="pinName-1" class="pinName">Pin Name</span>:
//    <a href="../map/?lat=51.163361&lng=10.447683&zoom=19"><span id="pinCoords-1" class="pinCoords">51.163361, 10.447683</span></a>
//</li>