let sqlite3 = require('sqlite3').verbose();
let defaultPets = require('./sample-data/pets.json');
let defaultTreats = require('./sample-data/treats.json');

const DBSOURCE = 'db.sqlite';

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // CANT OPEN DB
        console.error(err.message);
        throw err;
    }
    console.log('Connected to the SQLite database!');

    console.log('creating pets table...')
    db.run(`CREATE TABLE pets(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text,
        description text,
        weight real,
        pic text
    )`, (err) => {
        if (err) {
            // table already created 
            console.log('Did not create pets table... already exists')
        }
        else {
            // populate the table
            let insert = 'INSERT INTO pets (name, description, weight, pic) VALUES (?,?,?,?)';
            for (let pet of defaultPets) {
                db.run(insert, [pet.name, pet.description, pet.weight, pet.pic]);
            }
        }
    });

    console.log('creating treats table...')
    db.run(`CREATE TABLE treats(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text,
        description text,
        calories integer
    )`, (err) => {
        if (err) {
            // table already created 
            console.log('Did not create treats table... already exists')
        }
        else {
            // populate the table
            let insert = 'INSERT INTO treats (name, description, calories) VALUES (?,?,?)';
            for (let treat of defaultTreats) {
                db.run(insert, [treat.name, treat.description, treat.calories]);
            }
        }
    });


});

module.exports = db;