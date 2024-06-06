window.addEventListener('load', (e) => {
    // generate link
    let responseType = 'token';
    let clientId = 'aof6xcm9xha35dqsm087mqowout2p6';
    let redirectUri = 'http://localhost:8080/login';
    let scope = 'user%3Aread%3Aemail'
    function generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    let state = generateRandomString(128);
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
        let response = Object.fromEntries(new URLSearchParams(hash));
        //console.log(response);
        let verifyUser = localStorage.getItem('state');
        if (verifyUser = response.state) { //validate response
            localStorage.setItem('accessToken', response.access_token)
            localStorage.setItem('scope', response.scope)
            localStorage.setItem('tokenType', response.token_type)
            loginSuccess();
        } else {
            window.location.replace('../?connectionIssue=1')
        }
    }
});

function loginSuccess() {
    document.getElementById('twitchConnection').remove();
    
    const successElement = document.createElement('div');
    successElement.classList.add('successPopup');
    successElement.innerHTML=`
        <h3>Login Erfolgreich</h3>
        <p>hier kann nach Belieben ein Popup erstellt werden, das kommt, wenn login successful 👍</p>
        <a href="../">Zurück zur Startseite</a>
        `;
    let parent = document.getElementById('wrapper')
    parent.appendChild(successElement);
}