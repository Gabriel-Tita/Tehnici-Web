sirAlphaNum="";
v_intervale=[[48,57],[65,90],[97,122]]
for(let interval of v_intervale){
    for(let i=interval[0]; i<=interval[1]; i++)
        sirAlphaNum+=String.fromCharCode(i)
}

console.log(sirAlphaNum);

/**
 * Generează un token aleatoriu format din caractere alfanumerice, având o lungime specificată.
 * * @param {number} n - Lungimea (numărul de caractere) pe care o va avea token-ul generat.
 * @returns {string} Token-ul alfanumeric generat în mod aleatoriu.
 */
function genereazaToken(n){
    let token=""
    for (let i=0;i<n; i++){
        token+=sirAlphaNum[Math.floor(Math.random()*sirAlphaNum.length)]
    }
    return token;
}

module.exports.genereazaToken=genereazaToken;