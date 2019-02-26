// @flow
import * as electron from 'electron';
import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';
import type {SerializationServiceType} from 'services/SerializationService';
import SerializationService from 'services/SerializationService';
import {NOTE_DATE_FORMAT} from 'src/constants/general';
import type {
    CategoriesType, CategoryType, NotesType, NoteType,
} from 'types/NoteType';

const LOCAL_PROJECT_PATH = 'easy-notes';
const INDEX_FILE_NAME = 'notes.index';
const INDEX_CATEGORIES_FILE_NAME = 'categories.index';

const USER_DATA_PATH_TEMP = (
    electron.app
    || (
        electron.remote && electron.remote.app
    )
);
const USER_DATA_PATH = USER_DATA_PATH_TEMP ? USER_DATA_PATH_TEMP.getPath('userData') : '';
const LOCAL_PROJECT_FULL_PATH = path.resolve(USER_DATA_PATH, LOCAL_PROJECT_PATH);
if (!fs.existsSync(LOCAL_PROJECT_FULL_PATH)) {
    fs.mkdirSync(LOCAL_PROJECT_FULL_PATH);
}
const LOCAL_PROJECT_MAIN_FILE = `${LOCAL_PROJECT_FULL_PATH}/${INDEX_FILE_NAME}`;
const LOCAL_PROJECT_NOTE_DIR = (note: NoteType) => `${LOCAL_PROJECT_FULL_PATH}/${moment(note.createdAt)
    .format(NOTE_DATE_FORMAT)}`;
const LOCAL_PROJECT_NOTE_FILE = (note: NoteType) => `${LOCAL_PROJECT_FULL_PATH}/${moment(note.createdAt)
    .format(NOTE_DATE_FORMAT)}/${note.uuid}`;
const LOCAL_PROJECT_CATEGORIES_MAIN_FILE = `${LOCAL_PROJECT_FULL_PATH}/${INDEX_CATEGORIES_FILE_NAME}`;

console.info('LOCAL_PROJECT_FULL_PATH', LOCAL_PROJECT_FULL_PATH);

let serializationService = SerializationService;

export const setSerializationService = (serializeService: SerializationServiceType) => {
    serializationService = serializeService;
};

export type LocalStoreType = {
    saveNotesList: (data: Array<NoteType>, error: (err: Error) => void, success: () => void) => void,
    saveCategoriesList: (data: Array<CategoryType>, error: (err: Error) => void, success: () => void) => void,
    getNotesList: (error: (err: Error) => void, success: (notes: NotesType) => void) => Array<NoteType>,
    getNote: (note: NoteType, error: (err: Error) => void, success: (note: NoteType) => void) => NoteType,
    saveNote: (note: NoteType, error: (err: Error) => void, success: () => void) => void,
    getCategoriesList: (
        error: (err: Error) => void,
        success: (categories: CategoriesType) => void
    ) => Array<CategoryType>,
};

export default class LocalStoreService {
    static getDirectoryContent = (directory = '/', error: () => {} = () => {}, success: () => {} = () => {}) => {
    };

    static createMainDirectory = (error: () => {} = () => {}, success: () => {} = () => {}) => {
    };

    static getNote = (note: NoteType, error: () => {} = () => {}, success: (note: NotesType) => {} = () => {}) => {
        const notePath = LOCAL_PROJECT_NOTE_FILE(note);
        fs.readFile(notePath, 'utf8', (err: Error, contents: string) => {
            if (err) {
                const noteAsString = serializationService.convertNoteToString(note);
                const noteDir = LOCAL_PROJECT_NOTE_DIR(note);
                if (!fs.existsSync(noteDir)) {
                    fs.mkdirSync(noteDir);
                }
                fs.writeFile(notePath, noteAsString, (errW: Error) => {
                    if (errW) error(errW);
                    else success(note);
                });
            } else {
                const noteFull = serializationService.convertStringToNote(contents);
                console.info('READ NOTE FROM LOCAL STORAGE', noteFull);
                success(noteFull);
            }
        });
    };

    static saveNote = (note: NoteType, error: () => {} = () => {}, success: () => {} = () => {}) => {
        const noteAsString = serializationService.convertNoteToString(note);
        fs.writeFile(LOCAL_PROJECT_NOTE_FILE(note), noteAsString, (errW: Error) => {
            if (errW) error(errW);
            else success();
        });
    };

    static getNotesList = (error: () => {} = () => {}, success: (notes: NotesType) => {} = () => {}) => {
        fs.readFile(LOCAL_PROJECT_MAIN_FILE, 'utf8', (err: Error, contents: string) => {
            if (err) {
                fs.writeFile(LOCAL_PROJECT_MAIN_FILE, '', (errW: Error) => {
                    if (errW) error(errW);
                    else success([]);
                });
            } else {
                const notesList = serializationService.convertStringToNotesList(contents);
                console.info('READ NOTES LIST FROM LOCAL STORAGE', notesList);
                success(notesList);
            }
        });
    };

    static saveNotesList = (data: Array<NoteType>, error: () => {} = () => {}, success: () => {} = () => {}) => {
        const notes = serializationService.convertNotesListToString(data);
        fs.writeFile(LOCAL_PROJECT_MAIN_FILE, notes, (errW: Error) => {
            if (errW) error(errW);
            else success();
        });
    };

    static getCategoriesList = (
        error: () => {} = () => {},
        success: (categories: CategoriesType) => {} = () => {},
    ): Array<CategoryType> => {
        fs.readFile(LOCAL_PROJECT_CATEGORIES_MAIN_FILE, 'utf8', (err: Error, contents: string) => {
            if (err) {
                fs.writeFile(LOCAL_PROJECT_CATEGORIES_MAIN_FILE, '', (errW: Error) => {
                    if (errW) error(err);
                    else success([]);
                });
            } else {
                const categoriesList = serializationService.convertStringToCategoriesList(contents);
                console.info('READ CATEGORIES LIST FROM LOCAL STORAGE', categoriesList);
                success(categoriesList);
            }
        });
    };

    static saveCategoriesList = (
        data: Array<CategoryType>,
        error: () => {} = () => {},
        success: () => {} = () => {},
    ) => {
        const categories = serializationService.convertCategoriesListToString(data);
        fs.writeFile(LOCAL_PROJECT_CATEGORIES_MAIN_FILE, categories, (errW: Error) => {
            if (errW) error(errW);
            else success();
        });
    };

    static readNote = (noteUUID, error: () => {} = () => {}, success: () => {} = () => {}) => {
    };

    static writeNote = (note, error: () => {} = () => {}, success: () => {} = () => {}) => {
    };

    static deleteNote = (data, error: () => {} = () => {}, success: () => {} = () => {}) => {
    };
}
