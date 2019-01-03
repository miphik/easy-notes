import Storage from 'src/utils/LocalStorage';
import {createClient} from 'webdav';

const WEBDAV_CREDENTIALS = 'WEBDAV_CREDENTIALS';
const WEBDAV_PROJECT_PATH = '/easy-notes';
const WEBDAV_PROJECT_MAIN_FILE = `${WEBDAV_PROJECT_PATH}/index`;

let webdavClient;

export default class RemoteStorageService {
    static auth = (success, error) => {
        Storage.hasAsync(WEBDAV_CREDENTIALS, (hasError, hasKey) => {
            if (!hasError && hasKey) {
                Storage.getAsync(WEBDAV_CREDENTIALS, (getError, data) => {
                    if (!getError && data.url && data.user && data.pass) {
                        webdavClient = createClient(
                            data.url,
                            {
                                username: data.user,
                                password: data.pass,
                            },
                        );
                        RemoteStorageService.getDirectoryContent('/', error, () => {
                            RemoteStorageService.createMainDirectory(error, success);
                        });
                    } else if (error) error(getError);
                });
            } else if (error) error(hasError);
        });
    };

    static logOut = (callback = () => {}) => {
        webdavClient = null;
        Storage.removeAsync(WEBDAV_CREDENTIALS, {}, callback);
    };

    static isAuth = () => !!webdavClient;

    static logIn = (url, user, pass, error, success) => {
        Storage.setAsync(WEBDAV_CREDENTIALS, {url, user, pass}, setError => {
            if (!setError) {
                webdavClient = createClient(
                    url,
                    {
                        username: user,
                        password: pass,
                    },
                );
                RemoteStorageService.getDirectoryContent('/', error, () => {
                    RemoteStorageService.createMainDirectory(error, success);
                });
            } else if (error) error(setError);
        });
    };

    static getDirectoryContent = (directory = '/', error = () => {}, success = () => {}) => {
        if (!webdavClient) {
            error('WEBDAV client isn\'t initialized');
            return;
        }
        webdavClient
            .getDirectoryContents(directory)
            .then(success)
            .catch(err => {
                if (directory === '/') webdavClient = null;
                error(err);
            });
    };

    static createMainDirectory = (error = () => {}, success = () => {}) => {
        RemoteStorageService.getDirectoryContent(WEBDAV_PROJECT_PATH, () => {
            webdavClient.createDirectory(WEBDAV_PROJECT_PATH)
                .then(success)
                .catch(error);
        }, success);
    };

    static getNotesList = (error = () => {}, success = () => {}) => {
        if (!webdavClient) {
            error('WEBDAV client isn\'t initialized');
            return;
        }
        webdavClient.getFileContents(WEBDAV_PROJECT_MAIN_FILE)
            .then(success)
            .catch(error);
    };

    static saveNotesList = (data, error = () => {}, success = () => {}) => {
        if (!webdavClient) {
            error('WEBDAV client isn\'t initialized');
            return;
        }
        webdavClient.putFileContents(WEBDAV_PROJECT_MAIN_FILE, data, {overwrite: true})
            .then(success)
            .catch(error);
    };
}
