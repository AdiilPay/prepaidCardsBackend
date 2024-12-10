import baseObject from "@utils/dbObjects/baseObject";
import ServerProfile from "@utils/interfaces/server/profile";
import Card from "@utils/dbObjects/Card";

export default class Profile extends baseObject {

    private constructor(id: number) {
        super(id);
    }

    public static async get(id : number): Promise<Profile> {
        return new Promise((resolve, reject) => {
            this.db.select("SELECT * FROM profile WHERE id = ?", [id]).then((results) => {
                if (results.length === 0) {
                    return reject("Profile not found");
                }

                resolve(new Profile(results[0].id));

            }).catch(reject);
        });
    }

    public async updateProfile(fname: string, lname: string): Promise<Profile> {
        return new Promise((resolve, reject) => {
            this.db.query("UPDATE profile SET first_name = ?, last_name = ? WHERE id = ?", [fname, lname, this.id]).then(() => {
                resolve(this);
            }).catch(reject);
        });
    }

    public async getCards(): Promise<Card[]> {
        return new Promise((resolve, reject) => {
            this.db.select("SELECT id FROM carte WHERE profile_id = ?", [this.id]).then((results) => {
                const cards = [];
                for (const result of results) {
                    cards.push(Card.get(result.id));
                }
                Promise.all(cards).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    // TODO
    public async toJSON(): Promise<ServerProfile> {

    }

}