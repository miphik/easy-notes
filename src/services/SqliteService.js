// @flow
const sqlite3 = require('sqlite3').verbose();

const MESSAGES = {};

/*
* sqlite3.OPEN_READONLY: open the database for read-only.
* sqlite3.OPEN_READWRITE : open the database for reading and writting.
* sqlite3.OPEN_CREATE: open the database, if the database does not exist, create a new database.
* */
const db = new sqlite3.Database('./db/chinook.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});

const createDb = () => {
    console.log('createDb chain');
    db = new sqlite3.Database('chain.sqlite3', createTable);
}


const createTable = () => {
    console.log('createTable lorem');
    db.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT)', insertRows);
}

const insertRows = () => {
    console.log('insertRows Ipsum i');
    const stmt = db.prepare('INSERT INTO lorem VALUES (?)');

    for (let i = 0; i < 10; i++) {
        stmt.run(`Ipsum ${i}`);
    }

    stmt.finalize(readAllRows);
}

const readAllRows = () => {
    console.log('readAllRows lorem');
    db.all('SELECT rowid AS id, info FROM lorem', (err, rows) => {
        rows.forEach(row => {
            console.log(`${row.id}: ${row.info}`);
        });
        closeDb();
    });
}

const closeDb = () => {
    console.log('closeDb');
    db.close();
}
