// @flow
import {action, observable} from 'mobx';
import moment from 'moment';
import {getFlatDataFromTree, getTreeFromFlatData} from 'react-sortable-tree';
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

const getKey = (node: CategoryType) => node.uuid;
const getParentKey = (node: CategoryType) => node.parentUUID[0];

class CategoryStore {
    @observable categories = observable.array();

    @observable expandedNodes = observable.map();

    @action
    setCategories = (categories: Array<CategoryType>) => {
        const cats = categories
            .map((category: CategoryType) => {
                if (!category.parentUUID || !category.parentUUID.length) {
                    // eslint-disable-next-line
                    category.parentUUID = [ROOT_CATEGORY_NAME];
                }
                return category;
            });
        console.info('LOAD CATEGORIES', cats);
        this.categories = observable.array(cats);
    };

    @action
    syncCategories = () => syncRemoteAndLocalCategories(this.setCategories);

    @action
    changeExpandedNodes = (extended: boolean, nodeUUID: string) => this.expandedNodes.set(nodeUUID, extended);

    @action
    changeCategoryTree = (
        treeNodes: Array<CategoryType>,
        errorCallback: () => void,
        successCallback: () => void,
    ) => {
        const newCategories = getFlatDataFromTree({
            treeData:        treeNodes,
            getNodeKey:      getKey,
            ignoreCollapsed: false,
        }).map(item => {
            item.node.parentUUID = item.parentNode ? [item.parentNode.uuid] : [ROOT_CATEGORY_NAME];
            // debugger;
            return item.node;
        });

        this.setCategories(newCategories);
        localStorageService.saveCategoriesList(this.categoryAllItems, errorCallback, successCallback);
    };

    @action
    loadLocalCategories = () => loadLocalCategories(this.setCategories);

    @action
    removeCategory = (
        categoryUUID: string,
        errorCallback: () => void,
        successCallback: () => void,
    ) => {
        this.setCategories(this.categories.map((item: CategoryType) => {
            if (item.uuid === categoryUUID) {
                // eslint-disable-next-line no-param-reassign
                item.isDeleted = true;
                item.updatedAt = moment().format();
            }
            return item;
        }));
        localStorageService.saveCategoriesList(this.categoryAllItems, errorCallback, successCallback);
    };

    @action
    createUpdateCategory = (
        category: CategoryType,
        errorCallback: () => void,
        successCallback: () => void,
    ) => {
        const cat = {...category};
        const isNew = !cat.uuid;

        cat.updatedAt = moment().format();
        if (!cat.parentUUID) {
            cat.parentUUID = [];
        }
        if (cat.parent) {
            cat.parentUUID.push(cat.parent);
            this.changeExpandedNodes(true, cat.parent);
            delete cat.parent;
        }
        if (isNew) {
            cat.createdAt = cat.updatedAt;
            cat.uuid = uuidv4();
            this.categories.unshift(cat);
        } else {
            this.setCategories(this.categories
                .map((item: CategoryType) => (
                    item.uuid === cat.uuid ? cat : item
                )));
        }

        localStorageService.saveCategoriesList(this.categoryAllItems, errorCallback, successCallback);
    };

    get getExpandedNodes() {
        return this.expandedNodes.toJS();
    }

    get categoryAllItems() {
        return this.categories.toJS();
    }

    get categoryItems() {
        return this.categories.toJS().filter((category: CategoryType) => !category.isDeleted);
    }

    get categoryItemsAsTree() {
        const categories = this.categories.toJS()
            .filter((category: CategoryType) => !category.isDeleted)
            .map((category: CategoryType) => {
                const cat = {...category};
                // eslint-disable-next-line
                cat.expanded = !!this.expandedNodes.get(cat.uuid);
                // Next two attributes need for show categories as a tree when create or update category
                cat.key = cat.uuid;
                cat.value = cat.uuid;
                return cat;
            });
        return getTreeFromFlatData({
            flatData: categories,
            rootKey:  ROOT_CATEGORY_NAME,
            getKey,
            getParentKey,
        });
    }
}

export default new CategoryStore();
