window.addEventListener('load', async function() {
    let map = document.getElementById('linkMap');
    let login = document.getElementById('linkLogin');
    let search = document.getElementById('linkSearch');

    let mapEl = document.getElementById('mapEl');
    let loginEl = document.getElementById('loginEl');
    let searchEl = document.getElementById('searchEl');

    let width = window.innerWidth;
    let factor = width / 3.5;
    
    let accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        const data = await validateToken(accessToken);
        loginEl.textContent = `Hallo ${data.login}`;
    }
    //set size of backgound for nav elements
    map.style.backgroundSize = `${factor}%`;
    login.style.backgroundSize = `${factor}%`;
    search.style.backgroundSize = `${factor}%`;
    setBGOffset(map,login,search);

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
    let element = document.getElementById('searchElement');
    let box = document.getElementById('searchBox');
    let lable = document.getElementById('searchLable');

    // move in field of view and back out
    search.addEventListener('click', (e) => {
        let x;
        if (element.offsetTop < document.getElementsByTagName('header')[0].offsetHeight + 20) {
            x = 0;
        } else {
            x = 100;
        }
        moveSearchBox(x);
    });

    document.getElementById('hideSearch').addEventListener('click', (e) => {
        moveSearchBox(100);
    });

    async function moveSearchBox(x) {
        let progress = 0;
        let t = document.getElementsByTagName('header')[0].offsetHeight + 20;
        while (progress <= t) {
            x++;
            progress++;
            let a = - (t / 10000);
            let b = t * 0.02;
            let vt = Math.ceil(a * (x * x) + b * x);
            element.style.top = `${vt}px`;
            await sleep(1);
        }
    }

    box.addEventListener('input', (e) =>{
        const input = document.getElementById('searchBox').value;
        if (input.length > 0) {
            lable.classList.add('searchnoLabel');        
        } else {
            lable.classList.remove('searchnoLabel');        
        }
    });
});

function setPosition(x) {
    let move = document.getElementById('footerMove');
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

async function navHover(a,b,c1,c2) {
    let progress = 0;

    while (progress < 100) {
        b.style.background = `radial-gradient(circle at ${a.offsetX}px ${a.offsetY}px, ${c1} ${progress}%, ${c2} ${progress + 10}%)`;
        progress+=2;
        await sleep(1);
    };
}
const sleep = (ms) => {
    return new Promise(resolve => setTimeout((resolve), ms));
}

// bin neidisch 🥹 (kontext: felix hat kiz album und merch)