import baseObject from "@dbObjects/baseObject";

export default class Agent extends baseObject {

    private constructor(id: number) {
        super(id);
    }

    public static async get(id : number): Promise<Agent> {
        return new Promise((resolve, reject) => {
            this.db.select("SELECT * FROM agent WHERE id = ?", [id]).then((results: any) => {
                if (results.length === 0) {
                    return reject("Agent not found");
                }

                resolve(new Agent(results[0].id));

            }).catch(reject);
        });
    }

    public async updateAgent(login: string, hashedPassword: string): Promise<Agent> {
        return new Promise((resolve, reject) => {
            this.db.query("UPDATE agent SET login = ?, password = ? WHERE id = ?", [login, hashedPassword, this.id]).then(() => {
                resolve(this);
            }).catch(reject);
        });
    }

    public async deleteAgent(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.query("DELETE FROM agent WHERE id = ?", [this.id]).then(() => {
                resolve();
            }).catch(reject);
        });
    }


}
