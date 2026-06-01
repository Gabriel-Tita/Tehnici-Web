const AccesBD=require('./accesbd.js');
const parole=require('./parole.js');

const {RolFactory}=require('./roluri.js');
const crypto=require("crypto");
const nodemailer=require("nodemailer");


/**
 * Clasă care reprezintă și gestionează modelul unui Utilizator în cadrul aplicației,
 * incluzând logica de validare, criptare a parolei, persistență în baza de date și trimitere de e-mailuri.
 */
class Utilizator{
    /** @type {string} Tipul conexiunii implicite la baza de date ("local" sau "render"). */
    static tipConexiune="local";
    /** @type {string} Numele tabelului corespunzător din baza de date SQL. */
    static tabel="utilizatori"
    /** @type {string} Cheia de salt (salt key) folosită ca bază pentru algoritmul de criptare a parolelor. */
    static parolaCriptare="tehniciweb";
    /** @type {number} Lungimea în octeți a parolei criptate rezultate din scrypt. */
    static lungimeCod=64;
    /** @type {string} Adresa de e-mail a serverului folosită ca expeditor (Gmail). */
    static emailServer="test.tweb.node@gmail.com";
    /** @type {string} Denumirea domeniului curent pe care rulează serverul aplicației web. */
    static numeDomeniu="localhost:8080";
    
    /** @type {string} Proprietate privată destinată stocării mesajelor de eroare interne ale instanței. */
    #eroare;

    /**
     * Constructorul clasei Utilizator.
     * Instanțiază un nou obiect utilizator și îi mapează toate proprietățile furnizate.
     * * @param {object} [param0={}] - Obiect destructurat conținând datele inițiale ale utilizatorului.
     * @param {number} param0.id - Identificatorul unic din baza de date.
     * @param {string} param0.username - Numele de utilizator unic pentru autentificare.
     * @param {string} param0.nume - Numele de familie al utilizatorului.
     * @param {string} param0.prenume - Prenumele utilizatorului.
     * @param {string} param0.email - Adresa de e-mail validă a utilizatorului.
     * @param {string} param0.parola - Parola (în clar sau deja criptată, în funcție de context).
     * @param {string|Date} param0.data_nasterii - Data nașterii.
     * @param {string|Date} [param0.data_inregistrarii] - Data creării contului (implicit data curentă).
     * @param {string|object} param0.rol - Rolul utilizatorului (string sau obiect instanță de Rol).
     * @param {string} [param0.culoare_chat="black"] - Culoarea preferată pentru textul din modulul de chat.
     * @param {string} param0.telefon - Numărul de telefon.
     * @param {string} param0.poza - Calea către fișierul imaginii de profil.
     * @throws {Error} Aruncă o eroare dacă numele de utilizator (username) nu respectă regulile de validare.
     */
    constructor({id, username, nume, prenume, email, parola, data_nasterii, data_inregistrarii=getDate(), rol, culoare_chat="black", telefon, poza}={}) {
        this.id=id;

        //optional sa facem asta in constructor
        try{
            if(this.checkUsername(username))
                this.username = username;
            else throw new Error("Username incorect");

        }
        catch(e){ this.#eroare=e.message}

        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }
        if(this.rol)
            this.rol=this.rol.cod? RolFactory.creeazaRol(this.rol.cod):  RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

        this.#eroare="";
    }

    /**
     * Validează formatul numelui (trebuie să înceapă cu majusculă și să conțină doar litere).
     * @param {string} nume - Numele care urmează să fie verificat.
     * @returns {boolean|Array} Returnează true/match array dacă numele respectă expresia regulată, altfel null/false.
     */
    checkName(nume){
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$")) ;
    }

    /**
     * Setter pentru actualizarea numelui cu verificare prealabilă.
     * @param {string} nume - Noul nume propus.
     * @throws {Error} Aruncă o eroare dacă numele trimis nu este valid.
     */
    set setareNume(nume){
        if (this.checkName(nume)) this.nume=nume
        else{
            throw new Error("Nume gresit")
        }
    }

    /**
     * Setter pentru modificarea securizată a numelui de utilizator.
     * @param {string} username - Noul username propus.
     * @throws {Error} Aruncă o eroare dacă formatul ales este incorect.
     */
    set setareUsername(username){
        if (this.checkUsername(username)) this.username=username
        else{
            throw new Error("Username gresit")
        }
    }

    /**
     * Validează formatul numelui de utilizator (permite litere, cifre și caracterele speciale #, _, ., /).
     * @param {string} username - Username-ul supus verificării.
     * @returns {boolean|Array} True/match array dacă formatul e valid, altfel false/null.
     */
    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
    }

    /**
     * Criptează o parolă în mod sincron folosind funcția de derivare a cheii crypto.scryptSync.
     * @param {string} parola - Parola în clar ce trebuie securizată.
     * @returns {string} Reprezentarea în format hexadecimal a parolei criptate.
     */
    static criptareParola(parola){
        return crypto.scryptSync(parola,Utilizator.parolaCriptare,Utilizator.lungimeCod).toString("hex");
    }

    /**
     * Salvează instanța curentă a utilizatorului în baza de date și trimite un e-mail de confirmare a contului.
     * @async
     * @returns {Promise<void>}
     * @throws {Error} Aruncă o eroare dacă username-ul este deja înregistrat de altcineva.
     */
    async salvareUtilizator(){

        let utilizatorExistent=await Utilizator.getUtilizDupaUsernameAsync(this.username);
        if(utilizatorExistent){ 
            throw new Error(`Înregistrare eșuată: Username-ul "${this.username}" este deja utilizat.`);
        }

        let parolaCriptata=Utilizator.criptareParola(this.parola);
        let utiliz=this;
        let token=parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({tabel:Utilizator.tabel,
            campuri:{
                username:this.username,
                nume: this.nume,
                prenume:this.prenume,
                parola:parolaCriptata,
                email:this.email,
                data_nasterii:this.data_nasterii,
                data_inregistrarii:this.data_inregistrarii,
                rol:this.rol.cod,
                culoare_chat:this.culoare_chat,
                cod:token,
                telefon:this.telefon,
                poza:this.poza}
            }, function(err, rez){
            if(err)
                console.log(err);
            else
                utiliz.trimiteMail("Te-ai inregistrat cu succes","Username-ul tau este "+utiliz.username,
            `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
            )
        });
    }
//xjxwhotvuuturmqm

    /**
     * Actualizează asincron datele din tabel pentru utilizatorul curent și reasignează valorile local.
     * @param {object} noiDate - Un obiect de tip cheie-valoare conținând coloanele ce vor fi modificate.
     * @throws {Error} Aruncă o eroare dacă instanța nu are un username definit.
     * @returns {void}
     */
    modifica(noiDate) {
        let utiliz = this;
        // Verificăm dacă instanța curentă are un ID sau username valid în DB
        if (!this.username) {
            throw new Error("Modificare eșuată: Utilizatorul nu există.");
        }

        AccesBD.getInstanta(Utilizator.tipConexiune).update({
            tabel: Utilizator.tabel,
            campuri: noiDate,
            conditiiAnd: [`username='${this.username}'`]
        }, function(err, rez) {
            if (err) throw err;
            // Actualizăm și proprietățile obiectului din memorie
            Object.assign(utiliz, noiDate);
        });
    }

    /**
     * Șterge înregistrarea utilizatorului curent din baza de date SQL pe baza numelui de utilizator.
     * @throws {Error} Aruncă o eroare dacă instanța nu conține un username valid.
     * @returns {void}
     */
    sterge() {
        if (!this.username) {
            throw new Error("Ștergere eșuată: Utilizatorul nu există.");
        }
        
        AccesBD.getInstanta(Utilizator.tipConexiune).delete({
            tabel: Utilizator.tabel,
            conditiiAnd: [`username='${this.username}'`]
        }, function(err, rez) {
            if (err) throw err;
            console.log("Utilizator șters cu succes.");
        });
    }

    /**
     * Caută utilizatori în baza de date în funcție de parametrii primiți și returnează instanțe de tip Utilizator printr-un callback.
     * @param {object} obParam - Obiect cu perechi coloană-valoare folosite drept criterii de filtrare WHERE.
     * @param {Function} callback - Funcție executată după finalizarea interogării. Primește doi parametri: (eroare, listaUtilizatori).
     * @returns {void}
     */
    static cauta(obParam, callback) {
        let conditii = [];
        for (let prop in obParam) {
            if (obParam[prop] !== undefined) {
                conditii.push(`${prop}='${obParam[prop]}'`);
            }
        }

        AccesBD.getInstanta(Utilizator.tipConexiune).select({
            tabel: Utilizator.tabel,
            campuri: ['*'],
            conditiiAnd: conditii
        }, function(err, rezSelect) {
            if (err) {
                callback(err, []);
            } else {
                let listaUtiliz = rezSelect.rows.map(row => new Utilizator(row));
                callback(null, listaUtiliz);
            }
        });
    }

    /**
     * Caută utilizatori în baza de date în mod asincron pe baza unor parametri dați.
     * @static
     * @async
     * @param {object} obParam - Setul de parametri și valori asociate pentru clauza WHERE.
     * @returns {Promise<Utilizator[]>} Un vector populat cu instanțe ale clasei Utilizator sau un vector gol în caz de eroare.
     */
    static async cautaAsync(obParam) {
        let conditii = [];
        for (let prop in obParam) {
            if (obParam[prop] !== undefined) {
                conditii.push(`${prop}='${obParam[prop]}'`);
            }
        }
        try {
            let rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
                tabel: Utilizator.tabel,
                campuri: ['*'],
                conditiiAnd: conditii
            });
            return rezSelect.rows.map(row => new Utilizator(row));
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    /**
     * Trimite un e-mail utilizatorului curent folosind modulul nodemailer configurat pentru Gmail.
     * @async
     * @param {string} subiect - Subiectul (titlul) e-mailului.
     * @param {string} mesajText - Corpul e-mailului în format text simplu (plain text).
     * @param {string} mesajHtml - Corpul e-mailului structurat în format HTML.
     * @param {Array<object>} [atasamente=[]] - O listă opțională de fișiere atașate e-mailului.
     * @returns {Promise<void>}
     */
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:Utilizator.emailServer,
                pass:"rwgmgkldxnarxrgu"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }
   
    /**
     * Interoghează asincron baza de date pentru a aduce un utilizator pe baza username-ului său unic.
     * @static
     * @async
     * @param {string} username - Numele de utilizator căutat.
     * @returns {Promise<Utilizator|null>} Instanța utilizatorului reconstituită din DB sau null dacă nu există/apare o eroare.
     */
    static async getUtilizDupaUsernameAsync(username){
        if (!username) return null;
        try{
            let rezSelect= await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]
            });
            if(rezSelect.rowCount!=0){
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e){
            console.log(e);
            return null;
        }
        
    }

    /**
     * Caută un utilizator după username în mod clasic (bazat pe callback) și pasează instanța obținută către o funcție de procesare.
     * @static
     * @param {string} username - Username-ul utilizatorului pe care dorim să îl localizăm.
     * @param {object} obparam - Obiect ajutător pasat mai departe către funcția de procesare.
     * @param {Function} proceseazaUtiliz - Callback-ul executat după primirea datelor. Formă apel: (utilizator, obparam, codEroare).
     * @returns {null|void} Returnează null direct doar dacă lipsește parametrul critic username.
     */
    static getUtilizDupaUsername (username,obparam, proceseazaUtiliz){
        if (!username) return null;
        let eroare=null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]}
        , function (err, rezSelect){
            if(err){
                console.error("Utilizator:", err);
                //throw new Error()
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            //constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={})
            let u= new Utilizator(rezSelect.rows[0])
            proceseazaUtiliz(u, obparam, eroare);
        });
    }

    /**
     * Verifică dacă utilizatorul curent deține un anumit privilegiu/drept la nivelul sistemului pe baza rolului său.
     * @param {Symbol} drept - Dreptul de securitate (reprezentat sub formă de Symbol) ce se dorește a fi verificat.
     * @returns {boolean} True dacă rolul utilizatorului îi oferă acel drept, altfel false.
     */
    areDreptul(drept){
        return this.rol.areDreptul(drept);
    }
}
// module.exports={Utilizator:Utilizator}
module.exports=Utilizator;