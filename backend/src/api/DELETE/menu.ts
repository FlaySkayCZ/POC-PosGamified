import sqlite3 from "sqlite3";
import { Request, Response } from 'express';

export function DeleteMenuService(db: sqlite3.Database, app: any) {
    app.delete('/api/menu/:id', (req: Request, res: Response) => {
        const id = req.params["id"];
        db.run('DELETE FROM menu WHERE id = ?', [id], (err) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            return res.sendStatus(204);
        });

    });
}
