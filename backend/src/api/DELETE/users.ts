import sqlite3 from "sqlite3";
import { Request, Response } from 'express';

export function DeleteUserService(db: sqlite3.Database, app: any) {
    app.delete('/api/users/:id', (req: Request, res: Response) => {
        var token = null;
        const authHeader = req.headers.authorization;
        const id = req.headers["id"];
        const userId = req.params["id"];
        if (authHeader) {
            token = authHeader.split(' ')[1];
        }
        try {
            if (token == null) {
                res.status(401).send('Unauthorized');
                return;
            }
            const user = db.get('SELECT * FROM users WHERE id = ?', id);
            if (!user) {
                res.status(401).send('Unauthorized');
                return;
            }
            db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }
                return res.sendStatus(204);
            });
        }
        catch (error: any){
            res.status(500).send(error.message);
        }
    });
}
