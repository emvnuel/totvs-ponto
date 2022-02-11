import fetch from "node-fetch";

const {BASE_URL, USER, PASSWORD, LATITUDE, LONGITUDE} = process.env;

function getCoockies(cookieHeader) {
    const list = {};

    cookieHeader.split(`;`).forEach(cookie => {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

function currentDate() {
    return new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
}

function currentHour() {
    return new Date().getHours();
}

function hourToMilliseconds(hour) {
    return hour * 3600000;
}

async function getCookiesByLogin() {
    const login = await fetch(`${BASE_URL}/rm/api/rest/auth/login`, {
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
            'Accept': 'application/json, text/plain, */*',
            'x-totvs-app': '0533',
            'sec-ch-ua-mobile': '?0',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
            'sec-ch-ua-platform': '"Windows"',
            'Origin': BASE_URL,
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': `${BASE_URL}/web/app/RH/PortalMeuRH/`,
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cookie': 'DefaultAlias=CorporeRM',
        },
        body: JSON.stringify({ "user": USER, "password": PASSWORD })
    });
    
    return getCoockies(login.headers.get('set-cookie'));;
}

async function registerPoint(cookies) {
    return await fetch(`${BASE_URL}/rm/api/rest/timesheet/clockingsGeolocation/%7Bcurrent%7D`, {
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
            'Accept': 'application/json, text/plain, */*',
            'x-totvs-app': '0533',
            'sec-ch-ua-mobile': '?0',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
            'sec-ch-ua-platform': '"Windows"',
            'Origin': BASE_URL,
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': `${BASE_URL}/web/app/rh/portalmeurh/`,
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cookie': `DefaultAlias=CorporeRM; .ASPXAUTH=${cookies['.ASPXAUTH']}; CorporePrincipal=${cookies['HttpOnly, CorporePrincipal']}`
        },
        body: JSON.stringify({ "latitude": LATITUDE, "longitude": LONGITUDE, "timezone": 180, "date": currentDate(), "hour": hourToMilliseconds(currentHour()) })
    });
}

async function main() {

    const cookies = await getCookiesByLogin();
    const point = await registerPoint(cookies);

    if (point.status === 201) {
        console.log("SUCCESS");
        process.exit(0);
    }
     
    console.log("ERROR");
    process.exit(1);
    
}


main();