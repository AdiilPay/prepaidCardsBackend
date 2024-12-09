import mysql, {RowDataPacket} from "mysql2";
import Db from "@utils/dbObjects/database";

export default class baseObject {

    protected static db: Db;
    protected id : number

    protected constructor(id: number) {
        if (!baseObject.db) {
            baseObject.db = Db.getInstance();
        }

        this.id = id;
    }
}