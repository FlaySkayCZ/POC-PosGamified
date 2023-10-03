import sqlite3 from "sqlite3";
import { Request, Response } from 'express';
export function PostMenuService(db: sqlite3.Database, app: any) {
    app.post('/api/menu', (req: Request, res: Response) => {
        const item = req.body;
        console.log(item);
        if (item.id === -1) {
            try {
                db.run(`INSERT INTO menu (name, description, price, category) VALUES (?, ?, ?, ?)`,
                    [item.name, item.description, item.price, item.category],
                    function (error) {
                        if (error) {
                            console.log(error);
                            res.status(500).send({ message: "An error occurred while inserting the menu item." });
                        } else {
                            res.status(200).send({ message: "Menu item inserted successfully." });
                        }
                    }
                );
            } catch (error) {
                console.log(error);
                res.status(500).send({ message: "An error occurred while Adding the menu item." });
            }
        }
        else {
            try {

                db.run(`UPDATE menu SET name = ?, description = ?, price = ?, category = ? WHERE id = ?`,
                    [item.name, item.description, item.price, item.category, item.id],
                    function (error) {
                        if (error) {
                            console.log(error);
                            res.status(500).send({ message: "An error occurred while updating the menu item." });
                        } else {
                            res.status(200).send({ message: "Menu item updated successfully." });
                        }
                    }
                );
            } catch (error) {
                console.log(error);
                res.status(500).send({ message: "An error occurred while updating the menu item." });
            }
        }
    });
}
