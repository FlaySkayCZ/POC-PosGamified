import sqlite3 from 'sqlite3';
//db[0] is the hosts database. With table hosts
//db[1] is the menu database. With table menu
//db[2] is the userbase database. With table patrons and users
function setTable(db: sqlite3.Database, name: string): void {
    switch (name) {
        case './databases/hosts.db':
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='hosts'", (err: any, row: any) => {
                if (!row) {
                    db.run(`CREATE TABLE hosts (
                id INTEGER PRIMARY KEY,
                surname TEXT,
                name TEXT,
                reasone TEXT,
                birthDate TEXT,
                icn TEXT,
                residence TEXT,
                city TEXT,
                cityPart TEXT,
                street TEXT,
                arrivalDate TEXT,
                departureDate TEXT,
                Note TEXT
        )`);
                    console.log('Table hosts created.');
                } else {
                    console.log('Table hosts already exists.');
                }
            });
            break;
        case './databases/menu.db':
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='menu'", (err: any, row: any) => {
                if (!row) {
                    db.run(`CREATE TABLE menu ( 
                id INTEGER PRIMARY KEY,
                price DOUBLE,
                name TEXT,
                description TEXT,
                category TEXT
                )`);
                    console.log('Table menu created.');
                } else {
                    console.log('Table menu already exists.');
                }
            });
            break;
        case './databases/userbase.db':
            // Create the patrons table
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='patrons'", (err: any, row: any) => {
                if (!row) {
                    db.run(`CREATE TABLE patrons (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL UNIQUE, 
                        experience DOUBLE,
                        expense DOUBLE,
                        category TEXT,
                        user_id INTEGER NOT NULL,
                        bill_id INTEGER NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id),
                        FOREIGN KEY (bill_id) REFERENCES bills(id)
                        )`);
                    console.log('Table patrons created.');
                } else {
                    console.log('Table patrons already exists.');
                }
            });
            // Create the bill_items table
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='bill_items'", (err: any, row: any) => {
                if (!row) {
                    db.run(`CREATE TABLE bill_items (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        quantity INTEGER NOT NULL,
                        price DOUBLE NOT NULL,
                        bill_id INTEGER NOT NULL,
                        FOREIGN KEY (bill_id) REFERENCES bills(id)
                        )`);
                    console.log('Table bill_items created.');
                } else {
                    console.log('Table bill_items already exists.');
                }
            });
            // Create the bills table
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='bills'", (err: any, row: any) => {
                if (!row) {
                    db.run(`CREATE TABLE bills (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        date datetime NOT NULL,
                        total DOUBLE NOT NULL,
                        user_id INTEGER NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id)
                        )`);
                    console.log('Table bills created.');
                } else {
                    console.log('Table patrbillsons already exists.');
                }
            });
            // Create the users table
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err: any, row: any) => {
                if (!row) {
                    db.run(`CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL UNIQUE,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        role TEXT NOT NULL,
                        token TEXT
                        )`);

                    console.log('Table users created.');
                } else {
                    console.log('Table users already exists.');
                }
            });
            break;
        default:
            console.log('No table created.');
            break;
    }
}

export { setTable };
