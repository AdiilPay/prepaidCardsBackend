import baseObject from "@dbObjects/baseObject";
import ServerProfile from "@serverObjects/profile";
import Card from "@dbObjects/Card";
import {toBigInt} from "@utils/parser";

export default class Profile extends baseObject {

    private constructor(id: bigint) {
        super(id);
    }

    public static async get(id : bigint): Promise<Profile | null> {
        return new Promise((resolve, reject) => {
            this.db.select("SELECT * FROM profile WHERE id = ?", [id]).then((results) => {
                if (results.length === 0) {
                    return resolve(null);
                } else {
                    resolve(new Profile(id));
                }

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

    public async getCards(): Promise<bigint[]> {
        return new Promise((resolve, reject) => {
            this.db.select("SELECT id FROM carte WHERE profile_id = ?", [this.id]).then((results: {id: string}[]) => {
                // On transforme tous les id en BigInt
                // Et on dégage les null
                resolve(results.map((card) => toBigInt(card.id)).filter((id) => id !== null));
            }
            ).catch(reject);
        });
    }

    // TODO
    public async toJSON(): Promise<ServerProfile> {

        return new Promise((resolve, reject) => {
            this.db.select("SELECT * FROM profile WHERE id = ?", [this.id]).then((results) => {
                if (results.length === 0) {
                    return reject("Profile not found");
                }

                const profile = results[0];
                this.getCards().then(() => {
                    resolve({
                        id: profile.id,
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        creation_date: profile.creation_date,
                        points: profile.points,
                    });
                }).catch(reject);
            }).catch(reject);

    })};

}