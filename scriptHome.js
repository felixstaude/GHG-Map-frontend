window.addEventListener('load', function() {
    let map = document.getElementById('linkMap');
    let login = document.getElementById('linkLogin');
    let search = document.getElementById('linkSearch');
    let width = window.innerWidth;
    let factor = width / 3.5;
    
    map.style.backgroundSize = `${factor}%`;
    login.style.backgroundSize = `${factor}%`;
    search.style.backgroundSize = `${factor}%`;
    setBGOffset(map,login,search);


    let mapEl = document.getElementById('mapEl');
    let loginEl = document.getElementById('loginEl');
    let searchEl = document.getElementById('searchEl');
    map.addEventListener('mouseover', (e) => (userHover(e,mapEl,'#fff', 'transparent')))
    login.addEventListener('mouseover', (e) => (userHover(e,loginEl,'#fff', 'transparent')))
    search.addEventListener('mouseover', (e) => (userHover(e,searchEl,'#fff', 'transparent')))
    
    map.addEventListener('mouseout', (e) => (userHover(e,mapEl,'transparent','#fff')))
    login.addEventListener('mouseout', (e) => (userHover(e,loginEl,'transparent','#fff')))
    search.addEventListener('mouseout', (e) => (userHover(e,searchEl,'transparent','#fff')))
});

window.addEventListener('resize', function(){
    let map = document.getElementById('linkMap');
    let login = document.getElementById('linkLogin');
    let search = document.getElementById('linkSearch');
    let width = window.innerWidth;
    let factor = width / 3.5;
    
    map.style.backgroundSize = `${factor}%`;
    login.style.backgroundSize = `${factor}%`;
    search.style.backgroundSize = `${factor}%`;
    setBGOffset(map,login,search);
});

function setBGOffset(a,b,c) {
    a.style.backgroundPositionX = `-${a.offsetLeft}px`;
    // a.style.backgroundPositionY = `${a.offsetTop}px`; irgendwie auch mit Höhe vom Bild verrechnen, damit es an das gecropte Bild angepasst werden kann
    b.style.backgroundPositionX = `-${b.offsetLeft}px`;
    c.style.backgroundPositionX = `-${c.offsetLeft}px`;
}

async function userHover(a,b,c1,c2) {
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