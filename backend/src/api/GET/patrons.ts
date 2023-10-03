import sqlite3 from "sqlite3";
import { Request, Response } from 'express';

export function GetPatronsService(db: sqlite3.Database, app: any) {
    app.get('/api/patrons/', async (req: Request, res: Response) => {
        try {
    
            var users = db.all('SELECT * FROM patrons', (err: any, row: any) => {
                if (err) {
                    console.error(err.message);
                } else {
                    res.status(200).send(row);
                }
            });
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    });
};
