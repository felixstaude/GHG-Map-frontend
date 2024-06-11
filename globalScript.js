async function validateToken(x) {
    // validate token and get username

    try {
        const response = await fetch('https://id.twitch.tv/oauth2/validate', {
            method: 'GET',
            headers: {
                'Authorization': `OAuth ${x}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
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

                document.getElementById('loginLink').remove();

                //create link with profile picture
                let accountDetails = document.getElementById('accountDetails');
                const ppImg = document.createElement('img');
                ppImg.src = data.data[0].profile_image_url;
                ppImg.classList.add('userPofilepicture');

                accountDetails.href = `http://localhost:8080/user#${localStorage.getItem('username')}`
                accountDetails.innerHTML = `&nbsp;${localStorage.getItem('username')}`;
                accountDetails.appendChild(ppImg);        
            } catch (error) {
                throw error;
            }
        }
    }
});



// Charlie Stuff
function openNav() {
    document.getElementById("mySidenav").style.right = "0";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.right = "-270px";
}