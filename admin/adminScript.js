document.addEventListener('DOMContentLoaded', async () =>{
    //get pins
    const allUsers = [];
    async function createLists(x) {
        const usersIds = [];
        //const pinsR = await fetch(`http://localhost:8080/api/pin/admin/${x}roved.json`, {                  //only for testing purpose Okayge
        const pinsR = await fetch(`http://localhost:8080/api/pin/admin/all/${x}roved?userId=${localStorage.userId}`, {
                method: 'GET',
            headers: {'access_token': localStorage.accessToken}
        })
        const pinsData = await pinsR.json()
        if (pinsData.ok) {
            pinsData.pins.forEach(pin => {
                let peepoArrive = usersIds.includes(pin.userId) || allUsers.includes(pin.userId);
                if (!peepoArrive) {
                    usersIds.push(pin.userId);
                    allUsers.push(pin.userId)
                }
            });

            //split up in 100er to aks twitch for usernames
            var arrays = [];

            while (usersIds.length > 0) {
                arrays.push(usersIds.splice(0, 100));
            }

            arrays.forEach(async request => {
                let url = 'https://api.twitch.tv/helix/users?';

                request.forEach(id => {
                    url = `${url}id=${id}&`;
                });

                const usersR = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.accessToken}`,
                        'Client-Id': 'aof6xcm9xha35dqsm087mqowout2p6'
                    }
                });
                const usersData = await usersR.json()
                
                usersData.data.forEach(user => {
                    sessionStorage.setItem(`user-${user.id}`, `${JSON.stringify(user)}`);
                })
            })

            pinsData.pins.forEach(async pin => {
                const line = document.createElement('tr');
                line.setAttribute('onclick', "this.classList.toggle('focus')")
                line.setAttribute('id', `pin-${pin.pinId}`);

                const user = document.createElement('td');
                let userData = JSON.parse(sessionStorage.getItem(`user-${pin.userId}`));
                user.textContent = userData.display_name;

                const title = document.createElement('td');
                const titleLink = document.createElement('a');
                titleLink.setAttribute('id', `li-`)
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
                location.appendChild(locationLink);
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
            console.log('no admin or no good :/');
            window.location.href = '../';
        }
    }
    await createLists('unapp'); //unapproved
    await createLists('app'); //approved
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