import baseObject from "@utils/dbObjects/baseObject";

export default class Card extends baseObject {

    private constructor(id : number) {
        super(id);
    }

    public static async get(id : number): Promise<Card> {
        return new Promise((resolve, reject) => {
            this.db.select("SELECT * FROM carte WHERE id = ?", [id]).then((results) => {
                if (results.length === 0) {
                    return reject("Carte not found");
                }
                resolve(new Card(results[0].id));

            }).catch(reject);
        });
    }
}

