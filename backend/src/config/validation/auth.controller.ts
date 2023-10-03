import { json, Request, Response } from 'express';
import { isTableEmpty } from './isTableEmpty.js';
import sqlite3 from "sqlite3";
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
interface MyReturnType {
  statusCode: number;
  token: string | null;
}

export class AuthController {
  async login(req: Request, db: sqlite3.Database): Promise<{ token: string } | null> {
    return new Promise((resolve, reject) => {
      var login = req.body.email;
      var password = req.body.password;
      const query = "SELECT * FROM users WHERE email = ?";
      db.get(query, login, async (err: any, row: any) => {
        if (err || !row) {
          return reject("Wrong username or password");
        }
        var passwordMatch = await bcrypt.compare(password, row.password);
        if (!passwordMatch) {
          return reject("Password does not match");
        }
        const payload = {
          id: row.id,
          role: row.role,
          expires: Math.floor(Date.now() / 1000) + 3600  // Expires in one hour
        };
        const token = jwt.sign(payload, 'secret');
        return resolve({ token });
      });
    });
  }

  async logout(req: Request, db: sqlite3.Database): Promise<MyReturnType> {
    try {
      const token = this.getTokenFromRequest(req);
      await this.destroyToken(token!, db);
      return { statusCode: 200, token: null };
    } catch (error) {
      return { statusCode: 500, token: null };
    }
  }

  getTokenFromRequest(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    return token || null;
  }

  async destroyToken(token: string, db: sqlite3.Database): Promise<void> {
    const query = 'UPDATE users SET token = null WHERE token = ?';
    await db.run(query, token);
  }

  async addUser(req: Request, db: sqlite3.Database): Promise<MyReturnType> {
    try {
      let role = 'patron';
      if (await isTableEmpty(db)) {
        role = 'admin';
      }
      var username = req.body.username;
      var password = req.body.password;
      var email = req.body.email;
      var hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const query = "INSERT INTO users (username, password, email, role) VALUES (?, ? ,?, ?)";
      await db.run(query, username, hashedPassword, email, role);

      db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
          console.error(err.message);
        }
        // find the latest ID
        const latestId = rows[rows.length - 1].id;
        const patronQuery = "INSERT INTO patrons (name, experience, expense, category, user_id) VALUES (?, ?, ?, ?, ?)";
        db.run(patronQuery, username, 0, 0, "", latestId);
      });
      const result = await this.login(req, db);
      if (!result) {
        throw new Error('Login failed');
      }
      const { token } = result;
      return { statusCode: 200, token };
    } catch (error) {
      return { statusCode: 500, token: null };
    }
  }

  async userExists(username: string, db: sqlite3.Database): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) AS count FROM users WHERE username = ?', username, (err: any, row: any) => {
        if (err) {
          console.error('userExists', err.message);
          reject(err);
        } else {
          console.log('userExists', row.count);
          resolve(row.count > 0);
        }
      });
    });
  }

  async emailExists(email: string, db: sqlite3.Database): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) AS count FROM users WHERE email = ?', email, (err: any, row: any) => {
        if (err) {
          console.error('emailExists', err.message);
          reject(err);
        } else {
          console.log('emailExists', row.count);
          resolve(row.count > 0);
        }
      });
    });
  }

}
