import express from "express";
import bodyParser from 'body-parser';
import { Database } from "sqlite3";
import { checkJwt } from 'middleware/jwt.middleware.js'
import { initRest } from './config/api/initRest.js';
import { CorsConfig } from './config/cors/cors.js';
import { initializeDatabases } from './config/database/database.js';

const corsSetup = new CorsConfig();
const app = express();
const db = initializeDatabases();
const port = 3000;

app.use(bodyParser.json());
app.use(corsSetup.setupCors(app));

console.log('Starting server...');
initRest(db, app);

app.listen(port, () => { 
    console.log(`Server is running on http://localhost:${port}`);
});



