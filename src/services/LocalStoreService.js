// @flow
import * as electron from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import SerializationService from 'services/SerializationService';
import type {NoteType} from 'src/types/NoteType';

const LOCAL_PROJECT_PATH = '/easy-notes';
const INDEX_FILE_NAME = 'index';
const LOCAL_PROJECT_MAIN_FILE = `${LOCAL_PROJECT_PATH}/${INDEX_FILE_NAME}`;

const USER_DATA_PATH = (
    electron.app || electron.remote.app
).getPath('userData');
const LOCAL_PROJECT_FULL_PATH = path.resolve(USER_DATA_PATH, LOCAL_PROJECT_PATH);
if (!fs.existsSync(LOCAL_PROJECT_FULL_PATH)) {
    fs.mkdirSync(LOCAL_PROJECT_FULL_PATH);
}

let serializationService = SerializationService;

export const setSerializationService = serializeService => serializationService = serializeService;

export type LocalStoreType = {
    saveNotesList: (data: Array<NoteType>, error: (err: Error) => void, success: () => void) => void,
    getNotesList: (error: (err: Error) => void, success: (notes: Array<NoteType>) => void) => void,
};

export default class LocalStoreService {
    static getDirectoryContent = (directory = '/', error = () => {}, success = () => {}) => {
    };

    static createMainDirectory = (error = () => {}, success = () => {}) => {
    };

    static getNotesList = (error = () => {}, success = () => {}) => {
        fs.readFile(LOCAL_PROJECT_MAIN_FILE, 'utf8', (err, contents) => {
            if (err) {
                fs.writeFile(LOCAL_PROJECT_MAIN_FILE, '', errW => {
                    if (errW) error(err);
                });
            } else {
                const notesList = serializationService.convertStringToNotesList(contents);
                console.info('READ FROM LOCAL STORAGE', contents, notesList);
                success(notesList);
            }
        });
    };

    static saveNotesList = (data, error = () => {}, success = () => {}) => {
    };

    static readNote = (noteUUID, error = () => {}, success = () => {}) => {
    };

    static writeNote = (note, error = () => {}, success = () => {}) => {
    };

    static deleteNote = (data, error = () => {}, success = () => {}) => {
    };
}
