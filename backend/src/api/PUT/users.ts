import sqlite3 from "sqlite3";
import { Request, Response, Express } from 'express';

export function UpdateUserService(db: sqlite3.Database, app: any) {
    app.put('/api/users/:id', async (req: Request, res: Response) => {
        var token = null;
        const authHeader = req.headers.authorization;
        const id = req.headers["id"];
        const userId = req.params["id"];
        const userData = req.body;
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
            const username = userData.username;
            const role = userData.role;
            db.run('UPDATE users SET username = ?, role = ? WHERE id = ?', [username, role, userId], (err) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }
                return res.sendStatus(204);
            });
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    });
}

