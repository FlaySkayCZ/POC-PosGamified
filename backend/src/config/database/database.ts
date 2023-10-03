import fs from 'fs';
import sqlite3 from 'sqlite3';
import { setTable } from '../../models/database.js';
const hosts = './databases/hosts.db';
const menu = './databases/menu.db';
const userbase = './databases/userbase.db';

const dbPaths = [hosts, menu, userbase];
const databases: sqlite3.Database[] = [];

//db[0] is the hosts database. With table hosts
//db[1] is the menu database. With table menu
//db[2] is the userbase database. With table patrons and users

// Check if the database file exists before creating or connecting to it
export function initializeDatabases() {
    // Use try-catch to handle errors and write to the console
    for (let i = 0; i < dbPaths.length; i++) {
        let db: sqlite3.Database;
        if (!fs.existsSync(dbPaths[i])) {
            db = new sqlite3.Database(dbPaths[i], sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log(`${dbPaths[i]} created.`);
                setTable(db, dbPaths[i]);
            });
        } else {
            // Connect to the existing database
            db = new sqlite3.Database(dbPaths[i], (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log(`Connected to ${dbPaths[i]}.`);
                setTable(db, dbPaths[i]);
            });
        }
        databases.push(db);
    }
   //initDummyData();
    return databases;
};

import { insertDummyData } from './../../tests/insert-dummy-data.js';
function initDummyData() {
    // for (let i = 0; i < databases.length; i++) {
    //     insertDummyData(databases[i], i);
    // }
}


