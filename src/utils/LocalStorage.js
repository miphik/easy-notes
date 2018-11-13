import storage from 'electron-json-storage';

export default class Storage {
    static set = (data, onlyLocalStorage = false) => {

    };

    static get = (data, onlyLocalStorage = false) => {

    };

    static has = async key => {
        const result = await new Promise((resolve, reject) => {
            storage.has(key, (error, hasKey) => {
                if (error) resolve(false);
                resolve(hasKey);
            });
        });
        return result;
    };
}
