window.addEventListener('load', (e) => {
    // -- scroll pictures by dragging --
    let pictureScroll = document.getElementById('picturesDraggableSlider');
    let start;
    let notScroll = true;
    let currentScroll
    pictureScroll.addEventListener('mousedown', (e) => {
        document.getElementsByTagName('body')[0].style.cursor = 'grabbing';
        pictureScroll.style.cursor = 'grabbing';
        start = e.pageX;
        notScroll = false;
        currentScroll = pictureScroll.scrollLeft;
    });

    document.getElementsByTagName('body')[0].addEventListener('mousemove', (e) => {
        if (!notScroll) {
            let end = e.pageX;
            pictureScroll.scrollLeft = currentScroll + start - end;
            window.getSelection().removeAllRanges();
        }
    });

    window.addEventListener('mouseup', (e) => {
        notScroll = true;
        document.getElementsByTagName('body')[0].style.cursor = '';
        pictureScroll.style.cursor = '';
    })

    userData();
});

// for when the backend is finally ready Aware
async function userData() {
    let user = localStorage.getItem('username').toLowerCase();
    let hash = window.location.hash
    let requestedUser = hash.replace('#', '');
    if (user === requestedUser) {
        sessionStorage.removeItem('lastValidation');
        const validation = await validateToken(localStorage.getItem('accessToken'))
        let validatedUser = validation.login;
        if (validatedUser === requestedUser) {
            // add bin to every point floating right + a bin at top right of the pictures on hover to remove
        }
    }
}

function usernametest() {
    const elements = document.getElementsByClassName('userName');
    Array.from(elements).forEach((element) => {
        element.textContent = 'bxrbeq';
    });
}