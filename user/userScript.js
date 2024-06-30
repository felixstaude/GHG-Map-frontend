window.addEventListener('load', (e) => {
    window.addEventListener('resize', setFooter());
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
});

function setPosition(x) {
    let link = document.getElementById(`${x}Link`);
    let posX = link.offsetWidth / 2 - 50; // margin to left
    let posY = link.offsetHeight; // margin to bottom from top edge
    let popup = document.getElementById(`${x}Popup`);
    popup.style.left = posX + 'px';
    popup.style.bottom = posY + 'px';
}

function setFooter() {
    let footer = document.getElementsByTagName('footer')[0];
    let move = document.getElementById('footerMove');
    let moveHeight = move.offsetHeight;

    move.style.marginTop = `${moveHeight}px`;
    footer.style.height = moveHeight + 'px';
}