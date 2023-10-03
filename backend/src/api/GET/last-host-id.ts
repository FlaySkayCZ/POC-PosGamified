import sqlite3 from "sqlite3";
import { Request, Response } from 'express';

// Get the last inserted ID from the table
export function lastHostId(db: sqlite3.Database, app: any) {
    app.get('/get-last-id', (req: Request, res: Response) => {
        db.get("SELECT MAX(id) as last_id FROM hosts", (err: any, row: any) => {
            if (err) {
                console.error(err.message);
            } else {
                // Set the next ID to one more than the last inserted ID or 1 if there are no records
                const nextId = row.last_id ? row.last_id + 1 : 1;
                console.log(`Next ID: ${nextId}`);
                console.log(row.last_id);
                res.send({ nextId: nextId });
            }
        });
    });
};
