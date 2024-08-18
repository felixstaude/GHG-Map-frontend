document.addEventListener('DOMContentLoaded', async () => {

    // -- get stats for day, month, year 
    let today = new Date();
    let d = today.getDate();
    d = (d < 10) ? '0' & d : d;
    let m = today.getMonth() + 1;
    m = (m < 10) ? `0${m}` : m;
    let y = today.getFullYear();

    const rDay = await fetch(`http://localhost:8080/api/statistics/pins/day?day=${d}&month=${m}&year=${y}`, {
        method: 'GET'
    });
    const rMonth = await fetch(`http://localhost:8080/api/statistics/pins/month?month=${m}&year=${y}`, {
        method: 'GET'
    });
    const rYear = await fetch(`http://localhost:8080/api/statistics/pins/year?year=${y}`, {
        method: 'GET'
    });

    /*const rDay = await fetch(`http://localhost:8080/api/statistics/pins/day.txt`, {
        method: 'GET'
    });
    const rMonth = await fetch(`http://localhost:8080/api/statistics/pins/month.txt`, {
        method: 'GET'
    });
    const rYear = await fetch(`http://localhost:8080/api/statistics/pins/year.txt`, {
        method: 'GET'
    });*/
    
    let dDay = await rDay.text();
    let dMonth = await rMonth.text();
    let dYear = await rYear.text();

    // -- auto stats
    number('day',dDay);
    await sleep(500);
    number('month',dMonth);
    await sleep(500);
    number('year',dYear);

    // -- stats requested by the user
    let btn = document.getElementById('usersRequest');
    btn.addEventListener('click', async () => {
        // search for time
        if (btn.textContent === 'Suchen') {
            searchData();
        // reset for another search
        } else {
            btn.classList.remove('number');
            await sleep(10)
            btn.textContent = 'Suchen';
            btn.classList.add('button');

            document.getElementsByName('year')[0].value = '';
            coi('year','JJJJ')
            document.getElementsByName('month')[0].value = '';
            coi('month','MM')
            document.getElementsByName('day')[0].value = '';
            coi('day','TT')
        }
    });
    
    // search for time
    const inputs = Array.from(document.getElementsByTagName('input'));
    inputs.forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {searchData()}
        })            
    });

    // search for time
    async function searchData() {
        y = document.getElementsByName('year')[0].value;
        m = document.getElementsByName('month')[0].value;
        d = document.getElementsByName('day')[0].value;

        if (y.length === 4 && m === '' && d === '') { // on year level
            ok(dYear);
        } else if (y === '') {
            errorMessage('noyear')
        } else if (!(y.length === 4)) {
            errorMessage('year');
        } else if (m.length === 2 && d === '') {   // on month level
            ok(dMonth);
        } else if (!(m.length === 2)) {
            errorMessage('month');
        } else if (d.length === 2) { // on day level
            ok(dDay);
        } else if (!(d.length === 2)) {
            errorMessage('day');
        }
        
        function ok(x) {
            btn.classList.remove ('button');
            btn.classList.add('deactivated');
            btn.textContent = '';
            let parent = document.getElementById('loadingWrapper')
            loadingCircle(1, parent);
            if (x === 0) {
                errorMessage('nodata');
            } else if (x > 0) {
                btn.classList.remove('deactivated');
                btn.classList.add('number');
                btn.textContent = x;
                loadingCircle();
            }
        }
    }
});

async function number(time, count) {
    let valueO = count - Math.floor(count/10) * 10;
    let valueT = (count - valueO - Math.floor(count/100) * 100) / 10;
    let valueH = Math.floor(count / 100);

    document.getElementById(time + 'O').style.marginTop = `-${valueO}em`;
    await sleep(250)
    document.getElementById(time + 'T').style.marginTop = `-${valueT}em`;
    await sleep(150)
    document.getElementById(`${time}H`).style.marginTop = `-${valueH}em`;
};

function coi(el,x) {
    if (document.getElementsByName(el)[0].value.length > 0) {
        document.getElementById(`${el}Ex`).innerHTML = '&nbsp;';
        document.getElementById(`${el}Ex`).classList.add('filled');
    } else {
        document.getElementById(`${el}Ex`).innerHTML = x;
        document.getElementById(`${el}Ex`).classList.remove('filled');
    }
};

async function errorMessage(type) {
    console.log(type);
    let msg;
    let add = '';
    switch (type) {
        case 'noyear':
            msg = 'zumindest ein Jahr';
            break;
        case 'year':
            msg = 'das Jahr vierstellig';
            break;
        case 'month':
            msg = 'den Monat zweistellig';
            break;
        case 'day':
            msg = 'den Tag zweistellig';
            break;
        case 'nodata':
            msg = 'einen anderen Zeitrraum';
            add = 'Es konnten keine Pins gefunden werden'
    }
    const elem = document.createElement('div');
    elem.innerHTML = `Bitte gib ${msg} an :/ ${add}`;
    elem.classList.add('alertSub')
    document.getElementById('alert').appendChild(elem);
    await sleep(1);
    elem.classList.add('showAlert');
    await sleep(5000);
    elem.classList.remove('showAlert');
    await sleep(505)
    elem.remove();
}