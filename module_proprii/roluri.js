const Drepturi=require('./drepturi.js');


/**
 * Clasa de bază pentru reprezentarea unui rol de utilizator în sistem.
 */
class Rol{
    /**
     * Returnează codul de identificare al rolului generic.
     * @type {string}
     */
    static get cod() {return "generic"}

    /**
     * Returnează lista de drepturi asociate rolului generic.
     * @type {Symbol[]}
     */
    static get drepturi() {return []}

    /**
     * Constructorul clasei Rol.
     * Inițializează codul rolului pe baza constructorului clasei curente.
     */
    constructor (){
        this.cod=this.constructor.cod;
    }

    /**
     * Verifică dacă rolul curent are un anumit drept asociat.
     * @param {Symbol} drept - Dreptul care urmează să fie verificat (reprezentat ca Symbol).
     * @returns {boolean} True dacă rolul include dreptul respectiv, altfel False.
     */
    areDreptul(drept){ //drept trebuie sa fie tot Symbol
        console.log("in metoda rol!!!!")
        return this.constructor.drepturi.includes(drept);
    }
}

/**
 * Clasa reprezentând rolul de Administrator, extinsă din clasa de bază Rol.
 * @extends Rol
 */
class RolAdmin extends Rol{
    /**
     * Returnează codul de identificare al rolului de administrator.
     * @type {string}
     */
    static get cod() {return "admin"}

    /**
     * Constructorul clasei RolAdmin.
     * Apelează constructorul clasei părinte.
     */
    constructor (){
        super();
    }

    /**
     * Suprascrie metoda de verificare a drepturilor. Administratorul are acces implicit la orice acțiune.
     * @returns {boolean} Întotdeauna returnează true.
     */
    areDreptul(){
        return true; //pentru ca e admin
    }
}

/**
 * Clasa reprezentând rolul de Moderator, extinsă din clasa de bază Rol.
 * @extends Rol
 */
class RolModerator extends Rol{
    
    /**
     * Returnează codul de identificare al rolului de moderator.
     * @type {string}
     */
    static get cod() {return "moderator"}

    /**
     * Returnează lista de drepturi specifice asociate rolului de moderator.
     * @type {Symbol[]}
     */
    static get drepturi() { return [
        Drepturi.vizualizareUtilizatori,
        Drepturi.stergereUtilizatori
    ] }

    /**
     * Constructorul clasei RolModerator.
     * Apelează constructorul clasei părinte.
     */
    constructor (){
        super()
    }
}

/**
 * Clasa reprezentând rolul de Angajat, extinsă din clasa de bază Rol.
 * @extends Rol
 */
class RolAngajat extends Rol{
    
    /**
     * Returnează codul de identificare al rolului de angajat.
     * @type {string}
     */
    static get cod() {return "angajat"}

    /**
     * Returnează lista de drepturi specifice asociate rolului de angajat.
     * @type {Symbol[]}
     */
    static get drepturi() { return [
        Drepturi.modificareProduse,
        Drepturi.stergereProduse,
        Drepturi.adaugareProduse
    ] }

    /**
     * Constructorul clasei RolAngajat.
     * Apelează constructorul clasei părinte.
     */
    constructor (){
        super()
    }
}

/**
 * Clasa reprezentând rolul de Client (Comun), extinsă din clasa de bază Rol.
 * @extends Rol
 */
class RolClient extends Rol{
    /**
     * Returnează codul de identificare al rolului de client comun.
     * @type {string}
     */
    static get cod() {return "comun"}

    /**
     * Returnează lista de drepturi specifice asociate rolului de client comun.
     * @type {Symbol[]}
     */
    static get drepturi() { return [
        Drepturi.cumparareProduse
    ] }

    /**
     * Constructorul clasei RolClient.
     * Apelează constructorul clasei părinte.
     */
    constructor (){
        super()
    }
}

/**
 * Clasă de tip Factory utilizată pentru instanțierea dinamică a rolurilor în funcție de un cod dat.
 */
class RolFactory{
    /**
     * Creează și returnează o instanță specifică de rol pe baza codului furnizat.
     * @param {string} cod - Codul alfanumeric al rolului dorit (ex: "admin", "moderator" etc.).
     * @returns {RolAdmin|RolModerator|RolAngajat|RolClient|undefined} Instanța obiectului de rol corespunzător sau undefined dacă codul nu este recunoscut.
     */
    static creeazaRol(cod) {
        switch(cod){
            case RolAdmin.cod : return new RolAdmin();
            case RolModerator.cod : return new RolModerator();
            case RolAngajat.cod : return new RolAngajat();
            case RolClient.cod : return new RolClient();
        }
    }
}


module.exports={
    RolFactory:RolFactory,
    Rol:Rol
}