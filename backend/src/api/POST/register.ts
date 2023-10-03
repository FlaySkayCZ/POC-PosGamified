import sqlite3 from "sqlite3";
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthController } from '../../config/validation/auth.controller.js';
export function RegisterService(db: sqlite3.Database, app: any) {
    const authController = new AuthController();
    app.post('/api/register', async (req: Request, res: Response) => {
        try {
            var email = req.body.email;
            var username = req.body.username;
            var password = req.body.password;

            if (!email || !username || !password) {
                return res.status(400).json({ message: 'All inputs are required.' });
            }
            if (await authController.userExists(username, db)) {
                const message = 'username';
                return res.status(409).json(message);
            }
            if (await authController.emailExists(email, db)) {
                const message = 'email';
                return res.status(409).json(message);
            }
            var response = await authController.addUser(req, db);
            if (response.statusCode == 500) {
                return res.status(500).json({ message: 'Server error.' });
            } else if (response.statusCode == 200) {
                return res.status(200).json(response.token);
            }
            return res.status(500).json({ message: 'Unexpected error.' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error.' });
        }
    });
}

