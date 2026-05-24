const express=require("express");
const path=require("path");
const fs=require("fs");
const sass=require("sass");
const sharp=require("sharp");

// // const ejs=require('ejs');
const pg = require("pg");

app=express();
app.set("view engine", "ejs")

obGlobal={
    obErori: null,
    obImagini: null, 
    folderScss: path.join(__dirname, "Resurse/Scss"),
    folderCss: path.join(__dirname, "Resurse/CSS"),
    folderBackup: path.join(__dirname, "Backup"),
    //optiunimeniu
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

// app.get("/Resurse/CSS/general.css", function(req, res){
//     res.sendFile(path.join(__dirname, "Resurse/CSS/general.css"))
// });

client=new pg.Client({
    database:"mobilehub",
    user:"gabriel",
    password:"gabriel",
    host:"localhost",
    port:5432 //5433
})
client.connect()

// client.query("select * from telefoane where id>3", function(err, rez){
//     if (err){
//         console.log("Eroare", err)
//     }
//     else{
//         console.log(rez)
//     }
// })

let vect_foldere=[ "temp", "logs", "backup", "fisiere_uploadate" ]
for (let folder of vect_foldere){
    let caleFolder=path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(path.join(caleFolder), {recursive:true});   
    }
}

app.use("/Resurse", express.static(path.join(__dirname, "Resurse")));

app.use("/dist", express.static(path.join(__dirname, "/node_modules/bootstrap/dist")));

// app.get("/:a/:b", function(req, res){
//     res.sendFile(path.join(__dirname, "index.html"));
// });

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "Resurse/Imagini/Favicon/favicon.ico"))
});

/*client.query("select * from unnest(enum_range(null::categ_prajitura))", function(err, rez){
    if (err){
        console.log("Eroare", err)
    }
    else{
        console.log(rez)
        obGlobal.optiuniMeniu=rez.rows
    }
})*/


app.use(function(req, res, next){
    client.query("select * from unnest(enum_range(null::categ_telefon))", function(err, rezOptiuni){
        if (err){
            afisareEroare(res, 2)
        }
        else{
            res.locals.optiuniMeniu=rezOptiuni.rows;
            next();
        }
    })
})  


app.get(["/", "/index", "/home"], function(req, res){
    //res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/index", {
        ip: req.ip,
        imagini: obGlobal.obImagini.imagini
    });
});


app.get("/produse", function(req, res){
    let clauzaWhere="";
    if(req.query.tip)
        clauzaWhere=` where tip_telefon='${req.query.tip}'`
    client.query(`select * from telefoane ${clauzaWhere}`, function(err, rez){
        if (err){
            console.log("Eroare", err)
            afisareEroare(res, 2)
        }
        else{
            client.query("select * from unnest(enum_range(null::categ_telefon))", function(err, rezOptiuni){
                if (err){
                    afisareEroare(res, 2)
                }
                else{
                    let toateProdusele=rez.rows;

                    let vectorPreturi=toateProdusele.map(prod => parseFloat(prod.pret));
                    let pretMinim=vectorPreturi.length > 0 ? Math.min(...vectorPreturi) : 0;
                    let pretMaxim=vectorPreturi.length > 0 ? Math.max(...vectorPreturi) : 0;

                    let exempluNume=rez.rows[0]?.nume || "";
                    
                    let prodless8gb=0, prodless12gb=0, prodless32gb=0;
                    for(let prod of toateProdusele){
                        if (prod.memorie_ram<8){
                            prodless8gb++;
                        }
                        else if (prod.memorie_ram<12){
                            prodless12gb++;
                        }
                        else{
                            prodless32gb++;
                        }
                    }
                    
                    let continutSet = new Set();
                    toateProdusele.forEach(prod => {
                        if(prod.continut) {
                            prod.continut.forEach(a => {
                                if(a&&a.trim().length > 0) {
                                    continutSet.add(a.trim());
                                }
                            })
                        }
                    })
                    let vecAccesorii=Array.from(continutSet);

                    let continutCulori = new Set();
                    toateProdusele.forEach(prod => {
                        if(prod.culoare) {
                            continutCulori.add(prod.culoare.trim());
                        }
                    })
                    let vecCulori=Array.from(continutCulori);

                    let Branduri=new Set();
                    toateProdusele.forEach(prod => {
                        if(prod.brand){
                            Branduri.add(prod.brand.trim());
                        }
                    })
                    let vecBrand=Array.from(Branduri);

                    let Anilansare=new Set();
                    toateProdusele.forEach(prod => {
                        if(prod.an_lansare){
                            Anilansare.add(prod.an_lansare);
                        }
                    })
                    let Ani=Array.from(Anilansare);
                    Ani.sort();

                    let descriereexemplu = toateProdusele[0].descriere

                    res.render("pagini/produse", {
                        produse: rez.rows,
                        optiuni: rezOptiuni.rows,
                        pretMinim: pretMinim,
                        pretMaxim: pretMaxim,
                        exempluNume: exempluNume,
                        prodless8gb: prodless8gb,
                        prodless12gb: prodless12gb,
                        prodless32gb: prodless32gb,
                        accesorii: vecAccesorii,
                        culori: vecCulori,
                        branduri: vecBrand,
                        ani: Ani,
                        descrieretest: descriereexemplu
                    })
                }
            })
        }
    })
})

app.get("/produs/:id", function(req, res){
    client.query(`select * from telefoane where id=${req.params.id}`, function(err, rez){
    if (err){
        console.log("Eroare", err)
        afisareEroare(res, 2)
    }
    else{
        if(rez.rowCount==0){
            afisareEroare(res, 404, "Produs inexistent")
        }
        else
        {
            res.render("pagini/produs", {
                prod: rez.rows[0],
            })
        }
    }
})
})

app.get(["/galerie"], function(req, res){
    res.render("pagini/galerie", {
        imagini: obGlobal.obImagini.imagini
    });
});

// app.get("/despre", function(req, res){
//     res.render("pagini/despre");
// });

// app.get("/produse", function(req, res){
//     client.query("select * from prajituri", function(err, rez){
    //     if (err){
    //         console.log("Eroare", err)
    //         afisareEroare(res, 2)
    //     }
    //     else{
    //         res.render("pagini/produse", {
    //             produse: rez.rows,
    //             optiuni: []
    //         });
    //     }
//     })
// })

// app.get("/produs/:id", function(req, res){
//     client.query(`select * from prajituri where id=${req.params.id}`, function(err, rez){
    //     if (err){
    //         console.log("Eroare", err)
    //         afisareEroare(res, 2)
    //     }
    //     else{
    //      if (rez.rowsCount==0){
    //         afisareEroare(res, 404, "Produs inexistent");
    //      }
    //      else{    
    //         res.render("pagini/produs", {
    //             produse: rez.prod,
    //             optiuni: []
    //         });
    //     }}
//     })
// })

function valideazaErori() {
    const caleJson = path.join(__dirname, "Resurse/Json/erori.json");

    if (!fs.existsSync(caleJson)) {
        console.error("CRITIC: Fisierul erori.json nu exista la calea: " + caleJson);
        process.exit(1);
    }

    const textJson = fs.readFileSync(caleJson, "utf-8");

    let regexDuplicat = /"(\w+)":(?=[^}]*?"\1":)/g;     
    let match;
    while ((match = regexDuplicat.exec(textJson)) !== null) {
        console.error(`Proprietatea "${match[1]}" e duplicată într-un obiect!`);
    }

    let erori;
    try {
        erori = JSON.parse(textJson);
    } catch (e) {
        console.error("EROARE: JSON-ul nu este valid sintactic.");
        process.exit(1);
    }

    const proprietatiRadacina = ["info_erori", "cale_baza", "eroare_default"];
    for (let prop of proprietatiRadacina) {
        if (!(prop in erori)) console.error(`Lipsește proprietatea de bază: "${prop}"`);
    }

    if (erori.eroare_default) {
        const propDefault = ["titlu", "text", "imagine"];
        for (let prop of propDefault) {
            if (!(prop in erori.eroare_default)) {
                console.error(`Eroarea default are proprietatea "${prop}" lipsă.`);
            }
        }
    }

    const caleAbsolutaBaza = path.join(__dirname, erori.cale_baza || "");
    if (!fs.existsSync(caleAbsolutaBaza)) {
        console.error(`Folderul specificat in "cale_baza" (${caleAbsolutaBaza}) nu exista.`);
    }

    if (erori.info_erori && Array.isArray(erori.info_erori)) {
        let idsVazute = {};
        
        erori.info_erori.forEach((eroare, index) => {
            let id = eroare.identificator;
            if (idsVazute[id]) {
                console.error(`Identificator duplicat detectat: ${id}.`);
                console.log("Detalii eroare duplicata (fara ID):", { ...eroare, identificator: undefined });
            }
            idsVazute[id] = true;

            if (eroare.imagine) {
                let caleImagine = path.join(caleAbsolutaBaza, eroare.imagine);
                if (!fs.existsSync(caleImagine)) {
                    console.error(`Imaginea erorii ${id} nu exista la: ${caleImagine}`);
                }
            }
        });
    }
}
valideazaErori();

function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"Resurse/Json/erori.json")).toString("utf-8");
    let erori=obGlobal.obErori=JSON.parse(continut)
    let err_default=erori.eroare_default
    err_default.imagine=path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori){
        eroare.imagine=path.join(erori.cale_baza, eroare.imagine)
    }

}
initErori()

function afisareEroare(res, identificator, titlu, text, imagine){
    //to do cautam eroarea dupa identificator
    let eroare = obGlobal.obErori.info_erori.find((elem) => 
        elem.identificator == identificator
    )
    //daca sunt setate titlu, text, imagine, le folosim
    //altfel folosim cele din fisierul json pentru eroarea gasita
    //daca nu o gasim, afisam eroarea default
    let errDefault = obGlobal.obErori.eroare_default;
    
    if(eroare?.status)
        res.status(eroare.identificator)
    
    res.render("pagini/eroare",{
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || errDefault.text,
    });
}

app.get("/eroare", function(req, res){
    afisareEroare(res, 404, "Titlu!!!")
});

app.get("/cale", function(req, res){
    console.log("Am primit o cerere GET pe /cale");
    res.send("Raspuns la <b style='color: red;'>cererea</b> GET pe /cale");
});

app.get("/cale2", function(req, res){
    res.write("ceva");
    res.write("altceva");
    res.end();
});

app.get("/cale2/:a/:b", function(req, res){
    res.send(parseInt(req.params.a)+parseInt(req.params.b));
});

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"Resurse/Json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleGalerie=obGlobal.obImagini.cale_galerie

    let caleAbs=path.join(__dirname,caleGalerie);
    let caleAbsMediu=path.join(caleAbs, "mediu");
    let caleAbsMic=path.join(caleAbs, "mic");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);
    
    for (let imag of vImagini){
        [numeFis, ext]=imag.cale_fisier.split("."); //"ceva.png" -> ["ceva", "png"]
        let caleFisAbs=path.join(caleAbs,imag.cale_fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        let caleFisMicAbs=path.join(caleAbsMic, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        sharp(caleFisAbs).resize(200).toFile(caleFisMicAbs);
        imag.fisier_mic=path.join("/", caleGalerie, "mic", numeFis+".webp" )
        imag.fisier_mediu=path.join("/", caleGalerie, "mediu", numeFis+".webp" )
        imag.cale_fisier=path.join("/", caleGalerie, imag.cale_fisier )
        
    }
    // console.log(obGlobal.obImagini)
}
initImagini();

function compileazaScss(caleScss, caleCss){
    if(!caleCss){

        let numeFisExt=path.basename(caleScss); // "folder1/folder2/a.scss" -> "a.scss"
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css"; // output: a.css
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    
    let caleBackup=path.join(obGlobal.folderBackup, "Resurse/CSS");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "Resurse/CSS",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    
}

//la pornirea serverului
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

app.get("/*pagina", function(req, res){
    console.log("Cale pagina", req.url);
    if (req.url.startsWith("/Resurse") && path.extname(req.url)==""){
        afisareEroare(res,403);
        return;
    }
    if (path.extname(req.url)==".ejs"){
        afisareEroare(res,400);
        return;
    }
    try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if (err){
                if (err.message.includes("Failed to lookup view")){
                    afisareEroare(res,404)
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezRandare);
                // console.log("Rezultat randare", rezRandare);
            }
        });
    }
    catch(err){
        if (err.message.includes("Cannot find module")){
            afisareEroare(res,404)
        }
        else{
            afisareEroare(res);
        }
    }
});

app.listen(8080);
console.log("Serverul a pornit!");



// const express= require("express");
// const path= require("path");

// app= express();
// app.set("view engine", "ejs")

// console.log("Folder index.js", __dirname);
// console.log("Folder curent (de lucru)", process.cwd());
// console.log("Cale fisier", __filename);

// app.get("/", function(req, res) {
//     res.render("pagini/index");
// })

// app.get("/cale", function(req, res) {
//     console.log("Ruta /cale");
//     res.send("Raspuns pentru <b style='color:red;'>ruta</b> /cale");
// })

// app.use("/resurse", express.static(path.join(__dirname, "resurse")));

// app.use("/:a/:b", function(req,res) {
//     console.log(parseInt(req.params.a) + parseInt(req.params.b));
//     res.send();
// })

// app.get("/cale2", function(req, res) {
//     res.write("123");
//     res.write("456");
//     res.end();
// })


// app.listen(8080);
// console.log("Serverul a pornit!");


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