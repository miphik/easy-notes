// @flow
import * as electron from 'electron';
import * as fs from 'fs';
import moment from 'moment';
import * as path from 'path';
import type {SerializationServiceType} from 'services/SerializationService';
import SerializationService from 'services/SerializationService';
import {
    NOTE_DATE_FORMAT,
    NOTE_DAY_DATE_FORMAT,
    NOTE_MONTH_DATE_FORMAT,
    NOTE_YAER_DATE_FORMAT
} from 'src/constants/general';
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
const NOTE_YEAR_PATH_PART = (note: NoteType) => moment(note.createdAt).format(NOTE_YAER_DATE_FORMAT);
const NOTE_MONTH_PATH_PART = (note: NoteType) => moment(note.createdAt).format(NOTE_MONTH_DATE_FORMAT);
const NOTE_DAY_PATH_PART = (note: NoteType) => moment(note.createdAt).format(NOTE_DAY_DATE_FORMAT);

const LOCAL_PROJECT_MAIN_FILE = `${LOCAL_PROJECT_FULL_PATH}/${INDEX_FILE_NAME}`;

const LOCAL_PROJECT_NOTE_FILE = (note: NoteType) => `${LOCAL_PROJECT_FULL_PATH}/${NOTE_YEAR_PATH_PART(note)}/`
    + `${NOTE_MONTH_PATH_PART(note)}/${NOTE_DAY_PATH_PART(note)}/${note.uuid}`;

const LOCAL_PROJECT_YEAR_NOTE_DIR = (note: NoteType) => `${LOCAL_PROJECT_FULL_PATH}/${NOTE_YEAR_PATH_PART(note)}`;
const LOCAL_PROJECT_MONTH_NOTE_DIR = (note: NoteType) => `${LOCAL_PROJECT_FULL_PATH}/${NOTE_YEAR_PATH_PART(note)}/`
    + `${NOTE_MONTH_PATH_PART(note)}`;
const LOCAL_PROJECT_DAY_NOTE_DIR = (note: NoteType) => `${LOCAL_PROJECT_FULL_PATH}/${NOTE_YEAR_PATH_PART(note)}/`
    + `${NOTE_MONTH_PATH_PART(note)}/${NOTE_DAY_PATH_PART(note)}`;

const LOCAL_PROJECT_CATEGORIES_MAIN_FILE = `${LOCAL_PROJECT_FULL_PATH}/${INDEX_CATEGORIES_FILE_NAME}`;

console.info('LOCAL_PROJECT_FULL_PATH', LOCAL_PROJECT_FULL_PATH);

let serializationService = SerializationService;

export const setSerializationService = (serializeService: SerializationServiceType) => {
    serializationService = serializeService;
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
                success(note);
            } else {
                const noteFull = serializationService.convertStringToNote(contents);
                console.info('READ NOTE FROM LOCAL STORAGE', noteFull);
                success(noteFull);
            }
        });
    };

    static createNotesDir = (notes: Array<NoteType>, error: () => {} = () => {}, success: () => {} = () => {}) => {
        notes.forEach((note: NoteType) => LocalStoreService.createNoteDir(note, error, success));
    };

    static createNoteDir = (note: NoteType, error: () => {} = () => {}, success: () => {} = () => {}) => {
        const noteYearDir = LOCAL_PROJECT_YEAR_NOTE_DIR(note);
        const noteMonthDir = LOCAL_PROJECT_MONTH_NOTE_DIR(note);
        const noteDayDir = LOCAL_PROJECT_DAY_NOTE_DIR(note);

        if (!fs.existsSync(noteYearDir)) {
            fs.mkdirSync(noteYearDir);
        }
        if (!fs.existsSync(noteMonthDir)) {
            fs.mkdirSync(noteMonthDir);
        }
        if (!fs.existsSync(noteDayDir)) {
            fs.mkdirSync(noteDayDir);
        }
    };

    static saveNote = (
        note: NoteType,
        error: () => {} = () => {},
        success: () => {} = () => {},
        createNoteDir: boolean = true,
    ) => {
        if (createNoteDir) LocalStoreService.createNoteDir(note);
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
        const categories = serializationService.convertCategoriesListToString(
            data.map((item: CategoryType, index: number) => ({...item, orderNumber: index})),
        );
        fs.writeFile(LOCAL_PROJECT_CATEGORIES_MAIN_FILE, categories, (errW: Error) => {
            if (errW) error(errW);
            else success();
        });
    };

    static deleteNote = (data, error: () => {} = () => {}, success: () => {} = () => {}) => {
    };
}
