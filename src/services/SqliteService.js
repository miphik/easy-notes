// @flow
import {LOCAL_DB_FULL_PATH} from 'src/constants/general';
import type {NoteType} from 'types/NoteType';

const sqlite3 = require('sqlite3').verbose();

const MESSAGES = {};

const NOTES_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS note
    (
        uuid      TEXT PRIMARY KEY,
        title     TEXT    NOT NULL,
        text      TEXT    NOT NULL,
        updatedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        isDeleted INTEGER NOT NULL DEFAULT false
    );
`;
const NOTES_VIRTUAL_TABLE_SQL = 'CREATE VIRTUAL TABLE IF NOT EXISTS note_search USING fts5(uuid,title,text);';
const TAGS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS tag
    (
        uuid      TEXT PRIMARY KEY,
        text      TEXT    NOT NULL,
        updatedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL
    );
`;
const CATEGORIES_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS category
    (
        category_uuid TEXT NOT NULL,
        note_uuid     TEXT NOT NULL,
        PRIMARY KEY (note_uuid, category_uuid),
        FOREIGN KEY (note_uuid) REFERENCES note (uuid) ON DELETE CASCADE
    );
`;
const NOTES_TAGS_HAVE_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS tag_has_note
    (
        tag_uuid  TEXT NOT NULL,
        note_uuid TEXT NOT NULL,
        PRIMARY KEY (tag_uuid, note_uuid),
        FOREIGN KEY (tag_uuid) REFERENCES tag (uuid) ON DELETE CASCADE,
        FOREIGN KEY (note_uuid) REFERENCES note (uuid) ON DELETE CASCADE
    );
`;

/*
* sqlite3.OPEN_READONLY: open the database for read-only.
* sqlite3.OPEN_READWRITE : open the database for reading and writting.
* sqlite3.OPEN_CREATE: open the database, if the database does not exist, create a new database.
* */
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
                SqliteService.db.run(NOTES_VIRTUAL_TABLE_SQL);
                SqliteService.db.run(TAGS_TABLE_SQL);
                SqliteService.db.run(CATEGORIES_TABLE_SQL);
                SqliteService.db.run(NOTES_TAGS_HAVE_TABLE_SQL);
                console.info('createTables');
                accomplish && accomplish();
            }
        });
    };

    static upsertNote = (note: NoteType) => {
        SqliteService.db.run(`INSERT INTO note
                              VALUES (?, ?, ?, ?, ?, ?)
                              ON CONFLICT(uuid) DO UPDATE SET uuid=excluded.uuid,
                                                              title=excluded.title,
                                                              text=excluded.text,
                                                              updatedAt=excluded.updatedAt,
                                                              createdAt=excluded.createdAt,
                                                              isDeleted=excluded.isDeleted;`,
        note.uuid, note.title, note.text, note.updatedAt, note.createdAt, note.isDeleted ? 1 : 0);
        SqliteService.db.run('DELETE FROM note_search WHERE uuid=?', note.uuid);
        SqliteService.db.run('INSERT INTO note_search VALUES (?, ?, ?)', note.uuid, note.title, note.text);
    };

    static readAllRows = () => {
        console.log('readAllRows lorem');
        SqliteService.db.all(`SELECT uuid, title, text, highlight(note_search, 1, '<', '>') AS HighlightDesc
                              FROM note_search
                              WHERE text MATCH 'wor*' OR title MATCH 'wor*'
                              ORDER BY rank;`, (err, rows) => {
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
