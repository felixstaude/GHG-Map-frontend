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
            link.setAttribute('href', `../map/?lat=${pin.lat}&lng=${pin.lng}&zoom=14`);
            link.classList.add('pinCoords');
            link.textContent = pin.town;
            
            const app = document.createElement('span')
            app.setAttribute('onclick', `decision('approve', 'POST' ,${pin.pinId})`);
            app.classList.add('approvePin');
            app.innerHTML = '&nbsp;✔️';

            const del = document.createElement('span')
            del.setAttribute('onclick', `decision('delete', 'DELETE', ${pin.pinId})`);
            del.classList.add('deletePin');
            del.innerHTML = '&nbsp;🪣';

            const line = document.createElement('li');
            line.setAttribute('id', `pin-${pin.pinId}`);

            line.appendChild(title);
            line.appendChild(link);
            line.appendChild(app);
            line.appendChild(del);
            document.getElementById('pinListUn').appendChild(line);
        })
    } else if (!data.ok){
        console.log('no admin');
        window.location.href = "../";
    }
})

async function decision(a, b, id) {
    const response = await fetch(`http://localhost:8080/api/pin/admin/${a}?userId=${localStorage.userId}&pinId=${id}`, {
        method: b,
        headers: {'access_token': localStorage.accessToken}
    })
    const data = await response.json();
    if (data.ok) {
        let li = document.getElementById(`pin-${id}`);
        li.classList.add('grau');
        let app = li.children[2];
        let del = li.children[3];
        console.log(app);
        console.log(del);
    }
}

//<li>
//    <span id="pinName-1" class="pinName">Pin Name</span>:
//    <a href="../map/?lat=51.163361&lng=10.447683&zoom=19" class="pinCoords">51.163361, 10.447683</a>
//</li>