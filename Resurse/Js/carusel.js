document.addEventListener("DOMContentLoaded", function () {
    const indicatoriContainer = document.getElementById("carusel-indicatori");
    const continutContainer = document.getElementById("carusel-continut");
    const idCarusel = "carouselProduseAleatoare";

    async function actualizeazaCarusel() {
        try {
            // Preluăm cele 5 produse aleatorii de la ruta de Express
            const raspuns = await fetch("/api/produse-aleatoare");
            const produse = await raspuns.json();

            if (!produse || produse.length === 0) return;

            // Ștergem produsele vechi ca să le punem pe cele noi
            indicatoriContainer.innerHTML = "";
            continutContainer.innerHTML = "";

            produse.forEach((produs, index) => {
                const esteActiv = index === 0 ? "active" : "";

                // 1. Creăm butonul indicator pentru slide-ul curent
                const butonIndicator = document.createElement("button");
                butonIndicator.type = "button";
                butonIndicator.setAttribute("data-bs-target", `#${idCarusel}`);
                butonIndicator.setAttribute("data-bs-slide-to", index);
                if (index === 0) {
                    butonIndicator.className = "active";
                    butonIndicator.setAttribute("aria-current", "true");
                }
                indicatoriContainer.appendChild(butonIndicator);

                // 2. Stabilim calea imaginii (verifică folderul tău din proiect, ex: /resurse/imagini/)
                const calePoza = produs.imagine ? `/Resurse/Imagini/produse/${produs.imagine}` : '/Resurse/Imagini/placeholder.png';

                // 3. Creăm structura slide-ului (Imagine + Captions + Detalii)
                const itemCarusel = document.createElement("div");
                itemCarusel.className = `carousel-item ${esteActiv}`;
                itemCarusel.innerHTML = `
                    <img src="${calePoza}" class="d-block w-50 mx-auto" alt="${produs.nume}" style="max-height: 350px; object-fit: contain;">
                    <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded p-3">
                        <h5 class="text-white">${produs.nume}</h5>
                    </div>
                `;
                continutContainer.appendChild(itemCarusel);
            });

            // Îi spunem Bootstrap-ului să reia controlul peste noile elemente HTML create
            const instantaCarusel = bootstrap.Carousel.getOrCreateInstance(document.getElementById(idCarusel));
            instantaCarusel.to(0); // Începe automat de la primul slide nou adus

        } catch (eroare) {
            console.error("Eroare la reîncărcarea dinamică a caruselului:", eroare);
        }
    }

    // Încărcare imediată la pornirea paginii
    actualizeazaCarusel();

    // Reîncărcare automată la fiecare 15 secunde (15000 milisecunde)
    setInterval(actualizeazaCarusel, 15000);
});