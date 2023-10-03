import sqlite3 from 'sqlite3';
import { faker } from '@faker-js/faker/locale/en'



// Define the number of rows to insert into each table
const NUM_CUSTOMERS = 10;
const NUM_MENU_ITEMS = 20;
const NUM_PATRONS = 5;

//db[0] is the hosts database. With table hosts
//db[1] is the menu database. With table menu
//db[2] is the userbase database. With table patrons and users
 

// Define the data for the tables
const customerData = Array.from({ length: NUM_CUSTOMERS }, () => [
  faker.name.lastName(),
  faker.name.firstName(),
  faker.random.word(),
  faker.date.past().toISOString().slice(0, 10),
  faker.random.numeric().toString(),
  faker.address.streetAddress(),
  faker.address.city(),
  faker.address.county(),
  faker.address.street(),
  faker.date.between('2023-02-25', '2023-03-05').toISOString().slice(0, 10),
  faker.date.between('2023-03-06', '2023-03-10').toISOString().slice(0, 10),
  faker.lorem.sentence(),
]);

const menuData = Array.from({ length: NUM_MENU_ITEMS }, () => [
  faker.commerce.price(),
  faker.commerce.productName(),
  faker.lorem.sentence(),
  faker.random.words(6),
]);

const patronData = Array.from({ length: NUM_PATRONS }, () => [
  faker.name.firstName(),
  faker.random.numeric(2, { allowLeadingZeros: true, bannedDigits: ['0'] }),
  faker.random.numeric(2, { allowLeadingZeros: true, bannedDigits: ['0'] }),
  faker.random.words(3),
]);

export function insertDummyData(db: sqlite3.Database, Counter: number) {
  console.log(Counter);
  if (db === undefined) {
    console.log('db is undefined');
    return;
  }
  if (Counter = 0) {
    // Insert dummy data into the hosts table in the hosts database
    const customerStatement = db.prepare('INSERT INTO hosts (surname, name, reasone, birthDate, icn, residence, city, cityPart, street, arrivalDate, departureDate, Note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const customer of customerData) {
      customerStatement.run(customer, (err) => {
        if (err) {
          console.error(err.message);
        }
      });
    }
  }
  if (Counter = 1) {
    // Insert dummy data into the menu table in the menu database
    const menuStatement = db.prepare('INSERT INTO menu (price, name, description, category) VALUES (?, ?, ?, ?)');
    for (const menuItem of menuData) {
      menuStatement.run(menuItem, (err) => {
        if (err) {
          console.error(err.message);
        }
      });
    }
  }
  if (Counter = 2) {
    // Insert dummy data into the patrons table in the userbase database
    const patronStatement = db.prepare('INSERT INTO patrons (name, experience, expense, category, user_id) VALUES (?, ?, ?, ?, ?)');
    // Set all patrons to have user_id 1 (the first user in the users table)
    const userId = 1;
    for (const patron of patronData) {
      patronStatement.run([...patron, userId], (err) => {
        if (err) {
          console.error(err.message);
        }
      });
    }
    return;
  }

}
