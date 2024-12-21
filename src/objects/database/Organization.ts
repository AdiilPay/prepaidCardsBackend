import baseObject from "@dbObjects//baseObject";

export default class Organization extends baseObject {

        private constructor(id: bigint) {
            super(id);
        }

        public static async get(id : bigint): Promise<Organization> {
            return new Promise((resolve, reject) => {
                this.db.select("SELECT * FROM profile WHERE id = ?", [id]).then((results) => {
                    if (results.length === 0) {
                        return reject("Profile not found");
                    }

                    resolve(new Organization(id));

                }).catch(reject);
            });
        }

        public async updateOrganization(name: string, fidelityEnabled : boolean, fidelityRate : number): Promise<Organization> {
            return new Promise((resolve, reject) => {
                this.db.query("UPDATE organization SET name = ?, fidelity_enabled = ?, fidelity_rate = ? WHERE id = ?", [name, fidelityEnabled, fidelityRate, this.id]).then(() => {
                    resolve(this);
                }).catch(reject);
            });
        }


}