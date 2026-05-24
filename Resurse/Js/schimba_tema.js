window.addEventListener("DOMContentLoaded", function() {
    const switchTema = document.getElementById("schimba_tema");
    const labelTema = document.getElementById("label_tema");

    // Sincronizăm starea vizuală a switch-ului cu tema salvată în localStorage
    if (document.body.classList.contains("dark")) {
        switchTema.checked = true;
    } else {
        switchTema.checked = false;
    }

    // 2. Comportamentul switch-ului la click / schimbare (onchange)
    switchTema.onclick = function() {
        if (this.checked) {
            // Dacă utilizatorul a activat switch-ul -> trecem pe Dark Mode
            document.body.classList.add("dark");
            localStorage.setItem("tema", "dark");
        } else {
            // Dacă utilizatorul a dezactivat switch-ul -> trecem pe Light Mode
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
        }
    };
});


// window.addEventListener("DOMContentLoaded", function(){
// document.getElementById("schimba_tema").onclick= function(){
//     if(document.body.classList.contains("dark")){
//         document.body.classList.remove("dark")
//         localStorage.removeItem("tema");
//     }
//     else{
//         document.body.classList.add("dark")
//         localStorage.setItem("tema","dark");
//     }
// }
// });