/*

ATENTIE!
inca nu am implementat protectia contra SQL injection
*/

const {Client, Pool}=require("pg");


/**
 * Clasă de tip Singleton pentru gestionarea conexiunii și operațiunilor cu baza de date PostgreSQL.
 */
class AccesBD{
    static #instanta=null;
    static #initializat=false;

    /**
     * Constructorul clasei AccesBD.
     * Împiedică instanțierea directă din exterior pentru a păstra modelul Singleton.
     * @throws {Error} Aruncă o eroare dacă se încearcă instanțierea directă sau fără apelarea getInstanta.
     */
    constructor() {
        if(AccesBD.#instanta){
            throw new Error("Deja a fost instantiat");
        }
        else if(!AccesBD.#initializat){
            throw new Error("Trebuie apelat doar din getInstanta; fara sa fi aruncat vreo eroare");
        }
    }

    /**
     * Inițializează conexiunea locală cu baza de date folosind un client simplu (pg.Client).
     * @returns {void}
     */
    initLocal(){
        this.client= new Client({
            database:"mobilehub",
            user:"gabriel", 
            password:"gabriel", 
            host:"localhost", 
            port:5432}
        );//atentie e posibil sa aveti nevoie sa schimbati portul in 5432
        
        this.client.connect();

        
        // Exemplu de alt tip de conexiune:
        // this.client2= new Pool({database:"laborator",
        //         user:"irina", 
        //         password:"irina", 
        //         host:"localhost", 
        //         port:5432});
        
    }

    /**
     * Returnează clientul activ de bază de date.
     * @returns {Client} Instanța clientului pg.Client conectat.
     * @throws {Error} Aruncă o eroare dacă clasa nu a fost instanțiată în prealabil prin getInstanta.
     */
    getClient(){
        if(!AccesBD.#instanta ){
            throw new Error("Nu a fost instantiata clasa");
        }
        return this.client;
    }

    /**
     * @typedef {object} ObiectConexiune - obiect primit de functiile care realizeaza un query
     * @property {string} init - tipul de conexiune ("init", "render" etc.)
     */

    /**
     * Returneaza instanta unica a clasei (Metoda Singleton).
     *
     * @param {ObiectConexiune} init - un obiect cu datele pentru query
     * @returns {AccesBD} Instanța unică a clasei de acces la baza de date.
     */
    static getInstanta({init="local"}={}){
        console.log(this);//this-ul e clasa nu instanta pt ca metoda statica
        if(!this.#instanta){
            this.#initializat=true;
            this.#instanta=new AccesBD();

            //initializarea poate arunca erori
            //vom adauga aici cazurile de initializare 
            //pentru baza de date cu care vrem sa lucram
            try{
                switch(init){
                    case "local":this.#instanta.initLocal();
                }
                //daca ajunge aici inseamna ca nu s-a produs eroare la initializare
                
            }
            catch (e){
                console.error("Eroare la initializarea bazei de date!");
            }

        }
        return this.#instanta;
    }




    /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string[]} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */


    
    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */
    
    /**
     * Selecteaza inregistrari din baza de date folosind o abordare cu callback.
     *
     * @param {ObiectQuerySelect} obj - un obiect cu datele pentru query
     * @param {QueryCallBack} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     * @param {Array} [parametriQuery=[]] - Parametrii transmiși pentru interogări parametrizate
     * @returns {void}
     */
    select({tabel="",campuri=[],conditiiAnd=[]} = {}, callback, parametriQuery=[]){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`; 
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error(comanda);
        /*
        comanda=`select id, camp1, camp2 from tabel where camp1=$1 and camp2=$2;
        this.client.query(comanda,[val1, val2],callback)

        */
        this.client.query(comanda,parametriQuery, callback)
    }


    /**
     * Selectează înregistrări din baza de date în mod asincron (folosind Promise / async-await).
     * * @param {ObiectQuerySelect} obj - Un obiect care conține numele tabelului, câmpurile și condițiile de filtrare.
     * @returns {Promise<Object|null>} Rezultatul interogării de la baza de date sau null în caz de eroare.
     */
    async selectAsync({tabel="",campuri=[],conditiiAnd=[]} = {}){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error("selectAsync:",comanda);
        try{
            let rez=await this.client.query(comanda);
            console.log("selectasync: ",rez);
            return rez;
        }
        catch (e){
            console.log(e);
            return null;
        }
    }
    
    /**
     * Inserează o nouă înregistrare în baza de date.
     * * @param {object} obj - Configurația operației de inserare.
     * @param {string} obj.tabel - Numele tabelului în care se face inserarea.
     * @param {object} obj.campuri - Un obiect de tip cheie-valoare care reprezintă coloanele și valorile corespunzătoare lor.
     * @param {QueryCallBack} callback - Funcția de tip callback apelată după finalizarea operației.
     * @returns {void}
     */
    insert({tabel="",campuri={}} = {}, callback){
        /*
        Exemplu:
        campuri={
            nume:"savarina",
            pret: 10,
            calorii:500
        }
        */
        console.log("-------------------------------------------")
        console.log(Object.keys(campuri).join(","));
        console.log(Object.values(campuri).join(","));
        let comanda=`insert into ${tabel}(${Object.keys(campuri).join(",")}) values ( ${Object.values(campuri).map((x) => `'${x}'`).join(",")})`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

    // /**
    //  * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
    //  * @property {string} tabel - numele tabelului
    //  * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
    //  * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
    //  */   
    // update({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback, parametriQuery){
    //     if(campuri.length!=valori.length)
    //         throw new Error("Numarul de campuri difera de nr de valori")
    //     let campuriActualizate=[];
    //     for(let i=0;i<campuri.length;i++)
    //         campuriActualizate.push(`${campuri[i]}='${valori[i]}'`);
    //     let conditieWhere="";
    //     if(conditiiAnd.length>0)
    //         conditieWhere=`where ${conditiiAnd.join(" and ")}`;
    //     let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
    //     console.log(comanda);
    //     this.client.query(comanda,callback)
    // }

    // update({tabel="",campuri={}, conditiiAnd=[]} = {}, callback, parametriQuery){
    //     let campuriActualizate=[];
    //     for(let prop in campuri)
    //         campuriActualizate.push(`${prop}='${campuri[prop]}'`);
    //     let conditieWhere="";
    //     if(conditiiAnd.length>0)
    //         conditieWhere=`where ${conditiiAnd.join(" and ")}`;
    //     let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
    //     console.log(comanda);
    //     this.client.query(comanda,callback)
    // }

    /**
     * Actualizează înregistrările existente dintr-un tabel utilizând concatenarea directă a valorilor.
     * * @param {object} obj - Specificațiile operației de actualizare.
     * @param {string} obj.tabel - Numele tabelului pe care se execută update-ul.
     * @param {string[]} obj.campuri - Vector cu numele coloanelor care urmează să fie modificate.
     * @param {any[]} obj.valori - Vector cu noile valori asociate coloanelor (în aceeași ordine ca vectorul de câmpuri).
     * @param {string[]} obj.conditii - Vector cu clauze de filtrare de tip string combinate ulterior prin operatorul AND.
     * @param {QueryCallBack} callback - Funcția callback apelată la terminarea interogării.
     * @param {Array} [parametriQuery] - Parametri auxiliari opționali.
     * @returns {void}
     */
    update({tabel="", campuri=[], valori=[], conditii=[]} = {}, callback, parametriQuery) {
    let campuriActualizate = [];
    for(let i = 0; i < campuri.length; i++) {
        campuriActualizate.push(`${campuri[i]}='${valori[i]}'`);
    }
    let conditieWhere = "";
    if(conditii.length > 0) {
        conditieWhere = `where ${conditii.join(" and ")}`;
    }
    let comanda = `update ${tabel} set ${campuriActualizate.join(", ")} ${conditieWhere}`;
    console.log(comanda);
    this.client.query(comanda, callback);
}

    /**
     * Actualizează înregistrările dintr-un tabel în mod securizat, utilizând o interogare parametrizată.
     * * @param {object} obj - Detaliile operației de actualizare.
     * @param {string} obj.tabel - Numele tabelului în cauză.
     * @param {string[]} obj.campuri - Coloanele ale căror valori se vor schimba sub formă de marcaje de substituție ($1, $2 etc.).
     * @param {any[]} obj.valori - Vector cu valorile reale ce vor înlocui marcajele de substituție transmise bazei de date.
     * @param {string[]} obj.conditiiAnd - Vector cu expresii logice de filtrare pentru clauza WHERE.
     * @param {QueryCallBack} callback - Funcția callback apelată la finalul execuției.
     * @param {Array} [parametriQuery] - Parametri auxiliari opționali.
     * @throws {Error} Aruncă o eroare dacă lungimea vectorului de câmpuri nu corespunde cu cea a vectorului de valori.
     * @returns {void}
     */
    updateParametrizat({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback, parametriQuery){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        let campuriActualizate=[];
        for(let i=0;i<campuri.length;i++)
            campuriActualizate.push(`${campuri[i]}=$${i+1}`);
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1111",comanda);
        this.client.query(comanda,valori, callback)
    }


    //TO DO
    // updateParametrizat({tabel="",campuri={}, conditiiAnd=[]} = {}, callback, parametriQuery){
    //     let campuriActualizate=[];
    //     for(let prop in campuri)
    //         campuriActualizate.push(`${prop}='${campuri[prop]}'`);
    //     let conditieWhere="";
    //     if(conditiiAnd.length>0)
    //         conditieWhere=`where ${conditiiAnd.join(" and ")}`;
    //     let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
    //     this.client.query(comanda,valori, callback)
    // }

    /**
     * Șterge înregistrări dintr-un tabel în funcție de anumite condiții transmise ca argument.
     * * @param {object} obj - Structura operației de ștergere.
     * @param {string} obj.tabel - Numele tabelului din care se vor șterge datele.
     * @param {string[]} obj.conditiiAnd - Condițiile restrictive aplicate procesului de ștergere.
     * @param {QueryCallBack} callback - Funcția callback care preia controlul după rularea comenzii.
     * @returns {void}
     */
    delete({tabel="",conditiiAnd=[]} = {}, callback){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`delete from ${tabel} ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

    /**
     * Execută o comandă SQL brută (raw query) direct pe instanța clientului de Postgres.
     * * @param {string} comanda - Șirul de caractere conținând interogarea SQL completă.
     * @param {QueryCallBack} callback - Funcția callback ce tratează rezultatul sau eroarea survenită.
     * @returns {void}
     */
    query(comanda, callback){
        this.client.query(comanda,callback);
    }

}

module.exports=AccesBD;