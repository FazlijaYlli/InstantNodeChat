/*
 *  ETML
 *  NOM : FAZLIJA YLLI
 *  DATE : 02.02.2021
 *  DESCRIPTION : CLASSE UTILISATEUR
*/

class User {
    name;
    color;

    constructor(name, color) {
        this.name = name;
        this.color = color;
    }

    get name() {
        return this.name;
    }
    get color() {
        return this.color;
    }
}

module.exports = User;