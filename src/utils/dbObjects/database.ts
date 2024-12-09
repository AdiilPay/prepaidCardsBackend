import mysql, {RowDataPacket} from "mysql2";

export default class Db {

    private static instance: Db;
    private conn: mysql.Connection;

    private constructor() {
        this.conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
    }

    public static getInstance(): Db {
        if (!Db.instance) {
            Db.instance = new Db();
        }

        return Db.instance;
    }

    public async query(query: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.conn.query(query, params, (err, results) => {
                if (err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
    }

    public async select(query: string, params: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<RowDataPacket[]>(query, params, (err, results) => {
                if (err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
    }
}