import Db from "@utils/dbObjects/database";

export default class baseObject {

    static #db: Db;
    protected id : number

    protected constructor(id: number) {
        if (!baseObject.#db) {
            baseObject.#db = Db.getInstance();
        }

        this.id = id;
    }

    protected static get db(): Db {
        if (!baseObject.#db) {
            baseObject.#db = Db.getInstance();
        }

        return baseObject.#db;
    }

    // Javascript supporte le fait d'avoir la meme signature de methode pour du static et du non static
    // ça rends le code plus lisible sur les autres classes
    protected get db(): Db {
        return baseObject.db;
    }
}