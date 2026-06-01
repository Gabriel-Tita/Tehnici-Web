window.addEventListener("DOMContentLoaded", function() {
    const switchTema = document.getElementById("schimba_tema");
    // const labelTema = document.getElementById("label_tema");

    if (document.body.classList.contains("dark")) {
        switchTema.checked = true;
    } else {
        switchTema.checked = false;
    }

    switchTema.onclick = function() {
        if (this.checked) {
            document.body.classList.add("dark");
            localStorage.setItem("tema", "dark");
        } else {
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