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
export function BillsService(db: sqlite3.Database, app: any) {
    app.post('/api/bills', async (req: Request, res: Response) => {

        const userId = req.body.user_id;
        const subtotal = req.body.subtotal;
        const total = req.body.total;
        const date = req.body.date;

        // Save new bill to database and get the bill ID
        let billId = await saveBillToDatabase(userId, total, date, db);

        if (billId == undefined) {
            return res.status(500).json({ message: 'Server error.' });
        }
        return res.status(201).json(billId);
    });

};
// Helper functions to save bill and bill items to database
function saveBillToDatabase(userId: number, total: number, date: Date, db: sqlite3.Database): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
        if (userId < 0) {
            db.run(`INSERT INTO bills (date, total, user_id) VALUES (?, ?, ?)`, [date, total, -1], function (err: any) {
                if (err) {
                    resolve(undefined);
                }
                // get the last insert id
                resolve(this.lastID);
            });
        } else {
            db.run(`INSERT INTO bills (date, total, user_id) VALUES (?, ?, ?)`, [date, total, userId], function (err: any) {
                if (err) {
                    resolve(undefined);
                }
                // get the last insert id
                resolve(this.lastID);
            });
        }
    });
}

export function BillsItemService(db: sqlite3.Database, app: any) {
    app.post('/api/bill_items', async (req: Request, res: Response) => {
        const items = req.body;
        const promises = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const name = item.name;
            const quantity = item.quantity;
            const price = item.price;
            const billsId = item.bill_id;
            promises.push(saveItemsToDatabase(name, quantity, price, billsId, db));
        }
        try {
            await Promise.all(promises);
            return res.status(201).json({ message: 'Items saved successfully.' });
        } catch (error) {
            console.log(error);

            return res.status(500).json({ message: 'Server error.' });
        }
    });
}

function saveItemsToDatabase(name: string, quantity: number, price: number, billsId: number, db: sqlite3.Database): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO bill_items (name, quantity, price, bill_id) VALUES (?, ?, ?, ?)`, [name, quantity, price, billsId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}


