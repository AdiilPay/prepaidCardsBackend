import Db from "@dbObjects/database";

export default class baseObject {

    static #db: Db;
    protected _id : bigint

    public get id() : bigint {
        return this._id;
    }
    protected set id(v : bigint) {
        this._id = v;
    }

    protected constructor(id: bigint) {
        if (!baseObject.#db) {
            baseObject.#db = Db.getInstance();
        }

        this._id = id;
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