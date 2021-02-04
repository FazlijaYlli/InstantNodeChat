/*
 *  ETML
 *  NOM : FAZLIJA YLLI
 *  DATE : 02.02.2021
 *  DESCRIPTION : CLASSE UTILISATEUR
*/

class User {
    id;
    name;
    color;

    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    get id() {
        return this.id;
    }
    get name() {
        return this.name;
    }
    get color() {
        return this.color;
    }
}

module.exports = User;