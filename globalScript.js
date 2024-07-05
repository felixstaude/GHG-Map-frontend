// validate token and get username
let lastValidation = sessionStorage.getItem('lastValidation')

async function validateToken(x) {
    let time = new Date().getTime();
    let lastValidation = sessionStorage.getItem('lastValidation')

    if (((lastValidation + 300000) < time) || !lastValidation) {
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
                let lastValidation = new Date().getTime();
                sessionStorage.setItem('lastValidation', lastValidation);
                console.log('%c' + 'validation via API successfull', 'color:#6f6; background-color:#050; border-radius:3px; padding:1px');
            }

            const data = await response.json();
            data.valid= true;
            localStorage.setItem('userdata', JSON.stringify(data));
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

window.addEventListener('load', async (e)=> {
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

                    accountDetails.href = `http://localhost:8080/user#${localStorage.getItem('username')}`
                    accountDetails.innerHTML = `&nbsp;${localStorage.getItem('username')}`;
                    accountDetails.appendChild(ppImg);
                }
            } catch (error) {
                throw error;
            }
        }
    }/* else {
        let loginPref = localStorage.getItem('loginPref');

        if (loginPref === null) {
            if (window.confirm('Twitch-Login ist abgelaufen\nMelde dich neu an oder fahre ohne Anmeldung fort') === true) {
                localStorage.setItem('loginPref', true);
                window.location.replace('http://localhost:8080/login/');
            } else {
                localStorage.setItem('loginPref', false);
            }
        }
    }*/
});



// Charlie Stuff
function openNav() {
    document.getElementById("mySidenav").style.right = "0";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.right = "-270px";
}