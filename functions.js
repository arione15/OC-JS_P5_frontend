async function retrieveFromUrl(url){
    let response = await fetch(url);
    let result = await response.json();
    return result;
}


function getParamFromUrl() {
    const url = new URL(window.location.href); /* window.location.href permet d'obtenir l'url de la page actuelle */
    const paramFromUrl = url.searchParams.get("param");
    return paramFromUrl;
}

