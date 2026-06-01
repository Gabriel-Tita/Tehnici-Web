
// //setCookie("a",10, 1000)
// function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde
//     d=new Date();
//     d.setTime(d.getTime()+timpExpirare)
//     document.cookie=`${nume}=${val}; expires=${d.toUTCString()}`;
// }

// function getCookie(nume){
//     vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"]
//     for(let param of vectorParametri){
//         if (param.trim().startsWith(nume+"="))
//             return param.split("=")[1]
//     }
//     return null;
// }

// function deleteCookie(nume){
//     console.log(`${nume}; expires=${(new Date()).toUTCString()}`)
//     document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
// }


// window.addEventListener("load", function(){
//     if (getCookie("acceptat_banner")){
//         document.getElementById("banner").style.display="none";
//     }

//     this.document.getElementById("ok_cookies").onclick=function(){
//         setCookie("acceptat_banner",true,2000);
//         document.getElementById("banner").style.display="none"
//     }
// })


// Codul tău actualizat:

function setCookie(nume, val, timpExpirare){ // timpExpirare in milisecunde
    let d = new Date();
    d.setTime(d.getTime() + timpExpirare);
    // CORECȚIE: Am adăugat ;path=/ pentru ca cookie-ul să fie vizibil pe tot site-ul
    document.cookie = `${nume}=${val}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(nume){
    let vectorParametri = document.cookie.split(";"); 
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume + "="))
            return param.split("=")[1];
    }
    return null;
}

function deleteCookie(nume){
    // CORECȚIE: Pentru ștergere sigură, setăm o dată din trecut (1970) și path=/
    document.cookie = `${nume}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    console.log(`Cookie-ul ${nume} a fost sters.`);
}

// CERINȚĂ OBLIGATORIE: Funcția care șterge toate cookie-urile
function deleteAllCookies() {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        deleteCookie(name); // le ștergem pe rând folosind funcția de mai sus
    }
    console.log("Toate cookie-urile au fost sterse.");
}


window.addEventListener("load", function(){
    // Verificăm dacă ID-ul din HTML-ul tău este "banner"
    let bannerElement = document.getElementById("banner");
    
    if (getCookie("acceptat_banner")){
        if(bannerElement) bannerElement.style.display = "none";
    }

    let btnOk = document.getElementById("ok_cookies");
    if(btnOk) {
        btnOk.onclick = function(){
            // Timpul de expirare cerut pentru jumătate de zi = 12 ore * 60 min * 60 sec * 1000 ms = 43200000 ms
            // Pentru prezentare, profesorul a zis 5-6 secunde (ex: 6000 ms). Tu ai pus 2000 ms (2 secunde), e perfect pentru test!
            setCookie("acceptat_banner", true, 120000); 
            
            if(bannerElement) bannerElement.style.display = "none";
        }
    }

    // CERINȚĂ: Crearea celui de-al doilea cookie (Ex: ultima pagină accesată)
    // Se salvează automat la fiecare încărcare de pagină
    setCookie("ultima_pagina", window.location.pathname, 600000); // expiră în 10 minute
});