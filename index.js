const express= require("express");
const path= require("path");

app= express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

app.get("/", function(req, res) {
    res.render("pagini/index");
})

app.get("/cale", function(req, res) {
    console.log("Ruta /cale");
    res.send("Raspuns pentru <b style='color:red;'>ruta</b> /cale");
})

app.use("/resurse", express.static(path.join(__dirname, "resurse")));

app.use("/:a/:b", function(req,res) {
    console.log(parseInt(req.params.a) + parseInt(req.params.b));
    res.send();
})

app.get("/cale2", function(req, res) {
    res.write("123");
    res.write("456");
    res.end();
})


app.listen(8080);
console.log("Serverul a pornit!");


/**

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare=obGlobal.obErori.info_erori.find((elem)=>elem.identificator==identificator);
    let errDefault=obGlobal.obErori.eroare_default; 
    if(eroare?.status){
        res.status(eroare.identificator);
    }
    res.render("pagini/eroare",{
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || err.Default.text,
    });
}

vect_foldere=["temp", "logs", "backup", "fisiere_uploadate"]

for(let folder of vect_foldere){
    let caleFolder = path.join(__dirname, folder);
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder), {recursivitate: true})l;
    }
}

app.get("/eroare", function(req, res){
    afisareEroare(res, 404, "Eroare 404 - Pagina nu a fost gasita");
});

app.get("/*pagina", function(req, res){
    console.log("Pagina ceruta", req.url);
    try{
        res.render("pagini" + req.url, function(err, rezRandare){
        
        })
    }
    catch(err){
        if(err.message.includes("Cannot find module")){
            afisareEroare(res, 404);
        }
    }
}); 
**/