// @flow
import LocalStorageService from 'services/LocalStorageService';
import SerializationService from 'services/SerializationService';
import type {NoteType} from 'src/types/NoteType';
import {createClient} from 'webdav';

const WEBDAV_CREDENTIALS = 'WEBDAV_CREDENTIALS';
const WEBDAV_PROJECT_PATH = '/easy-notes';
const WEBDAV_PROJECT_MAIN_FILE = `${WEBDAV_PROJECT_PATH}/index`;

let webdavClient;
let serializationService = SerializationService;

export const setSerializationService = serializeService => serializationService = serializeService;

export type RemoteStoreType = {
    saveNotesList: (data: Array<NoteType>, error: (err: Error) => void, success: () => void) => void,
    getNotesList: (error: (err: Error) => void, success: (notes: Array<NoteType>) => void) => void,
};

export default class RemoteStoreService {
    static isClientInitialized = (error = () => {}) => {
        if (!webdavClient) {
            error('WEBDAV client isn\'t initialized');
            return false;
        }
        return true;
    };

    static auth = (success, error) => {
        LocalStorageService.hasAsync(WEBDAV_CREDENTIALS, (hasError, hasKey) => {
            if (!hasError && hasKey) {
                LocalStorageService.getAsync(WEBDAV_CREDENTIALS, (getError, data) => {
                    if (!getError && data.url && data.user && data.pass) {
                        webdavClient = createClient(
                            data.url,
                            {
                                username: data.user,
                                password: data.pass,
                            },
                        );
                        RemoteStoreService.getDirectoryContent('/', error, () => {
                            RemoteStoreService.createMainDirectory(error, success);
                        });
                    } else if (error) error(getError);
                });
            } else if (error) error(hasError);
        });
    };

    static logOut = (callback = () => {}) => {
        webdavClient = null;
        LocalStorageService.removeAsync(WEBDAV_CREDENTIALS, {}, callback);
    };

    static isAuth = () => !!webdavClient;

    static logIn = (url, user, pass, error, success) => {
        LocalStorageService.setAsync(WEBDAV_CREDENTIALS, {url, user, pass}, setError => {
            if (!setError) {
                webdavClient = createClient(
                    url,
                    {
                        username: user,
                        password: pass,
                    },
                );
                RemoteStoreService.getDirectoryContent('/', error, () => {
                    RemoteStoreService.createMainDirectory(error, success);
                });
            } else if (error) error(setError);
        });
    };

    static getDirectoryContent = (directory = '/', error = () => {}, success = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        webdavClient
            .getDirectoryContents(directory)
            .then(success)
            .catch(err => {
                if (directory === '/') webdavClient = null;
                error(err);
            });
    };

    static createMainDirectory = (error = () => {}, success = () => {}) => {
        RemoteStoreService.getDirectoryContent(WEBDAV_PROJECT_PATH, () => {
            webdavClient.createDirectory(WEBDAV_PROJECT_PATH)
                .then(success)
                .catch(error);
        }, success);
    };

    static getNotesList = (error = () => {}, success = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        webdavClient.getFileContents(WEBDAV_PROJECT_MAIN_FILE)
            .then(data => {
                // @TODO Is it possible to have an error here?
                const notesList = serializationService.convertStringToNotesList(data);
                console.info('READ FROM REMOTE STORAGE', data, notesList);
                success(notesList);
            })
            .catch(error);
    };

    static saveNotesList = (data, error = () => {}, success = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        // @TODO Is it possible to have an error here?
        const notesAsString = serializationService.convertNotesListToString(data);
        webdavClient.putFileContents(WEBDAV_PROJECT_MAIN_FILE, notesAsString, {overwrite: true})
            .then(success)
            .catch(error);
    };

    static readNote = (noteUUID, error = () => {}, success = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
    };

    static writeNote = (note, error = () => {}, success = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
    };

    static deleteNote = (data, error = () => {}, success = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
    };
}
