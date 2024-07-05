window.addEventListener('load', async function() {
    let map = document.getElementById('linkMap');
    let login = document.getElementById('linkLogin');
    let search = document.getElementById('linkSearch');

    let mapEl = document.getElementById('mapEl');
    let loginEl = document.getElementById('loginEl');
    let searchEl = document.getElementById('searchEl');

    let width = window.innerWidth;
    let factor = width / 3.5;
    
    //set size of backgound for nav elements
    map.style.backgroundSize = `${factor}%`;
    login.style.backgroundSize = `${factor}%`;
    search.style.backgroundSize = `${factor}%`;
    setBGOffset(map,login,search);

    let accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        const data = await validateToken(accessToken);
        loginEl.textContent = `Hallo ${data.login}`;
    }

    //  --  hover effect for navigation buttons
    //make nav white on hover
    map.addEventListener('mouseover', (e) => (navHover(e,mapEl,'#fff', 'transparent')))
    login.addEventListener('mouseover', (e) => (navHover(e,loginEl,'#fff', 'transparent')))
    search.addEventListener('mouseover', (e) => (navHover(e,searchEl,'#fff', 'transparent')))
    
    //make nav bg back to transparent/bg-image 
    map.addEventListener('mouseout', (e) => (navHover(e,mapEl,'transparent','#fff')))
    login.addEventListener('mouseout', (e) => (navHover(e,loginEl,'transparent','#fff')))
    search.addEventListener('mouseout', (e) => (navHover(e,searchEl,'transparent','#fff')))

    //  --  move footer when user has mouse
    let move = document.getElementById('footerMove');

    setFooter();

    if (matchMedia('(pointer:fine)').matches) {
        window.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) { // user scrolling down when delta is positive
                move.classList.add('footerTasty') //show footer
            } else if (e.deltaY < 0) {
                move.classList.remove('footerTasty') // hide footer -- thanks to angetange for the class names 😄
            }
        })
    } else {
        let start;
        let length;
        window.addEventListener('touchstart', (e) => {
            start = e.changedTouches[0].clientY;
        });
        window.addEventListener('touchend', (e) => {
            length = start - e.changedTouches[0].clientY;
            if (length > 20) {
                move.classList.add('footerTasty');
            } else if (length < 0) {
                move.classList.remove('footerTasty');
            }
        });
    }

    //  --  set position for popups to make them stick to "Link"
    setPosition('bxrbeq');setPosition('felix');setPosition('charlie');

    //   --  searchbar
    let box = document.getElementById('searchBox');
    let lable = document.getElementById('searchLable');

    // move in field of view and back out
    search.addEventListener('click', (e) => {
        let x;
        let element = document.getElementById('searchElement');
        if (element.offsetTop < document.getElementsByTagName('header')[0].offsetHeight + 20) {
            x = 0;
        } else {
            x = 110;
        }
        let t = document.getElementsByTagName('header')[0].offsetHeight + 20;
        moveSearchBox(element, x, t);

        let alertBox = document.getElementById('searchAlert');
        if (alertBox.offsetTop > 35) {
            moveSearchBox(alertBox, 149, 50);
        }
    });

    document.getElementById('hideSearch').addEventListener('click', (e) => {
        let t = document.getElementsByTagName('header')[0].offsetHeight + 20;
        let element = document.getElementById('searchElement');
        moveSearchBox(element, 110, t);

        let alertBox = document.getElementById('searchAlert');
        if (alertBox.offsetTop > 35) {
            moveSearchBox(alertBox, 149, 50);
        }
    });

    box.addEventListener('focusin', (e) => {lable.classList.add('searchnoLabel');});
    box.addEventListener('focusout', (e) => {if(box.value.split('').length === 0){lable.classList.remove('searchnoLabel');}});

    // actual search function with verification
    box.addEventListener('input', (e) =>{
        let alertBox = document.getElementById('searchAlert');

        if (alertBox.offsetTop > 35) { //hide alertbox
            moveSearchBox(alertBox, 149, 50);
            searchAlert.style.height = '100%';
            searchAlertText.textContent = '';
        }

        const input = document.getElementById('searchBox').value;

        if (input.length > 0) { // hide text in teh background
            lable.classList.add('searchnoLabel');        
        } else {
            lable.classList.remove('searchnoLabel');        
        }
    });

    document.getElementById('searchUser').addEventListener('click', searchUserOnPage);
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchUserOnPage();
        }
    })

    async function searchUserOnPage() {
        console.log('searching...')
        let user = document.getElementById('searchBox').value;
        let verifyInput = user.split('').length > 0; // verify input
        let alertBox = document.getElementById('searchAlert');
        let searchAlertText = document.getElementById('searchAlertText');

        if (verifyInput) {
            try {
                const response = await fetch(`https://api.twitch.tv/helix/users?login=${user}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Client-Id': 'aof6xcm9xha35dqsm087mqowout2p6'
                    }
                });
        
                if (!response.ok) {
                    alertBox.className = 'searchAlertError';
                    searchAlertText.textContent = 'Bitte stelle sicher, dass du eine aktive Internetverbindung hast und angemeldet bist'; // useris not logged in, other issues
                    searchAlert.style.height = 'fit-content';
                    moveSearchBox(alertBox, 0, 50);
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const data = await response.json();
                console.log(data);

                if (data.data.length > 0){
                    console.log(data.data[0].id, data.data[0].login);
                    alertBox.className = 'searchAlertTwitch';
                    searchAlertText.textContent = `${data.data[0].login} hat keine Pins gesetzt`; // twitch users exits but is not in the map database
                    
                    // send id to backend end verify user has pins
                    //alertBox.className = 'searchAlertSuccess';
                    //searchAlertText.innerHTML = `<a href="/user/u#${user}" style="color:#00ff00;width:100%;heigth:100%;">${user}</a>`; // link erstellen
                } else {
                    alertBox.className = 'searchAlertError';
                    searchAlertText.textContent = `${user} konnte nicht gefunden werden`; // user has no twitch account
                }
            } catch (error) {
                throw error;
            }
        } else if (alertBox.offsetTop <= 0) {
            alertBox.className = 'searchAlertError';
            searchAlertText.textContent = 'Bitte gib einen Usernamen ein'; // no input but search
        }
        searchAlert.style.height = 'fit-content';
        moveSearchBox(alertBox, 0, 50);
    }
});

async function moveSearchBox(e, x, t) {
    let progress = 0;
    while (progress <= t) {
        x++;
        progress++;
        let a = - (t / 10000);
        let b = t * 0.02;
        let vt = Math.ceil(a * (x * x) + b * x);
        e.style.top = `${vt}px`;
        await sleep(1);
    }
}

function setPosition(x) {
    let link = document.getElementById(`${x}Link`);
    let posX = link.offsetWidth / 2 - 50; // margin to left
    let posY = link.offsetHeight; // margin to bottom from top edge
    let popup = document.getElementById(`${x}Popup`);
    popup.style.left = posX + 'px';
    popup.style.bottom = posY + 'px';
}

window.addEventListener('resize', function(){
    let map = document.getElementById('linkMap');
    let login = document.getElementById('linkLogin');
    let search = document.getElementById('linkSearch');
    let width = window.innerWidth;
    let factor = width / 3.5;
    
    //set size of backgound for nav elements 
    map.style.backgroundSize = `${factor}%`;
    login.style.backgroundSize = `${factor}%`;
    search.style.backgroundSize = `${factor}%`;
    setBGOffset(map,login,search);
    setFooter();
});

function setFooter() {
    let footer = document.getElementsByTagName('footer')[0];
    let move = document.getElementById('footerMove');
    let moveHeight = move.offsetHeight;

    move.style.marginTop = `${moveHeight}px`;
    footer.style.height = moveHeight + 'px';
}

function setBGOffset(a,b,c) {
    let mw =  document.getElementsByTagName('main')[0].offsetWidth;
    let mh = document.getElementsByTagName('main')[0].offsetHeight;

    // top margin
    let aTop = (mw / 2 - mh / 2) + a.offsetTop;
    let bTop = (mw / 2 - mh / 2) + b.offsetTop;
    let cTop = (mw / 2 - mh / 2) + c.offsetTop;

    a.style.backgroundPositionX = `-${a.offsetLeft}px`; // set "left margin"
    a.style.backgroundPositionY = `-${aTop}px`; // set "top magin"

    b.style.backgroundPositionX = `-${b.offsetLeft}px`;
    b.style.backgroundPositionY = `-${bTop}px`;

    c.style.backgroundPositionX = `-${c.offsetLeft}px`;
    c.style.backgroundPositionY = `-${cTop}px`;
}

async function navHover(a,e,c1,c2) {
    let x = a.offsetX;
    let y = a.offsetY;
    if(350<x){x=350;}else if(x<0){x=0};
    if(100<y){y=100;}else if(y<0){y=0};
    let progress = 0;

    while (progress < 100) {
        e.style.background = `radial-gradient(circle at ${x}px ${y}px, ${c1} ${progress}%, ${c2} ${progress + 10}%)`;
        progress+=2;
        await sleep(1);
    };
}
const sleep = (ms) => {
    return new Promise(resolve => setTimeout((resolve), ms));
}

// bin neidisch 🥹 (kontext: felix hat kiz album und merch)


function test() {
    const results = [];
    let i = 0;
    for (i=0;i<50;i++) {
        let start = new Date().getTime();
        setTimeout(() => {
            let end = new Date().getTime();
            results.push(end-start);
            i++;
        }, 10);
    }
    setTimeout(() => {
        let sum = results.reduce((previous, current) => current += previous);
        let avg = Math.round(sum / results.length * 100) / 100;
        console.log(`Im Schnitt hat der 10ms Timeout ${avg}ms gedauert`);
    }, 600);
}

const { userAgent } = navigator
if (userAgent.includes('Firefox/')) {
    // Firefox
    console.log(`Firefox v${userAgent.split('Firefox/')[1]}`)
    window.alert('du benutzt mozilla. Die Seite ist optimal auf Chromium basierende Browser abgestimmt, was du bemerken wirst. Wenn etwas nicht funktioniert, melde es @bxrbeq oder benutzte einen anderen Browser.')
}
