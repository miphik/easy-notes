// @flow
import LocalStorageService from 'services/LocalStorageService';
import type {SerializationServiceType} from 'services/SerializationService';
import SerializationService from 'services/SerializationService';
import type {CategoryType, NoteType} from 'src/types/NoteType';
import {createClient} from 'webdav';

const WEBDAV_CREDENTIALS = 'WEBDAV_CREDENTIALS';
const WEBDAV_PROJECT_PATH = '/easy-notes';
const WEBDAV_PROJECT_MAIN_FILE = `${WEBDAV_PROJECT_PATH}/notes.index`;
const WEBDAV_PROJECT_CATEGORIES_MAIN_FILE = `${WEBDAV_PROJECT_PATH}/categories.index`;

let webdavClient;
let serializationService = SerializationService;

export const setSerializationService = (serializeService: SerializationServiceType) => {
    serializationService = serializeService;
};

export type RemoteStoreType = {
    saveNotesList: (data: Array<NoteType>, error: (err: Error) => void, success: () => void) => void,
    saveCategoriesList: (data: Array<CategoryType>, error: (err: Error) => void, success: () => void) => void,
    getNotesList: (error: (err: Error) => void, success: (notes: Array<NoteType>) => void) => void,
    getCategoriesList: (error: (err: Error) => void, success: (notes: Array<CategoryType>) => void) => void,
};

export default class RemoteStoreService {
    static isClientInitialized = (error: () => {} = () => {}) => {
        if (!webdavClient) {
            error('WEBDAV client isn\'t initialized');
            return false;
        }
        return true;
    };

    static auth = (success: () => {}, error: () => {}) => {
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

    static logOut = (callback: () => {} = () => {}) => {
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

    static getDirectoryContent = (
        directory: string = '/',
        error: () => {} = () => {},
        success: () => {} = () => {},
    ) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        webdavClient
            .getDirectoryContents(directory)
            .then(success)
            .catch((err: Error) => {
                if (directory === '/') webdavClient = null;
                error(err);
            });
    };

    static createMainDirectory = (error: () => {} = () => {}, success: () => {} = () => {}) => {
        RemoteStoreService.getDirectoryContent(WEBDAV_PROJECT_PATH, () => {
            webdavClient.createDirectory(WEBDAV_PROJECT_PATH)
                .then(success)
                .catch(error);
        }, success);
    };

    static getNotesList = (error: () => {} = () => {}, success: () => {} = () => {}): Array<NoteType> => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        webdavClient.getFileContents(WEBDAV_PROJECT_MAIN_FILE)
            .then((data: string) => {
                // @TODO Is it possible to have an error here?
                let notesList = [];
                try {
                    notesList = serializationService.convertStringToNotesList(data);
                } catch (e) {
                    // @TODO Usually it means that we have different formats saved into a cloud and in the code
                    // better to give choice either override or give a user the chance to handle that situation
                    RemoteStoreService.saveNotesList([]);
                    return null;
                }
                console.info('READ NOTES FROM REMOTE STORAGE', data, notesList);
                return success(notesList);
            })
            .catch((err: Error) => {
                // Just if file hasn't found
                if (err.response && err.response.status && err.response.status === 404) success([]);
                else error(err);
            });
    };

    static getCategoriesList = (
        error: () => {} = () => {},
        success: (categories: Array<CategoryType>) => {} = () => {},
    ): Array<CategoryType> => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        webdavClient.getFileContents(WEBDAV_PROJECT_CATEGORIES_MAIN_FILE)
            .then((data: string) => {
                let categoriesList = [];
                try {
                    categoriesList = serializationService.convertStringToCategoriesList(data);
                } catch (ignore) {
                    // @TODO Usually it means that we have different formats saved into a cloud and in the code
                    // better to give choice either override or give a user the chance to handle that situation
                    RemoteStoreService.saveCategoriesList([]);
                    return null;
                }
                console.info('READ CATEGORIES FROM REMOTE STORAGE', data, categoriesList);
                return success(categoriesList);
            })
            .catch((err: Error) => {
                // Just if file hasn't found
                if (err.response && err.response.status && err.response.status === 404) success([]);
                else error(err);
            });
    };

    static saveNotesList = (data: Array<NoteType>, error: () => {} = () => {}, success: () => {} = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        const notesAsString = serializationService.convertNotesListToString(data);
        webdavClient.putFileContents(WEBDAV_PROJECT_MAIN_FILE, notesAsString, {overwrite: true})
            .then(success)
            .catch(error);
    };

    static saveCategoriesList = (
        data: Array<CategoryType>,
        error: () => {} = () => {},
        success: () => {} = () => {},
    ) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        const categoriesAsString = serializationService.convertCategoriesListToString(data);
        webdavClient.putFileContents(WEBDAV_PROJECT_CATEGORIES_MAIN_FILE, categoriesAsString, {overwrite: true})
            .then(success)
            .catch(error);
    };

    static readNote = (noteUUID: string, error = () => {}, success = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
    };

    static writeNote = (note: NoteType, error = () => {}, success = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
    };

    static deleteNote = (data, error = () => {}, success = () => {}) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
    };
}
