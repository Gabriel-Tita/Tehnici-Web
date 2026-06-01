// În fișierul tău /Resurse/Js/produs.js

function setCookie(nume, val, timpExpirareMilisecunde) {
    let d = new Date();
    d.setTime(d.getTime() + timpExpirareMilisecunde);
    document.cookie = `${nume}=${encodeURIComponent(val)}; expires=${d.toUTCString()}; path=/`;
}

window.addEventListener("DOMContentLoaded", function() {
    // Căutăm tagul span care are clasa "nume" în pagina EJS
    let elementNume = document.querySelector("#art-produs .nume");
    
    if (elementNume) {
        let numeProdusCurent = elementNume.innerText.trim();
        
        if (numeProdusCurent) {
            // Îl salvăm pentru jumătate de zi (43200000 ms)
            setCookie("ultimul_produs", numeProdusCurent, 43200000);
            console.log("S-a salvat în cookie ultimul produs vizitat: " + numeProdusCurent);
        }
    } else {
        console.log("Nu s-a găsit elementul cu clasa .nume pe această pagină.");
    }
});