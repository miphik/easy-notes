import * as electron from 'electron';
import * as path from 'path';

export const YANDEX_WEBDAV_URL = 'https://webdav.yandex.ru';
export const ROOT_CATEGORY_NAME = 'root';
export const NOTE_DATE_FORMAT = 'YYYY_MM_DD';
export const NOTE_YAER_DATE_FORMAT = 'YYYY';
export const NOTE_MONTH_DATE_FORMAT = 'MM';
export const NOTE_DAY_DATE_FORMAT = 'DD';
export const USER_DATA_PATH_TEMP = (electron.app || (electron.remote && electron.remote.app));
export const USER_DATA_PATH = USER_DATA_PATH_TEMP ? USER_DATA_PATH_TEMP.getPath('userData') : '';
export const LOCAL_PROJECT_PATH = 'easy-notes';
export const LOCAL_DB_PATH = 'easy-notes.db';
export const LOCAL_PROJECT_FULL_PATH = path.resolve(USER_DATA_PATH, LOCAL_PROJECT_PATH);
export const LOCAL_DB_FULL_PATH = path.resolve(USER_DATA_PATH, LOCAL_DB_PATH);
