import Storage from 'src/utils/LocalStorage';
import {createClient} from 'webdav';

const WEBDAV_CREDENTIALS = 'WEBDAV_CREDENTIALS';

let webdavClient;
let isInitialized = false;

export default class RemoteStorageService {
    static auth = (success, error) => {
        Storage.hasAsync(WEBDAV_CREDENTIALS, (hasError, hasKey) => {
            if (!hasError && hasKey) {
                Storage.getAsync(WEBDAV_CREDENTIALS, (getError, data) => {
                    if (!getError && data.url && data.user && data.pass) {
                        isInitialized = true;
                        webdavClient = createClient(
                            data.url,
                            {
                                username: data.user,
                                password: data.pass,
                            },
                        );
                        if (success) success();
                    } else if (error) error(getError);
                });
            } else if (error) error(hasError);
        });
    };

    static isAuth = () => !!webdavClient && isInitialized;

    static logIn = (url, user, pass, error) => {
        isInitialized = true;
        Storage.setAsync(WEBDAV_CREDENTIALS, {url, user, pass}, setError => {
            if (!setError) {
                webdavClient = createClient(
                    url,
                    {
                        username: user,
                        password: pass,
                    },
                );
            } else if (error) error(setError);
        });
    };

    static syncNotesList = () => {
        if (!webdavClient && isInitialized) {
            // error
        } else if (!webdavClient) {

        }
    };
}
