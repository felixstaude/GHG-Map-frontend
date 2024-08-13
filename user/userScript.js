window.addEventListener('load', () => {
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

    window.addEventListener('mouseup', () => {
        notScroll = true;
        document.getElementsByTagName('body')[0].style.cursor = '';
        pictureScroll.style.cursor = '';
    })

    userData();
});

async function userData() {
    let hash = window.location.hash
    let requestedUser = hash.replace('#', '');
    sessionStorage.setItem('lastValidation', 0);
    const validation = await validateToken(localStorage.getItem('accessToken'));
    let validatedUser = validation.user_id;

    const response = await fetch(`http://localhost:8080/api/pin/get/user/userId.json`, {                  //only for testing purpose Okayge
    //const response = await fetch(`http://localhost:8080/api/pin/get/user?userId=${localStorage.userId}`, {
        method: 'GET'
    })
    const data = await response.json();
    if (data.ok) {
        let user = await getUser(requestedUser);

        document.getElementsByTagName('title')[0].textContent = 'GHG-Map | ' + user.display_name;
        document.getElementById('userPfp').src = user.profile_image_url;
        const usernameEls = Array.from(document.getElementsByClassName('userName'));
        usernameEls.forEach(El => {
            El.textContent = user.display_name;
        })
        
        
        data.pins.forEach(async pin => {
            //list
            const line = document.createElement('tr');
            line.setAttribute('onclick', "this.classList.toggle('focus')");
            line.setAttribute('id', `pin-${pin.pinId}`);
            line.setAttribute('onclick', `highlight(${pin.pinId})`)

            const title = document.createElement('td');
            const titleLink = document.createElement('a');
            titleLink.setAttribute('id', `li-`)
            titleLink.setAttribute('href', `http://localhost:8080/${pin.imagePath}`);
            titleLink.setAttribute('target', '_blank');
            titleLink.textContent = pin.description;

            const location = document.createElement('td');
            const locationLink = document.createElement('a');
            locationLink.setAttribute('href', `../map/?lat=${pin.lat}&lng=${pin.lng}&zoom=14`);
            locationLink.setAttribute('target', '_blank');
            locationLink.classList.add('pinCoords');
            locationLink.textContent = pin.town;

            title.appendChild(titleLink);
            line.appendChild(title);
            location.appendChild(locationLink);
            line.appendChild(location);
            if(validatedUser === requestedUser) {
                const del = document.createElement('td');
                del.setAttribute('onclick', `decision('delete', 'DELETE', ${pin.pinId})`);
                del.classList.add('deletePin');
                del.innerHTML = '&nbsp;🪣';
                line.appendChild(del);
            }
            document.getElementById('pinList').appendChild(line);

            //pictures
            const wrapper = document.createElement('div');
            wrapper.setAttribute('id', `img-${pin.pinId}`)

            const img = document.createElement('img');
            img.setAttribute('src', `../${pin.imagePath}`);
            img.setAttribute('onload', `this.style.width = this.width + 'px'`)
            //probably link to the pin in the list
            img.classList.add('imgImg');

            const name = document.createElement('div');
            name.classList.add('imgName');
            name.textContent = pin.description;

            wrapper.appendChild(img);
            wrapper.appendChild(name);
            document.getElementById('picturesDraggableSlider').appendChild(wrapper);
        })
    } else if (!data.ok){
        console.log('no good :/');
    }
}

//highlight function for picture / li
async function highlight(id) {
    //picture
    let iParent = document.getElementById('picturesDraggableSlider');
    let iChild = document.getElementById(`img-${id}`);

    let iPLeft = iParent.getBoundingClientRect().left;
    let iCLeft = iChild.getBoundingClientRect().left;

    let iScrollStart = iCLeft - iPLeft;

    let iScroll = iParent.scrollLeft;
    let x = 0;
    let y = 0;
    
    if (iScrollStart > 0) {         //scroll to the right  
        while (x <= 100) {
            y = smoothTransition(x, iScrollStart);
            iScroll = iScroll + y;
            iParent.scrollLeft = iScroll;
            x+=1;
            await sleep(1);
        }
    } else if (iScrollStart < 0) {  // scroll to the left
        while (x <= 100) {
            y = smoothTransition(x, iScrollStart);
            iScroll = iScroll + y;
            iParent.scrollLeft = iScroll;
            x+=1;
            await sleep(1);
        }
    }
}

function smoothTransition(x, A) {
    const a = -3 * A / 500000; // Berechneter Koeffizient für das quadratische Glied
    const b = -100 * a; // Linearer Koeffizient basierend auf den Bedingungen
    
    return a * x * x + b * x;
}