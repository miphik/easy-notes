// @flow
import {action, observable} from 'mobx';
import moment from 'moment';
import type {LocalStoreType} from 'services/LocalStoreService';
import LocalStoreService from 'services/LocalStoreService';
import type {RemoteStoreType} from 'services/RemoteStoreService';
import RemoteStoreService from 'services/RemoteStoreService';
import {loadLocalCategories, syncRemoteAndLocalCategories} from 'services/SyncService';
import {ROOT_CATEGORY_NAME} from 'src/constants/general';
import type {CategoryType} from 'types/NoteType';
import uuidv4 from 'uuid/v4';

let remoteStorageService: RemoteStoreType = RemoteStoreService;
let localStorageService: LocalStoreType = LocalStoreService;

export const setRemoteStorageService = (remoteService: RemoteStoreType) => remoteStorageService = remoteService;
export const setLocalStorageService = (localService: LocalStoreType) => localStorageService = localService;

class CategoryStore {
    @observable categories = observable.array();

    @action
    setCategories = (categories: Array<CategoryType>) => {
        console.info('LOAD CATEGORIES', categories);
        this.categories = observable.array(categories);
    };

    @action
    syncCategories = () => syncRemoteAndLocalCategories(this.setCategories);

    @action
    loadLocalCategories = () => loadLocalCategories(this.setCategories);

    @action
    removeCategory = (categoryUUID: string, remoteStoreIsAuth: boolean) => {
        this.categories = this.categories.filter((item: CategoryType) => item.uuid !== categoryUUID);
        localStorageService.saveCategoriesList(this.categoryItems);
        if (remoteStoreIsAuth) {
            remoteStorageService.saveCategoriesList(this.categoryItems);
        }
    };

    @action
    createUpdateCategory = (category: CategoryType) => {
        const cat = {...category};
        const isNew = !cat.uuid;
        cat.updatedAt = moment().format();
        if (!cat.parentUuid) {
            cat.parentUuid = ROOT_CATEGORY_NAME;
        }
        if (isNew) {
            cat.createdAt = cat.updatedAt;
            cat.uuid = uuidv4();
            this.categories.push(cat);
        } else {
            this.categories = this.categories.map((item: CategoryType) => {
                if (item.uuid === cat.uuid) {
                    return cat;
                }
                return item;
            });
        }

        localStorageService.saveCategoriesList(this.categoryItems);
    };

    get categoryItems() {
        return this.categories.toJS();
    }
}

export default new CategoryStore();
