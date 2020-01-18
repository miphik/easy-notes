// @flow
import moment from 'moment';
import React from 'react';
import LocalStorageService from 'services/LocalStorageService';
import type {SerializationServiceType} from 'services/SerializationService';
// eslint-disable-next-line no-duplicate-imports
import SerializationService from 'services/SerializationService';
import {
    NOTE_DAY_DATE_FORMAT,
    NOTE_MONTH_DATE_FORMAT,
    NOTE_YAER_DATE_FORMAT,
} from 'src/constants/general';
import type {
    CategoryType, NoteType, CategoriesType, NotesType,
} from 'src/types/NoteType';
import {FormattedMessage as Fm} from 'react-intl';
import {createClient} from 'webdav';
import {categoryComparator} from 'utils/ComparatorsUtils';

const WEBDAV_CREDENTIALS = 'WEBDAV_CREDENTIALS';
const WEBDAV_PROJECT_PATH = '/easy-notes';
const WEBDAV_PROJECT_MAIN_FILE = `${WEBDAV_PROJECT_PATH}/notes.index`;
const WEBDAV_PROJECT_CATEGORIES_MAIN_FILE = `${WEBDAV_PROJECT_PATH}/categories.index`;
// const NOTE_DATE_PATH_PART = (note: NoteType) => moment(note.createdAt).format(NOTE_DATE_FORMAT);
const NOTE_YEAR_PATH_PART = (note: NoteType) => moment(note.createdAt).format(NOTE_YAER_DATE_FORMAT);
const NOTE_MONTH_PATH_PART = (note: NoteType) => moment(note.createdAt).format(NOTE_MONTH_DATE_FORMAT);
const NOTE_DAY_PATH_PART = (note: NoteType) => moment(note.createdAt).format(NOTE_DAY_DATE_FORMAT);
const WEBDAV_PROJECT_YEAR_NOTE_DIR = (note: NoteType) => `${WEBDAV_PROJECT_PATH}/${NOTE_YEAR_PATH_PART(note)}`;
const WEBDAV_PROJECT_MONTH_NOTE_DIR = (note: NoteType) => `${WEBDAV_PROJECT_PATH}/${NOTE_YEAR_PATH_PART(note)}/`
    + `${NOTE_MONTH_PATH_PART(note)}`;
const WEBDAV_PROJECT_DAY_NOTE_DIR = (note: NoteType) => `${WEBDAV_PROJECT_PATH}/${NOTE_YEAR_PATH_PART(note)}/`
    + `${NOTE_MONTH_PATH_PART(note)}/${NOTE_DAY_PATH_PART(note)}`;
const WEBDAV_PROJECT_NOTE_DIR = (note: NoteType) => `${WEBDAV_PROJECT_PATH}/${NOTE_YEAR_PATH_PART(note)}/`
    + `${NOTE_MONTH_PATH_PART(note)}/${NOTE_DAY_PATH_PART(note)}`;

const WEBDAV_PROJECT_NOTE_FILE = (note: NoteType) => `${WEBDAV_PROJECT_NOTE_DIR(note)}/${note.uuid}`;

const DIRS_FOR_CREATING = {
    years:  {},
    months: {},
    days:   {},
};

let webdavClient;
let serializationService = SerializationService;

export const setSerializationService = (serializeService: SerializationServiceType) => {
    serializationService = serializeService;
};

const createDirs = async (dirsForCreating, existingDirs) => {
    await Promise.all(Object.keys(dirsForCreating.years)
        .filter((dirDateYear: string) => !existingDirs[dirDateYear])
        .map(async (dirDateYear: string) => webdavClient.createDirectory(dirDateYear)));
    await Promise.all(Object.keys(dirsForCreating.months)
        .filter((dirDateYear: string) => !existingDirs[dirDateYear])
        .map(async (dirDateYear: string) => webdavClient.createDirectory(dirDateYear)));
    await Promise.all(Object.keys(dirsForCreating.days)
        .filter((dirDateYear: string) => !existingDirs[dirDateYear])
        .map(async (dirDateYear: string) => webdavClient.createDirectory(dirDateYear)));
};

const getErrorByStatusCode = (status: number) => {
    if (!status) return null;
    if (status === 401) return <Fm id="RemoteStoreService.getErrorByStatusCode" defaultMessage="Authorisation error"/>;
};

export default class RemoteStoreService {
    static isClientInitialized = () => !!webdavClient;

    static auth = (success: () => {}, loginError: () => {}, error: () => {}) => {
        const errorHandler = err => {
            const status = err && err.response && err.response.status;
            const responseText = err && err.response && err.response.responseText;
            return loginError(responseText || getErrorByStatusCode(status) || err.message);
        };
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
                        RemoteStoreService.getDirectoryContent('/', errorHandler, () => {
                            RemoteStoreService.createMainDirectory(errorHandler, success);
                        });
                    } else if (error) error(getError);
                });
            } else if (error) error(hasError);
        });
    };

    static logOut = (callback: () => {} = () => {
    }) => {
        webdavClient = null;
        LocalStorageService.removeAsync(WEBDAV_CREDENTIALS, {}, callback);
    };

    static logIn = (url, user, pass, error, success) => {
        const successHandler = () => {
            LocalStorageService.setAsync(WEBDAV_CREDENTIALS, {url, user, pass}, setError => {
                if (!setError) success();
                else if (error) error(setError);
            });
        };
        webdavClient = createClient(
            url,
            {
                username: user,
                password: pass,
            },
        );
        RemoteStoreService.getDirectoryContent('/', error, () => {
            RemoteStoreService.createMainDirectory(error, successHandler);
        });
    };

    static getDirectoryContent = (
        directory: string = '/',
        error: () => {} = () => {
        },
        success: () => {} = () => {
        },
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

    static createMainDirectory = (error: () => {} = () => {
    }, success: () => {} = () => {
    }) => {
        RemoteStoreService.getDirectoryContent(WEBDAV_PROJECT_PATH, () => {
            webdavClient.createDirectory(WEBDAV_PROJECT_PATH)
                .then(success)
                .catch(error);
        }, success);
    };

    static getNote = (note: NoteType, error: () => {} = () => {
    }, success: (note: NotesType) => {} = () => {
    }) => {
        if (!RemoteStoreService.isClientInitialized(error)) return;

        const notePath = WEBDAV_PROJECT_NOTE_FILE(note);
        webdavClient.getFileContents(notePath)
            .then((data: ArrayBuffer) => {
                if (data.byteLength < 5) {
                    return success([]);
                }
                let fullNote = note;
                try {
                    fullNote = serializationService.convertStringToNote(Buffer.from(data).toString());
                } catch (ignore) {
                    console.log('ERROR READ FROM REMOTE NOTE', ignore);
                    // @TODO Usually it means that we have different formats saved into a cloud and in the code
                    return success(note);
                }
                console.info('READ NOTE FROM REMOTE STORAGE', data, fullNote);
                return success(fullNote);
            })
            .catch((err: Error) => {
                // Just if file hasn't found
                if (err.response && err.response.status && err.response.status === 404) success(note);
                else error(err);
            });
    };

    static saveNoteContent = (note: NoteType, error: () => {} = () => {
    }, success: () => {} = () => {
    }) => {
        const noteAsString = serializationService.convertNoteToString(note);
        webdavClient.putFileContents(WEBDAV_PROJECT_NOTE_FILE(note), noteAsString, {overwrite: true})
            .then(success)
            .catch(error);
    };

    static createNotesDir = (notes: Array<NoteType>, error: () => {} = () => {
    }, success: () => {} = () => {
    }) => {
        const dirsForCreating = {...DIRS_FOR_CREATING};
        notes.forEach((note: NoteType) => {
            dirsForCreating.years[WEBDAV_PROJECT_YEAR_NOTE_DIR(note)] = note;
            dirsForCreating.months[WEBDAV_PROJECT_MONTH_NOTE_DIR(note)] = note;
            dirsForCreating.days[WEBDAV_PROJECT_DAY_NOTE_DIR(note)] = note;
        });
        webdavClient.getDirectoryContents(WEBDAV_PROJECT_PATH, {deep: true})
            .then(items => {
                const existingDirs = {};
                items.forEach(item => {
                    if (item.type === 'directory') existingDirs[item.basename] = true;
                });

                createDirs(dirsForCreating, existingDirs).then(success).catch(error);
            })
            .catch(error);
    };

    static createDay = (noteDayDir, success, error) => RemoteStoreService.getDirectoryContent(
        noteDayDir,
        () => webdavClient.createDirectory(noteDayDir)
            .then(success)
            .catch(error),
        success,
    );

    static createMonth = (noteMonthDir, noteDayDir, success, error) => RemoteStoreService.getDirectoryContent(
        noteMonthDir,
        () => webdavClient.createDirectory(noteMonthDir)
            .then(() => RemoteStoreService.createDay(noteDayDir, success, error))
            .catch(error),
        () => RemoteStoreService.createDay(noteDayDir, success, error),
    );

    static createYear = (
        noteYearDir, noteMonthDir, noteDayDir, success, error,
    ) => RemoteStoreService.getDirectoryContent(
        noteYearDir,
        () => webdavClient.createDirectory(noteYearDir)
            .then(() => RemoteStoreService.createMonth(noteMonthDir, noteDayDir, success, error))
            .catch(error), () => RemoteStoreService.createMonth(noteMonthDir, noteDayDir, success, error),
    );

    static createNoteDir = (note: NoteType, error: () => {} = () => {
    }, success: () => {} = () => {
    }) => {
        const noteYearDir = WEBDAV_PROJECT_YEAR_NOTE_DIR(note);
        const noteMonthDir = WEBDAV_PROJECT_MONTH_NOTE_DIR(note);
        const noteDayDir = WEBDAV_PROJECT_DAY_NOTE_DIR(note);
        const noteDir = WEBDAV_PROJECT_NOTE_DIR(note);

        RemoteStoreService.getDirectoryContent(noteDir, () => RemoteStoreService
            .createYear(noteYearDir, noteMonthDir, noteDayDir, success, error), success);
    };

    static saveNote = (
        note: NoteType,
        error: () => {} = () => {
        },
        success: () => {} = () => {
        },
        createNoteDir: boolean = true,
    ) => {
        console.info('remoteStoreService.saveNote', note);
        if (!RemoteStoreService.isClientInitialized(error)) return;
        if (createNoteDir) {
            RemoteStoreService.createNoteDir(note, error, () => RemoteStoreService
                .saveNoteContent(note, error, success));
        } else {
            RemoteStoreService.saveNoteContent(note, error, success);
        }
    };

    static getNotesList = (
        error: () => {} = () => {
        },
        success: (notes: NotesType) => {} = () => {
        },
    ): Array<NoteType> => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        webdavClient.getFileContents(WEBDAV_PROJECT_MAIN_FILE)
            .then((data: ArrayBuffer) => {
                if (data.byteLength < 5) {
                    return success([]);
                }
                let notesList = [];
                try {
                    notesList = serializationService.convertStringToNotesList(Buffer.from(data).toString());
                } catch (ignore) {
                    console.log('ERROR READ FROM REMOTE NOTES', ignore);
                    // @TODO Usually it means that we have different formats saved into a cloud and in the code
                    // better to give choice either override or give a user the chance to handle that situation
                    RemoteStoreService.saveNotesList([]);
                    return success([]);
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
        error: () => {} = () => {
        },
        success: (categories: CategoriesType) => {} = () => {
        },
    ): Array<CategoryType> => {
        if (!RemoteStoreService.isClientInitialized(error)) return;
        webdavClient.getFileContents(WEBDAV_PROJECT_CATEGORIES_MAIN_FILE)
            .then((data: ArrayBuffer) => {
                if (data.byteLength < 5) {
                    return success([]);
                }
                let categoriesList = [];
                try {
                    categoriesList = serializationService.convertStringToCategoriesList(Buffer.from(data).toString());
                } catch (ignore) {
                    console.log('ERROR READ FROM REMOTE CATEGORY', ignore);
                    // @TODO Usually it means that we have different formats saved into a cloud and in the code
                    // better to give choice either override or give a user the chance to handle that situation
                    RemoteStoreService.saveCategoriesList([]);
                    return success([]);
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

    static saveNotesList = (data: Array<NoteType>, error: () => {} = () => {
    }, success: () => {} = () => {
    }) => {
        console.info('remoteStoreService.saveNotesList', data);
        if (!RemoteStoreService.isClientInitialized(error)) return;
        const notesAsString = serializationService.convertNotesListToString(data);
        webdavClient.putFileContents(WEBDAV_PROJECT_MAIN_FILE, notesAsString, {overwrite: true})
            .then(success)
            .catch(error);
    };

    static saveCategoriesList = (
        data: Array<CategoryType>,
        error: () => {} = () => {
        },
        success: () => {} = () => {
        },
    ) => {
        data.sort(categoryComparator);
        console.info('remoteStoreService.saveCategoriesList', data);
        if (!RemoteStoreService.isClientInitialized(error)) return;
        const categoriesAsString = serializationService.convertCategoriesListToString(
            data.map((item: CategoryType, index: number) => (
                {...item, orderNumber: index}
            )),
        );
        webdavClient.putFileContents(WEBDAV_PROJECT_CATEGORIES_MAIN_FILE, categoriesAsString, {overwrite: true})
            .then(success)
            .catch(error);
    };

    static deleteNote = (data, error = () => {
    }, success = () => {
    }) => {
        if (!RemoteStoreService.isClientInitialized(error)) {

        }
    };
}
