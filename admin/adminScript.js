document.addEventListener('DOMContentLoaded', async () =>{

    //get pins
    async function createLists(x) {
        //const response = await fetch(`http://localhost:8080/api/pin/admin/${x}roved.json`, {
        const response = await fetch(`http://localhost:8080/api/pin/admin/all/${x}roved?userId=${localStorage.userId}`, {
                method: 'GET',
            headers: {'access_token': localStorage.accessToken}
        })
        const data = await response.json()
        if (data.ok) {
            data.pins.forEach(async pin => {
                const line = document.createElement('tr');
                line.setAttribute('id', `pin-${pin.pinId}`);

                const user = document.createElement('td');
                let username = await getUsername(pin.userId);
                user.textContent = username;

                const title = document.createElement('td');
                const titleLink = document.createElement('a');
                titleLink.setAttribute('href', `http://localhost:8080/${pin.imagePath}`);
                titleLink.setAttribute('target', '_blank');
                titleLink.textContent = pin.description;

                const location = document.createElement('td');
                const locationLink = document.createElement('a');
                locationLink.setAttribute('href', `../map/?lat=${pin.lat}&lng=${pin.lng}&zoom=14`);
                locationLink.setAttribute('target', '_blank');
                locationLink.classList.add('pinCoords');
                locationLink.textContent = pin.town;

                const del = document.createElement('td');
                del.setAttribute('onclick', `decision('delete', 'DELETE', ${pin.pinId})`);
                del.classList.add('deletePin');
                del.innerHTML = '&nbsp;🪣';

                line.appendChild(user);
                title.appendChild(titleLink);
                line.appendChild(title);
                location.appendChild(locationLink)
                line.appendChild(location);
                if(x === 'unapp') {
                    const app = document.createElement('td')
                    app.setAttribute('onclick', `decision('approve', 'POST' ,${pin.pinId})`);
                    app.classList.add('approvePin');
                    app.innerHTML = '&nbsp;✔️';
                    line.appendChild(app);
                }
                line.appendChild(del);
                document.getElementById(`pinList-${x}`).appendChild(line);
            })
        } else if (!data.ok){
            console.log('no admin or no good');
            window.location.href = "../";
        }
    }
    createLists('unapp'); //unapproved
    createLists('app'); //approved
})

async function decision(a, b, id) {
    const response = await fetch(`http://localhost:8080/api/pin/admin/${a}?userId=${localStorage.userId}&pinId=${id}`, {
        method: b,
        headers: {'access_token': localStorage.accessToken}
    })
    const data = await response.json();
    if (data.ok) {
        let tr = document.getElementById(`pin-${id}`);
        tr.classList.add('grau');
        let app = tr.children[3];
        let del = tr.children[4];
        app.remove();
        del.remove();
    }
}

//<li>
//    <span id="pinName-1" class="pinName">Pin Name</span>:
//    <a href="../map/?lat=51.163361&lng=10.447683&zoom=19" class="pinCoords">51.163361, 10.447683</a>
//</li>