import axios from 'axios';
// import createDebug from 'debug';
import store from 'store';

// const debug = createDebug('app:utils:api'); // eslint-disable-line no-unused-vars
export const PREVIOUS_PATH = 'PREVIOUS_PATH';

export const redirectToLogin = () => {
    const previousPath = window.location.pathname;
    if (previousPath !== '/') {
        store.set(PREVIOUS_PATH, previousPath);
    } else {
        store.remove(PREVIOUS_PATH);
    }
    window.location.href = __DEV__ ? '/login.html' : '/login';
};

const logResponse = (type, url, data, resp) => {
    console.info('----------------------');
    console.groupCollapsed(
        `%c ${type} SUCCESS             %c ${url}`,
        'background: #222; color: #2196F3',
        'background: #222; color: #80CBC4',
    );
    console.info('%c REQUEST DATA: ', 'background: #222; color: #26A69A', data);
    console.info('%c DATA: ', 'background: #222; color: #2196F3', resp.data);
    console.timeEnd(url);
    console.groupEnd();
    console.info('----------------------');
};

const logError = (type, url, data, error) => {
    if (error && error.response && error.response.status && error.response.status === 403) {
        redirectToLogin();
    }
    console.info('----------------------');
    console.groupCollapsed(
        `%c ${type} ERROR             %c ${url}`,
        'background: #222; color: #F44336',
        'background: #222; color: #80CBC4',
    );
    console.info('%c REQUEST DATA: ', 'background: #222; color: #26A69A', data);
    console.info(
        '%c ERROR: ',
        'background: #222; color: #F44336',
        (error && error.response && error.response.data) || error,
    );
    console.timeEnd(url);
    console.groupEnd();
    console.info('----------------------');
};

const createOptions = headers => {
    const newHeaders = {
        // [APPLICATION_TOKEN_HEADER_NAME]: API_TOKEN_CURRENT,
        ...headers,
    };
    /* const userToken = getToken();
    if (userToken) {
        newHeaders[getTokenHeaderName()] = userToken;
    }*/
    return {headers: newHeaders};
};

export default class ApiUtils {
    static get = (url, headers = {}) => {
        console.time(url);
        return new Promise((resolve, reject) => axios
            .get(/* BASE_URL + */url, createOptions(headers))
            .then(resp => {
                logResponse('GET', url, null, resp);
                resolve(resp);
            })
            .catch(err => {
                logError('GET', url, null, err);
                reject(err);
            }));
    };

    static post = (url, data, headers = {}) => {
        console.time(url);
        return new Promise((resolve, reject) => axios
            .post(/* BASE_URL + */url, data, createOptions(headers))
            .then(resp => {
                logResponse('POST', url, data, resp);
                resolve(resp);
            })
            .catch(err => {
                logError('POST', url, data, err);
                reject(err, true);
            }));
    };

    static downloadFile = (url, data, headers = {}, method = 'POST') => new Promise((resolve, reject) => {
        const options = createOptions({
            ...headers,
            [EXPECT_FILE_HEADER_NAME]: 'true',
        });
        const requestConfig = {
            ...options,
            url:          BASE_URL + url,
            method,
            data,
            responseType: 'blob',
        };
        return axios
            .request(requestConfig)
            .then(resp => {
                logResponse('DOWNLOAD', url, data, resp);
                resolve(resp);
            })
            .catch(err => {
                logError('DOWNLOAD', url, data, err);
                reject(err, true);
            });
    }).then(resp => {
        let tempUrl;
        try {
            tempUrl = window.URL.createObjectURL(new Blob([resp.data]));
            let fileName = 'file';
            const cd = resp.headers['content-disposition'];
            if (cd) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(cd);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                }
            }
            const link = document.createElement('a');
            link.href = tempUrl;
            link.setAttribute('download', fileName);
            link.click();
            return resp;
        } finally {
            if (tempUrl) window.URL.revokeObjectURL(tempUrl);
        }
    });
}
