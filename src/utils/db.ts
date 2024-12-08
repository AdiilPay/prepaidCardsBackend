import mysql, {ResultSetHeader, RowDataPacket} from "mysql2";
import { v4 as uuidv4 } from 'uuid';

import linkedTransaction from "@utils/interfaces/server/linkedTransaction";
import Transaction from "@utils/interfaces/server/transaction";
import Carte from "@utils/interfaces/server/carte";
import Agent from "@utils/interfaces/server/agent";

export default class Db {

    private static instance: Db;
    private conn: mysql.Connection;

    private constructor() {
        this.conn =  mysql.createConnection({
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

    // Transactions:

    public async addTransaction(memberId : number, montant : number, idCarte : string): Promise<Transaction> {

        const now = new Date();

        return new Promise((resolve, reject) => {
            this.conn.query<ResultSetHeader>("INSERT INTO transaction (membre_id, date, montant, carte_id) VALUES (?, ?, ?, ?)", [memberId, now, montant, idCarte], (err, results) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    id: results.insertId,
                    membre_id: memberId,
                    date: now,
                    montant: montant,
                    carte_id: idCarte
                });
            });
        });

    }

    public async getTransactions(): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<RowDataPacket[]>("SELECT * FROM transaction", (err, results) => {
                if (err) {
                    return reject(err);
                }

                const transactions: Transaction[] = [];

                for (const row of results) {
                    transactions.push({
                        id: row.id,
                        membre_id: row.membre_id,
                        date: row.date,
                        montant: row.montant,
                        carte_id: row.carte_id
                    });
                }

                resolve(transactions);
            });
        });
    }

    public async getCardTransactions(idCarte : string): Promise<linkedTransaction[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<RowDataPacket[]>("SELECT transaction.id, login, transaction.date, transaction.montant, transaction.carte_id FROM transaction INNER JOIN membre ON membre.id = transaction.membre_id  WHERE  transaction.carte_id = ?", [idCarte], (err, results) => {
                if (err) {
                    return reject(err);
                }

                const transactions: linkedTransaction[] = [];

                for (const row of results) {
                    transactions.push({
                        id: row.id,
                        login: row.login,
                        date: row.date,
                        montant: Number(row.montant),
                        carte_id: row.carte_id
                    });
                }

                resolve(transactions);
            });
        });
    }

    public async getAgentTransactions(memberId : number): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<RowDataPacket[]>("SELECT * FROM transaction WHERE membre_id = ?", [memberId], (err, results) => {
                if (err) {
                    return reject(err);
                }

                const transactions: Transaction[] = [];

                for (const row of results) {
                    transactions.push({
                        id: row.id,
                        membre_id: row.membre_id,
                        date: row.date,
                        montant: row.montant,
                        carte_id: row.carte_id
                    });
                }

                resolve(transactions);
            });
        });
    }

    // Cards :

    public async addCard(prenom: string, nom: string): Promise<Carte> {

        const id = uuidv4();
        const now = new Date();

        return new Promise((resolve, reject) => {
            this.conn.query<ResultSetHeader>("INSERT INTO carte (id, prenom, nom, date_creation, solde) VALUES (?, ?, ?, ?, ?)", [id, prenom, nom, now, 0], (err, results) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    id: id,
                    prenom: prenom,
                    nom: nom,
                    date_creation: now,
                    solde: 0
                });
            });
        });
    }

    public async getCard(id: string): Promise<Carte> {
        return new Promise((resolve, reject) => {
            this.conn.query<RowDataPacket[]>("SELECT * FROM carte WHERE id = ?", [id], (err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return reject(new Error("Card not found"));
                } else {
                    const row = results[0];
                    resolve({
                        id: row.id,
                        prenom: row.prenom,
                        nom: row.nom,
                        date_creation: row.date_creation,
                        solde: Number(row.solde),
                    });
                }
            });
        });
    }

    public async getCards(): Promise<Carte[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<RowDataPacket[]>("SELECT * FROM carte", (err, results) => {
                if (err) {
                    return reject(err);
                }

                const cartes: Carte[] = [];

                for (const row of results) {
                    cartes.push({
                        id: row.id,
                        prenom: row.prenom,
                        nom: row.nom,
                        date_creation: row.date_creation,
                        solde: Number(row.solde)
                    });
                }

                resolve(cartes);
            });
        });
    }

    public async addMember(login: string, password: string): Promise<Agent> {

        return new Promise((resolve, reject) => {
            this.conn.query<ResultSetHeader>("INSERT INTO membre (login, password) VALUES (?, ?)", [login, password], (err, results) => {
                if (err) {
                    return reject(err);
                }

                resolve({
                    id: results.insertId,
                    login: login,
                    password: password
                });
            });
        });


    }

    public async getMember(login: string): Promise<Agent> {
        return new Promise((resolve, reject) => {
            this.conn.query<RowDataPacket[]>("SELECT * FROM membre WHERE login = ?", [login], (err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return reject(new Error("Member not found"));
                } else {
                    const row = results[0];
                    resolve({
                        id: row.id,
                        login: row.login,
                        password: row.password
                    });
                }
            });
        });
    }

    public async getMemberById(id: number): Promise<Agent> {
        return new Promise((resolve, reject) => {
            this.conn.query<RowDataPacket[]>("SELECT * FROM membre WHERE id = ?", [id], (err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return reject(new Error("Member not found"));
                } else {
                    const row = results[0];
                    resolve({
                        id: row.id,
                        login: row.login,
                        password: row.password
                    });
                }
            });
        });
    }

}



