import sqlite3 from "sqlite3";
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthController } from '../../config/validation/auth.controller.js';

export function LoginService(db: sqlite3.Database, app: any) {
    const authController = new AuthController();
    app.post('/api/login', async (req: Request, res: Response) => {
        try {
            const username = req.body.email;
            const password = req.body.password;
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required.' });
            }
            var token = await authController.login(req, db);
            console.log('LoginService',token);

            if (!token) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
            return res.status(200).json(token);
        } catch (error) {
            return res.status(500).json({ message: 'Server error.' });
        }
    });
};
