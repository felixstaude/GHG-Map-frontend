// validate token and get username
let lastValidation = sessionStorage.getItem('lastValidation');

async function validateToken(x) {
    let time = new Date().getTime();
    let renewLogin = localStorage.getItem('renewLogin');
    lastValidation = sessionStorage.getItem('lastValidation');
    let testtext = `5min: ${((lastValidation + 300000) < time)} | not available: ${!lastValidation} | twitch new val: ${renewLogin < time}`;
    console.log('%c' + testtext, 'color:#000;background-color:#fff; border-radius:3px;padding:1px')

    if (((lastValidation + 300000) < time) || !lastValidation || renewLogin < time) {
        try {
            const response = await fetch('https://id.twitch.tv/oauth2/validate', {
                method: 'GET',
                headers: {
                    'Authorization': `OAuth ${x}`
                }
            });

            if (!response.ok) {
                console.error(response);
                throw new Error('Network response was not ok ' + response.statusText);
            } else {
                console.log('%c' + 'validation via API successfull', 'color:#6f6; background-color:#050; border-radius:3px; padding:1px');
            }

            const data = await response.json();
            data.valid = true;
            localStorage.setItem('userdata', JSON.stringify(data));
            localStorage.setItem('renewLogin', (data.expires_in + new Date().getTime()));
            lastValidation = new Date().getTime();
            sessionStorage.setItem('lastValidation', lastValidation);
            return data;

        } catch (error) {
            throw error;
        }
    } else {
        console.log('%c' + 'validation not needed, returned latest response', 'color:#66f; background-color:#005; border-radius:3px; padding:1px')
        let userdata = localStorage.getItem('userdata');
        return JSON.parse(userdata);
    }
}

document.addEventListener('DOMContentLoaded', async ()=> {

    //cookie banner
    let hadBanner = (localStorage.getItem('sawBanner')) ? localStorage.getItem('sawBanner') : sessionStorage.getItem('sawBanner');

    if (!hadBanner) {
        let parent = document.getElementsByTagName('body')[0];
        const wrapper = document.createElement('div');
        wrapper.classList.add('cbWrapper');

        const banner = document.createElement('div');
        banner.classList.add('cbBanner');
        banner.innerHTML = `
            <h4>Willkommen auf der GHG Sticker Map</h4>
            <p>Damit diese Website funktioniert, werden kleine Textdateien lokal auf deinem Gerät gespeichert. Dafür werden der "Local Storage" (Daten werden nicht automatisch gelöscht) und der "Session Storage" (Daten werden beim Ende der Session automatisch gelöscht) verwendet.</p>
            <p>In der Datenbank wird dein Twitch-ID, die Koordinaten und das Bild gespeichert, wenn du einen Pin setzt. Du kannst deine Pins jederzeit über deine Userseite löschen. Die lokal gespeicherten Daten kannst du im Footer über "Daten zurücksetzten" oder auf der Login-Seite über "Logout" löschen.</p>
            <p>Dieses Fenster...</p>
            <div onclick="safeSettings(0)">beim nächsten Mal wieder anzeigen</div>
            <div onclick="safeSettings(1)">nicht mehr anzeigen</div>`;
        
        wrapper.appendChild(banner);
        parent.appendChild(wrapper);
    }

    // get data for user that is logged in
    let onloadTime = new Date().getTime();
    let renewLogin = localStorage.getItem('renewLogin') //compare to onlaod time -> if still valid, validate -> create profile link and remove login
    let accessToken = localStorage.getItem('accessToken');
    
    if (renewLogin >= onloadTime) {
        let valid = await validateToken(accessToken);
        
        if (valid) {
            try {
                const response = await fetch(`https://api.twitch.tv/helix/users?id=${valid.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Client-Id': 'aof6xcm9xha35dqsm087mqowout2p6'
                    }
                });
        
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
        
                const data = await response.json();

                //stuff to adujst aside navigationn which is NOT on main page so it would throw an error
                if (document.getElementsByTagName('aside').length > 0) {
                    document.getElementById('loginLink').remove();

                    //create link with profile picture
                    let accountDetails = document.getElementById('accountDetails');
                    const ppImg = document.createElement('img');
                    ppImg.src = data.data[0].profile_image_url;
                    ppImg.classList.add('userPofilepicture');

                    accountDetails.innerHTML = `&nbsp;${localStorage.getItem('username')}`;
                    accountDetails.appendChild(ppImg);
                }
                if (window.location.pathname === ("/admin/" || "/stats/")) {
                    document.getElementById('userPfp').src = data.data[0].profile_image_url;
                    document.getElementById('userName').innerHTML = localStorage.getItem('username');
                }
            } catch (error) {
                throw error;
            }
        }
    }

    //reset local storage stuff
    let rDB = document.getElementById('resetData'); //resetDataButton
    if (rDB) {
        rDB.addEventListener('click', async () => {
            let clientId = 'aof6xcm9xha35dqsm087mqowout2p6';
            let accessToken = encodeURIComponent(localStorage.getItem('accessToken'));
            let bodyString = `client_id=${clientId}&token=${accessToken}`;
        
            const response = await fetch('https://id.twitch.tv/oauth2/revoke', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyString
            });
        
            if (response.ok) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
            }
        });
    }
    
});

//safe cookie settings

async function safeSettings(x) {
    (x === 1) ? localStorage.setItem('sawBanner', true) : sessionStorage.setItem('sawBanner', true);
    let wrapper = document.getElementsByClassName('cbWrapper')[0];
    let banner = document.getElementsByClassName('cbBanner')[0];
    wrapper.classList.add('remove');
    banner.classList.add('remove');
    await sleep(500)
    wrapper.remove();
}



// Charlie Stuff
function openNav() {
    document.getElementById("mySidenav").style.right = "0";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.right = "-270px";
}

function loadingCircle(x, parent) { // Ladeschnecke, die user zeigt, dass weitere Daten geladen werden
    if (x === 1) {
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('loadingCircle');
        loadingElement.setAttribute('id', 'loadingCircle')
        loadingElement.innerHTML='&nbsp;';
        parent.appendChild(loadingElement);
    } else {
        document.getElementById('loadingCircle').remove();
    }
}

const waitingForId = [];
async function getUser(id) {
    let user = sessionStorage.getItem(`user-${id}`);
    if (waitingForId.includes(id)) {
        while (waitingForId.includes(id)) {
            console.log('wating for: ' + id);
            await sleep(1000);
        }
    }
    user = JSON.parse(sessionStorage.getItem(`user-${id}`));
    if (!user) {
        waitingForId.push(id);
        const response = await fetch(`https://api.twitch.tv/helix/users?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.accessToken}`,
                'Client-Id': 'aof6xcm9xha35dqsm087mqowout2p6'
            }
        });
        if (response.ok) { 
            let data = await response.json();
            user = data.data[0];
            sessionStorage.setItem(`user-${id}`, JSON.stringify(user));
            const index = waitingForId.indexOf(id);
            if (index > -1) { // only splice array when item is found
                waitingForId.splice(index, 1); // 2nd parameter means remove one item only
            }
            //thanks to https://stackoverflow.com/a/5767357
        } else {
            user = 'error'
        }
    } 
    return user;
}


const sleep = (ms) => {
    return new Promise(resolve => setTimeout((resolve), ms));
}