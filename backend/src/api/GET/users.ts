import sqlite3 from "sqlite3";
import { Request, Response } from 'express';

export function GetUsersService(db: sqlite3.Database, app: any) {
    app.get('/api/users/', async (req: Request, res: Response) => {
        var token = null;
        const authHeader = req.headers.authorization;
        const id = req.headers["id"];
        if (authHeader) {
            token = authHeader.split(' ')[1];
        }
        try {
            if (token == null) {
                res.status(401).send('Unauthorized');
                return;
            }
            const user = await db.get('SELECT * FROM users WHERE id = ?', id);
            if (!user) {
                res.status(401).send('Unauthorized');
                return;
            }
            db.all('SELECT id, username, email, role FROM users', (err: any, rows: any) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    const users = rows.map((row: any) => {
                        const userData = {
                            id: row.id,
                            username: row.username,
                            email: row.email,
                            role: row.role
                        };
                        return userData;
                    });
                    res.json(users);
                }
            });
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    });
};
