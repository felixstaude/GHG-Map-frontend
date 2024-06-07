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

async function getRefreshToken() {
    
}