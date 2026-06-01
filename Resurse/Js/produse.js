window.onload = function() {
    
    document.getElementById("inp-text").oninput = function() {
        if (this.value.trim() !== "") {
            this.classList.remove("is-invalid");
            
            let mesajEroare = document.getElementById("eroare-validare");
            if (mesajEroare.innerHTML.includes("textarea")) {
                mesajEroare.innerHTML = "";
            }
        }
    };

    function valideazaInputuri() {
    let inpNume = document.getElementById("inp-nume");
    let inpText = document.getElementById("inp-text");
    let inpBrand = document.getElementById("inp-brand");
    let mesajEroare = document.getElementById("eroare-validare");

    // Resetăm erorile anterioare (curățăm stilul și mesajul)
    inpNume.style.border = "";
    inpText.style.border = "";
    inpBrand.style.border = "";
    mesajEroare.innerHTML = "";

    // let verif=true;

    // Regula 1: Textarea-ul de cuvinte cheie să nu fie gol
    // if (inpText.value.trim() === "") {
    //     inpText.style.border = "2px solid red";
    //     mesajEroare.innerHTML = "Eroare: Căsuța de cuvinte cheie (textarea) nu poate fi goală la filtrare!";
    //     // verif = false;
    //     return false;
    // }

    if (inpText.value.trim() === "") {
        // SETARE PRIN JAVASCRIPT: Adăugăm clasa is-invalid cerută de Bootstrap
        inpText.classList.add("is-invalid"); 
        
        mesajEroare.innerHTML = "Eroare: Căsuța de cuvinte cheie (textarea) nu poate fi goală!";
        return false;
    }

    // Regula 2 modificată: Numele are voie cu cifre/litere, dar FĂRĂ caractere speciale
    // Acest Regex caută orice caracter care NU este literă (a-z, A-Z), cifră (0-9) sau spațiu (\s)
    let regexSpeciale = /[^a-zA-Z0-9\s]/;
    
    if (regexSpeciale.test(inpNume.value)) {
        inpNume.style.border = "2px solid red";
        mesajEroare.innerHTML = "Eroare: Numele produsului nu poate conține caractere speciale (@, #, $, etc.)!";
        // verif = false;
        return false;
    }

    let regexSpeciale2 = /[^a-zA-Z\s]/;
    // Regula 3: Brandul (datalist) să urmeze aceeași regulă (fără caractere speciale)
    if (inpBrand.value.trim() !== "" && regexSpeciale2.test(inpBrand.value)) {
        inpBrand.style.border = "2px solid red";
        mesajEroare.innerHTML = "Eroare: Brandul selectat nu poate conține cifre sau caractere speciale (@, #, $, etc.)!";
        // verif = false;
        return false;
    }

    return true; // Totul este valid
}

    const ordineaInitiala = Array.from(document.getElementsByClassName("produs"));
    
    document.getElementById("inp-pret").onchange = function() {
        let val = parseFloat(this.value.trim()).toFixed(2)
        document.getElementById("infoRange").innerHTML = `(${val})`
    }

    document.getElementById("inp-pret").onmousemove = function() {
        let val = parseFloat(this.value.trim()).toFixed(2)
        document.getElementById("infoRange").innerHTML = `(${val})`
    }
    
    document.getElementById("filtrare").onclick = function() {
        
        if (!valideazaInputuri()) {
            return; 
        }

        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase()
        
        

        let grupRadio = document.getElementsByName("gr_rad")
        let memorieRamMin, memorieRamMax, isToate=false;
        for(let rad of grupRadio) {
            if(rad.checked) {
                if(rad.value!="toate"){
                    [memorieRamMin, memorieRamMax] = rad.value.split(":")
                    memorieRamMin = parseInt(memorieRamMin)
                    memorieRamMax = parseInt(memorieRamMax)
                }
                else
                {
                    isToate=true
                }
                break
            }
        }

        let inpPretMin = parseFloat(document.getElementById("inp-pret").value.trim())

        let inpAnLansare = document.getElementById("inp-an_lansare").value.trim().toLowerCase()


        let checkboxes = document.getElementsByName("gr_cont")
        let valoriBifate = []
        for(let chk of checkboxes) {
            if(chk.checked) {
                valoriBifate.push(chk.value.trim().toLowerCase())
            }
        }

        let selectculori = document.getElementById("i_selmult")
        let valoriSelectate = []
        for(let opt of selectculori.options) {
            if(opt.selected) {
                valoriSelectate.push(opt.value.trim().toLowerCase())
            }
        }

        let inpBrand = document.getElementById("inp-brand").value.trim().toLowerCase()

        let inpText = document.getElementById("inp-text").value.trim().toLowerCase()
        let vectorText=inpText!=="" ? inpText.split(",") : []
        vectorText = vectorText.map(cuv => cuv.trim()).filter(cuv => cuv!=="")

        let produseAfisate=0;
        let produse = document.getElementsByClassName("produs")
        for(let prod of produse) {
            prod.style.display = "none"
            
            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            let cond1=nume.includes(inpNume)

            let memorieRam = parseInt(prod.getElementsByClassName("val_ram")[0].innerHTML.trim())
            let cond2 = (memorieRam >= memorieRamMin && memorieRam < memorieRamMax) || isToate

            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let cond3 = pret>=inpPretMin

            let anLansare = prod.getElementsByClassName("val-an_lansare")[0].innerHTML.trim().toLowerCase()
            let cond4 = anLansare==inpAnLansare || inpAnLansare=="toate"
            
            let brand = prod.getElementsByClassName("val-brand")[0].innerHTML.trim().toLowerCase()

            let continut = prod.getElementsByClassName("val-continut")[0].innerHTML.trim().toLowerCase()
            cond5=false
            if(valoriBifate.length!=0) {
                cond5 = valoriBifate.some(val => continut.includes(val))           
            }

            let culoare = prod.getElementsByClassName("val-culoare")[0].innerHTML.trim().toLowerCase()
            let cond6=false
            if(valoriSelectate.length!=0 && valoriSelectate.includes(culoare)) {
                cond6=true
            }

            let cond7=false
            if(inpBrand==="") {
                cond7=true
            }
            else{
                cond7 = brand.includes(inpBrand)
            }

            let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase()
            let cond8 = false

            if(vectorText.length==0) {
                cond8=true
            }else {
                cond8 = vectorText.some(cuv => descriere.includes(cuv))
            }

            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
                prod.style.display = "block"
                produseAfisate++;
            }
        }

        let numarProduseElement = document.getElementById("numar-produse");
        numarProduseElement.innerText = `${produseAfisate} produse găsite`;

        let mesajbun=document.getElementById("mesajbun");
        let message=document.getElementById("no-products-message");
        if(produseAfisate==0)
        {
            mesajbun.classList.add('hidden');
            message.classList.remove('hidden');
        }
        else
        {
            mesajbun.classList.remove('hidden');
            message.classList.add('hidden');
        }
    }

    document.getElementById("resetare").onclick = function() {
        if(confirm("Sigur doriți să resetați filtrele?")) {
            document.getElementById("inp-nume").value = ""

            document.getElementById("inp-pret").value = 0
            let sliderPret = document.getElementById("inp-pret");
            sliderPret.value = sliderPret.min;
            let minimNumeric = parseFloat(sliderPret.min);
            document.getElementById("infoRange").innerHTML = `(${minimNumeric.toFixed(2)})`;
            // document.getElementById("infoRange").innerHTML = "(0)"

            document.getElementById("inp-an_lansare").value = "toate"
            document.getElementById("i_rad4").checked = true

            // document.getElementById("i_cont0").checked = true
            // document.getElementById("i_cont1").checked = true
            // document.getElementById("i_cont2").checked = true
            // document.getElementById("i_cont3").checked = true
            let checkboxes = document.getElementsByName("gr_cont")
            for(let chk of checkboxes) {
                chk.checked = true
            }

            document.getElementById("inp-text").value = ""
            document.getElementById("inp-brand").value = ""
            
            document.getElementById("inp-text").classList.remove("is-invalid");

            document.getElementById("inp-nume").style.border = "";
            document.getElementById("inp-text").style.border = "";
            document.getElementById("inp-brand").style.border = "";
            document.getElementById("eroare-validare").innerHTML = "";

            let selectculori = document.getElementById("i_selmult")
            for(let opt of selectculori.options) {
                opt.selected = true
            }



            let produse = document.getElementsByClassName("produs")
            for(let prod of ordineaInitiala) {
                prod.style.display = "block"
                prod.parentElement.appendChild(prod)
            }


            let mesajbun=document.getElementById("mesajbun");
            let message=document.getElementById("no-products-message");
            mesajbun.classList.remove('hidden');
            message.classList.add('hidden');

            let numarProduseElement = document.getElementById("numar-produse");
            numarProduseElement.innerText = `${produse.length} produse găsite`;
        }
    }

function sorteaza(semn) {
    let produse = document.getElementsByClassName("produs")
    let vProduse = Array.from(produse)
    vProduse.sort(function(a,b) {
        let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim())
        let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim())
        if(pretA != pretB) {
            return semn * (pretA - pretB)
        }
        else
        {      
            let continut1 = a.getElementsByClassName("val-continut")[0].innerHTML.trim().toLowerCase().replace(/[{}]/g, "")
            let vectorText1=continut1!=="" ? continut1.split(",") : []
            vectorText1 = vectorText1.map(cuv => cuv.trim()).filter(cuv => cuv!=="")
            let length1=vectorText1.length

            let continut2 = b.getElementsByClassName("val-continut")[0].innerHTML.trim().toLowerCase().replace(/[{}]/g, "")
            let vectorText2=continut2!=="" ? continut2.split(",") : []
            vectorText2 = vectorText2.map(cuv => cuv.trim()).filter(cuv => cuv!=="")
            let length2=vectorText2.length
            return semn*(length1-length2)         
            // let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            // let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            // return semn * numeA.localeCompare(numeB)
        }
    })
    for(let prod of vProduse) {
        prod.parentElement.appendChild(prod)
    }
}

    document.getElementById("sortCrescNume").onclick = function()
    {
        if (!valideazaInputuri()) {
            return; 
        }
        sorteaza(1)
    }

    document.getElementById("sortDescrescNume").onclick = function()
    {
        if (!valideazaInputuri()) {
            return; 
        }
        sorteaza(-1)
    }

    window.onkeydown = function(e) {
        if(e.key=="c" && e.altKey) {
            if (!valideazaInputuri()) {
                return; 
            }
            let produse = document.getElementsByClassName("produs")
            let suma = 0
            for(let prod of produse) {
                if(prod.style.display!="none") {
                    suma += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
                }
            }
            let p=document.getElementById("infoSuma")
            if(p) {
                p.innerHTML = suma
            }
            else {
                let p = this.document.createElement("p")
                p.innerHTML = suma
                p.id="infoSuma"
                let sectiuneProduse = document.getElementById("produse")
                sectiuneProduse.parentElement.insertBefore(p, sectiuneProduse)
                this.setTimeout(function() {
                    let p1=this.document.getElementById("infoSuma")
                    p1.remove()
                }, 2000)
            }
        }
    }
}