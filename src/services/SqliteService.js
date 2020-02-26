// @flow
// import {LOCAL_DB_FULL_PATH} from 'src/constants/general';
const LOCAL_DB_FULL_PATH = './ss.db';
const sqlite3 = require('sqlite3').verbose();

const MESSAGES = {};

//SELECT body, highlight(notes_fts, 1, '<', '>') AS HighlightDesc
// FROM notes_fts WHERE body MATCH 'wor*' ORDER BY rank;
const NOTES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS note (
    uuid TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    updatedAt INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    isDeleted INTEGER NOT NULL DEFAULT false
);
`;
const NOTES_VIRTUAL_TABLE_SQL = 'CREATE VIRTUAL TABLE note_search USING fts5(title,text);';
const TAGS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS tag (
    uuid TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    updatedAt INTEGER NOT NULL,
    createdAt INTEGER NOT NULL
);
`;
const CATEGORIES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS category (
    category_uuid TEXT NOT NULL,
    note_uuid TEXT NOT NULL,
    PRIMARY KEY (note_uuid, category_uuid),
    FOREIGN KEY (note_uuid) REFERENCES note (uuid) ON DELETE CASCADE
);
`;
const NOTES_TAGS_HAVE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS tag_has_note (
    tag_uuid TEXT NOT NULL,
    note_uuid TEXT NOT NULL,
    PRIMARY KEY (tag_uuid, note_uuid),
    FOREIGN KEY (tag_uuid) REFERENCES tag (uuid) ON DELETE CASCADE,
    FOREIGN KEY (note_uuid) REFERENCES note (uuid) ON DELETE CASCADE
);
`;
const db = new sqlite3.Database(LOCAL_DB_FULL_PATH, err => {
    if (err) {
        console.error(err.message);
    } else {
        console.info('Connected to the database.');
        db.run(NOTES_TABLE_SQL);
        db.run(NOTES_VIRTUAL_TABLE_SQL);
        console.log(1);
        db.run(TAGS_TABLE_SQL);
        console.log(2);
        db.run(CATEGORIES_TABLE_SQL);
        console.log(3);
        db.run(NOTES_TAGS_HAVE_TABLE_SQL);
        console.info('createTables');
    }
});
/*
* sqlite3.OPEN_READONLY: open the database for read-only.
* sqlite3.OPEN_READWRITE : open the database for reading and writting.
* sqlite3.OPEN_CREATE: open the database, if the database does not exist, create a new database.
* */
/*
class SqliteService {
    static db;

    static init = (accomplish: () => {}, error: () => {}) => {
        SqliteService.db = new sqlite3.Database(LOCAL_DB_FULL_PATH, err => {
            if (err) {
                console.error(err.message);
                error && error(err);
            } else {
                console.info('Connected to the database.');
                SqliteService.db.run(NOTES_TABLE_SQL);
                SqliteService.db.run(TAGS_TABLE_SQL);
                SqliteService.db.run(CATEGORIES_TABLE_SQL);
                SqliteService.db.run(NOTES_TAGS_HAVE_TABLE_SQL);
                console.info('createTables');
                accomplish && accomplish();
            }
        });
    };

    static insertRows = () => {
        console.log('insertRows Ipsum i');
        const stmt = SqliteService.db.prepare('INSERT INTO lorem VALUES (?)');

        for (let i = 0; i < 10; i++) {
            stmt.run(`Ipsum ${i}`);
        }

        stmt.finalize(SqliteService.readAllRows);
    };

    static readAllRows = () => {
        console.log('readAllRows lorem');
        SqliteService.db.all('SELECT rowid AS id, info FROM lorem', (err, rows) => {
            rows.forEach(row => {
                console.log(`${row.id}: ${row.info}`);
            });
        });
    };

    static closeDb = () => {
        console.log('closeDb');
        SqliteService.db.close();
    };
}

export default SqliteService;
*/
