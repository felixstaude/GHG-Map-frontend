let onladTime = new Date().getTime();

window.addEventListener('load', async (e) => {
    // generate link
    let responseType = 'token';
    let clientId = 'aof6xcm9xha35dqsm087mqowout2p6';
    let redirectUri = 'http://localhost:8080/login';
    let scope = 'user%3Aread%3Aemail'
    function generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,._-';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    let state = generateRandomString(114) + "|" + onladTime;
    localStorage.setItem('state', state);
    
    let linkToTwitch = `https://id.twitch.tv/oauth2/authorize
        ?response_type=${responseType}
        &client_id=${clientId}
        &redirect_uri=${redirectUri}
        &scope=${scope}
        &state=${state}`.replace(/\s/g, "");

    document.getElementById('twitchConnection').href = linkToTwitch;

    // get hash if given in url
    let hash = window.location.hash.substring(1);

    let accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        let valid = await validateToken(accessToken);
        if (valid.valid) {
            let parent = document.getElementById('wrapper');
            loadingCircle(1, parent);
            loginSuccess();
        }
    } else if (hash != 'logoutSuccess' && hash.length > 0) {
        let parent = document.getElementById('wrapper');
        loadingCircle(1, parent);
        let response = Object.fromEntries(new URLSearchParams(hash));
        let verifyUser = localStorage.getItem('state');
        
        //validate response to prevent cors attacks
        if ((verifyUser = response.state && response.access_token != 'access_denied')) {
            localStorage.setItem('accessToken', response.access_token)
            loginSuccess();
        } else if (response.access_token === 'access_denied') {
            loginFail();
        }
    } else if (hash === 'logoutSuccess') {
        logoutSuccess();
    }
});

async function loginSuccess() {
    //window.location.hash = '';
    document.getElementById('twitchConnection').remove();

    let accessToken = localStorage.getItem('accessToken');
    const loginData = await validateToken(accessToken);
    let rTT = onladTime + loginData.expires_in; //renew token time in ms

    localStorage.setItem('username', loginData.login);
    localStorage.setItem('userId', loginData.user_id);
    localStorage.setItem('renewLogin', rTT);

    let username = loginData.login;
        
    loadingCircle();
    const responseElement = document.createElement('div');
    responseElement.className = 'popup success';
    responseElement.innerHTML=`
            <h3>Login als <i>${username}</i> erfolgreich</h3>
            <div>
                <a href="../map">Map</a>
                <a href="../">Startseite</a>
            </div>
            <a class="logout" onclick="logout()">Abmelden</a>`;
    let parent = document.getElementById('wrapper');
    parent.appendChild(responseElement);
}

function loginFail() {
    const responseElement = document.createElement('div');
    responseElement.className = 'popup fail';
    responseElement.innerHTML=`
            <h3>Login fehlgeschlagen :/</h3>
            <div>
                <a href="../map">Map</a>
                <a href="../">Startseite</a>
            </div>
        `;
    let parent = document.getElementById('wrapper')
    parent.appendChild(responseElement);
    loadingCircle();
}

function logoutSuccess() {
    window.location.hash = '';
    const responseElement = document.createElement('div');
    responseElement.className = 'popup success';
    responseElement.innerHTML=`
            <h3>Logout Erfolgreich</h3>
            <div>
                <a href="../map">Map</a>
                <a href="../">Startseite</a>
            </div>        `;
    let parent = document.getElementById('wrapper')
    parent.appendChild(responseElement);
}

async function logout() {
    let clientId = 'aof6xcm9xha35dqsm087mqowout2p6';
    let accessToken = encodeURIComponent(localStorage.getItem('accessToken'));
    let bodyString = `client_id=${clientId}&token=${accessToken}`;
    console.log(bodyString)

    const response = await fetch('https://id.twitch.tv/oauth2/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyString
    });
    //const data = await response.json();
    console.log(response.ok);

    let challenge = response.ok;
    if (challenge) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.hash = 'logoutSuccess';
        window.location.reload();
    }
}