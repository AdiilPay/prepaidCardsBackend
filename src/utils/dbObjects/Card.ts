import baseObject from "@utils/dbObjects/baseObject";

export default class Card extends baseObject {

    private constructor(id : number) {
        super(id);
    }

    public static async get(id : number): Promise<Card> {
        return new Promise((resolve, reject) => {
            this.db.select("SELECT * FROM carte WHERE id = ?", [id]).then((results) => {
                if (results.length === 0) {
                    return reject("Card not found");
                }

                resolve(new Card(results[0].id));

            }).catch(reject);
        });
    }

    // Active la carte (= autorise les transactions via cette carte)
    public async enable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.query("UPDATE carte SET enabled = 1 WHERE id = ?", [this.id]).then(() => {
                resolve();
            }).catch(reject);
        });
    }

    // Désactive la carte (= interdit les transactions via cette carte)
    public async disable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.query("UPDATE carte SET enabled = 0 WHERE id = ?", [this.id]).then(() => {
                resolve();
            }).catch(reject);
        });
    }

    public async isEnabled(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.select("SELECT enabled FROM carte WHERE id = ?", [this.id]).then((results) => {
                resolve(results[0].enabled === 1);
            }).catch(reject);
        });
    }
}

