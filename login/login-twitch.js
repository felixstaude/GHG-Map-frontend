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
        &state=${state}`.replace(/\s/g, "");;

    document.getElementById('twitchConnection').href = linkToTwitch;

    // get hash if given in url
    let hash = window.location.hash.substring(1);


    if (hash) {
        loadingCircle('start');
        let response = Object.fromEntries(new URLSearchParams(hash));
        let verifyUser = localStorage.getItem('state');
        
        //validate response to prevent cors attacks
        if ((verifyUser = response.state && response.access_token != 'access_denied')) {
            localStorage.setItem('accessToken', response.access_token)
            loginSuccess();
        } else if (response.access_token === 'access_denied') {
            loginFail();
        }
    }
    
    let valid = await validateToken(localStorage.getItem('accessToken'));
    if (valid.valid) {
        loadingCircle('start');
        loginSuccess();
    }
});

async function loginSuccess() {
    window.location.hash = '';
    document.getElementById('twitchConnection').remove();

    let accessToken = localStorage.getItem('accessToken');
    const loginData = await validateToken(accessToken);
    let rTT = onladTime + loginData.expires_in; //renew token time in ms

    localStorage.setItem('username', loginData.login)
    localStorage.setItem('userId', loginData.user_id)
    localStorage.setItem('renewLogin', rTT)

    let username = loginData.login;
    loadingCircle(username);
        
    const responseElement = document.createElement('div');
    responseElement.classList.add('successPopup');
    responseElement.innerHTML=`
        <h3>Login als <i>${username}</i> erfolgreich</h3>
        <p>hier kann nach Belieben ein Popup erstellt werden, das kommt, wenn login successful <a href="../map">👍</a></p>
        <a href="../">Zurück zur Startseite</a>
        `;
    let parent = document.getElementById('wrapper')
    parent.appendChild(responseElement);
}

function loginFail() {
    const responseElement = document.createElement('div');
    responseElement.classList.add('failPopup');
    responseElement.innerHTML=`
        <h3>Login fehlgeschlagen</h3>
        <p>hier kann nach Belieben ein Popup erstellt werden, das kommt, wenn user abgelehnt hat :/</p>
        <a href="../">Zurück zur Startseite</a>
        `;
    let parent = document.getElementById('wrapper')
    parent.appendChild(responseElement);
}

function loadingCircle(x) { // Platz um eine Ladeschnecke einzubauen, die user zeigt, dass weitere Daten geladen werden
    if (x === 'start') {
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('loadingCircle');
        loadingElement.setAttribute('id', 'loadingWrapper')
        loadingElement.innerHTML='&nbsp;';
        let parent = document.getElementById('wrapper')
        parent.appendChild(loadingElement);
    } else if (x) {
        document.getElementById('loadingWrapper').remove();
    }
}