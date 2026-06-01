/**
 * @typedef Drepturi
 * @type {Object}
 * @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe pagina cu tabelul de utilizatori.
 * @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator.
 * @property {Symbol} cumparareProduse Dreptul de a cumpara produse.
 * @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari.
 * @property {Symbol} adaugareProduse Dreptul de a adăuga produse noi în catalog.
 * @property {Symbol} modificareProduse Dreptul de a modifica detaliile produselor existente.
 * @property {Symbol} stergereProduse Dreptul de a șterge produse din catalog.
 */


/**
 * Obiect global ce încapsulează toate drepturile unice (mărcate prin Symbol) disponibile în sistem.
 * @name module.exports.Drepturi
 * @type {Drepturi}
 */
const Drepturi = {
    vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
    stergereUtilizatori: Symbol("stergereUtilizatori"),
    cumparareProduse: Symbol("cumparareProduse"),
    vizualizareGrafice: Symbol("vizualizareGrafice"),
    adaugareProduse: Symbol("adaugaProduse"),
    modificareProduse: Symbol("modificaProduse"),
    stergereProduse: Symbol("stergeProduse")
}

module.exports=Drepturi;