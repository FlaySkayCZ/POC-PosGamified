import sqlite3 from "sqlite3";
import { Request, Response } from "express";
// Get the last inserted ID from the table
export function submitForm(db: sqlite3.Database, app: any) {
    // Create a route that listens for a post request 
    app.post('/test-submit-form', (req: any, res: any) => {
        console.log(req.body);
    });

    app.post('/submit-form', (req: Request, res: Response) => {
        //validate the data before insert
        let validation = validateData(req.body);
        if (validation == false) {
            res.status(400).send("Error: Invalid data");
            return;
        }
        // Assign the data from the request body to variables
        const { hostId, surname, name, reasone, birthDate, icn, residence, city, cityPart, street, arrivalDate, departureDate, Note } = req.body;
        // Insert the data into the table
        db.run(`INSERT INTO hosts (surname, name, reasone, birthDate, icn, residence, city, cityPart, street, arrivalDate, departureDate, Note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [surname, name, reasone, birthDate, icn, residence, city, cityPart, street, arrivalDate, departureDate, Note], (err) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Error: " + err.message);
                } else {
                    res.status(200).send("Data inserted successfully.");
                }
            });
    });

};

function validateData(body: any): boolean {
    // Check if all required fields are present
    const requiredFields = ['surname', 'name', 'reasone', 'birthDate', 'icn', 'residence', 'city', 'cityPart', 'street', 'arrivalDate'];
    const missingFields = requiredFields.filter((field) => !(field in body));
    if (missingFields.length > 0) {
        console.error(`Missing fields: ${missingFields}`);
        return false;
    }

    // Check that all fields are of the correct type
    if (typeof body.surname !== 'string' ||
        typeof body.name !== 'string' ||
        typeof body.reasone !== 'string' ||
        typeof body.birthDate !== 'string' ||
        typeof body.icn !== 'string' ||
        typeof body.residence !== 'string' ||
        typeof body.city !== 'string' ||
        typeof body.cityPart !== 'string' ||
        typeof body.street !== 'string' ||
        typeof body.arrivalDate !== 'string' ||
        (body.departureDate && typeof body.departureDate !== 'string')) {
        console.error(`Invalid data types: ${JSON.stringify(body)}`);
        return false;
    }

    // Check that all fields are not empty, except for 'Note'
    const emptyFields = Object.entries(body).filter(([key, value]) => key !== 'Note' && value === '');
    if (emptyFields.length > 0) {
        console.error(`Empty fields: ${JSON.stringify(emptyFields)}`);
        return false;
    }

    // Check that departure date is the same or later than arrival date
    if (body.departureDate && new Date(body.departureDate.getFullYear,body.departureDate.getMonth,body.departureDate.getDate) <= new Date(body.arrivalDate.getFullYear,body.arrivalDate.getMonth,body.arrivalDate.getDate)) {
        console.error(`Invalid departure date: ${body.departureDate} is earlier than arrival date ${body.arrivalDate}`);
        return false;
    }

    return true;
}


