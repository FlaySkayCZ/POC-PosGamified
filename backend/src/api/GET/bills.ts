import sqlite3 from "sqlite3";
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthController } from '../../config/validation/auth.controller.js';

interface BillItems {
    bill_id: number,
    name: string,
    quantity: number,
    price: number,
}
export function GetBillsService(db: sqlite3.Database, app: any) {
    app.get('/api/bills', async (req: Request, res: Response) => {
        const userId = req.query["user_id"];
        try {
            let sql = `SELECT * FROM bills WHERE user_id = ?`;
            let params = [userId];
            if (!userId) {
                sql = `SELECT * FROM bills`;
                params = [];
            }
            db.all(sql, params, async (err, rows) => {
                if (err) {
                    return res.status(500).json({ message: 'Server error.' });
                }
                const bills = await Promise.all(
                    rows.map(async (row) => {
                        const billId = row.id;
                        const billItems = await getBillItems(billId, db);
                        return {
                            id: billId,
                            user_id: row.user_id,
                            subtotal: row.subtotal,
                            total: row.total,
                            date: row.date,
                            items: billItems,
                        };
                    })
                );
                return res.status(200).json(bills);
            });
            return res.status(500);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Server error.' });
        }
    });
}

async function getBillItems(billId: number, db: sqlite3.Database): Promise<BillItems[]> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM bill_items WHERE bill_id = ?`, [billId], (err, rows) => {
            if (err) {
                reject(err);
            }
            const items = rows.map((row) => ({
                bill_id: row.bill_id,
                name: row.name,
                quantity: row.quantity,
                price: row.price,
            }));
            resolve(items);
        });
    });
}