import { Request, Response } from 'express';
import sqlite3 from "sqlite3";

export function GetMenuService(db: sqlite3.Database, app: any) {
    app.get('/api/menu/', async (req: Request, res: Response) => {
        try {
            var menu = db.all('SELECT * FROM menu', (err: any, row: any) => {
                if (err) {
                    console.error(err.message);
                } else {
                    res.json(row);
                }
            });
        }
        catch (error: any) {
            res.status(500).send(error.message);
        }
    });
}


