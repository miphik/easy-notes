// @flow
import debounce from 'lodash/debounce';
import {action, observable} from 'mobx';
import moment from 'moment';
import {getFlatDataFromTree, getTreeFromFlatData} from 'react-sortable-tree';
import LocalStorageService from 'services/LocalStorageService';
import LocalStoreService from 'services/LocalStoreService';
import RemoteStoreService from 'services/RemoteStoreService';
import {loadLocalCategories, syncRemoteAndLocalCategories} from 'services/SyncService';
import {ROOT_CATEGORY_NAME} from 'src/constants/general';
import noteStore from 'stores/NoteStore';
import type {CategoryType} from 'types/NoteType';
import type {StoreType} from 'types/StoreType';
import uuidv4 from 'uuid/v4';

let remoteStorageService: StoreType = RemoteStoreService;
let localStorageService: StoreType = LocalStoreService;
let localStorage = LocalStorageService;

export const setRemoteStorageService = (remoteService: StoreType) => remoteStorageService = remoteService;
export const setLocalStorageService = (localService: StoreType) => localStorageService = localService;
export const setLocalStorage = localStr => localStorage = localStr;

const EXPANDED_NODES = 'EXPANDED_NODES';

const getKey = (node: CategoryType) => node.uuid;
const getParentKey = (node: CategoryType) => node.parentUUID[0];
const categoryComparator = (a: CategoryType, b: CategoryType) => a.orderNumber - b.orderNumber;

class CategoryStore {
    constructor() {
        this.setExpandedNodes();
    }

    @observable categories = observable.array();

    @observable expandedNodes = observable.map();

    @observable categoriesAreSyncing = false;

    @observable syncError = null;

    @observable selectedCategory = null;

    @observable categoriesIsLoading = true;

    @action
    setExpandedNodesInner = (error: Error, data: Object) => this.expandedNodes = observable.map(data);

    @action
    setExpandedNodes = () => {
        localStorage.getAsync(
            EXPANDED_NODES,
            this.setExpandedNodesInner,
        );
    };

    @action
    setCategories = (categories: Array<CategoryType>) => {
        this.debounceChangeSyncingStatus(false);
        const cats = categories
            .map((category: CategoryType) => {
                if (!category.parentUUID || !category.parentUUID.length) {
                    // eslint-disable-next-line
                    category.parentUUID = [ROOT_CATEGORY_NAME];
                }
                return category;
            });
        cats.sort(categoryComparator);
        console.info('LOAD CATEGORIES', cats);
        this.categories = observable.array(cats);
        this.categoriesIsLoading = false;
    };

    @action
    syncCategories = (successCallback: () => void = () => {}) => {
        this.changeSyncingStatus(true);
        this.syncCategoriesError(null);
        syncRemoteAndLocalCategories(
            (categories: Array<CategoryType>) => {
                this.setCategories(categories);
                successCallback();
            },
            this.syncCategoriesError,
        );
    };

    syncCategoriesError = (errors: Array<Error>) => {
        this.debounceChangeSyncingStatus(false);
        this.categoriesIsLoading = false;
        this.syncError = errors;
    };

    changeSyncingStatus = (status: boolean) => {
        if (this.categoriesAreSyncing && !status) setTimeout(() => this.changeSyncingStatusInner(status), 500);
        else if (status !== this.categoriesAreSyncing) this.changeSyncingStatusInner(status);
    };

    @action
    changeSyncingStatusInner = (status: boolean) => this.categoriesAreSyncing = status;

    debounceChangeSyncingStatus = debounce(this.changeSyncingStatus, 100);

    @action
    setSelectedCategory = (category: CategoryType) => {
        if (!this.selectedCategory || !category || this.selectedCategory.uuid !== category.uuid) {
            noteStore.setSelectedNote(null);
        }
        this.selectedCategory = category;
    };

    @action
    changeExpandedNodes = (extended: boolean, nodeUUID: string) => {
        this.expandedNodes.set(nodeUUID, extended);
        const nodes = {};
        this.expandedNodes.toJS().forEach((status: boolean, catUUID: string) => nodes[catUUID] = status);
        localStorage.setAsync(EXPANDED_NODES, nodes);
    };

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
        }).map((item, index) => {
            item.node.parentUUID = item.parentNode ? [item.parentNode.uuid] : [ROOT_CATEGORY_NAME];
            item.node.orderNumber = index;
            if (this.selectedCategory && this.selectedCategory.uuid === item.node.uuid) {
                this.selectedCategory = item.node;
            }
            return item.node;
        });

        this.setCategories(newCategories);
        localStorageService.saveCategoriesList(this.categoryAllItems, errorCallback, successCallback);
    };

    @action
    loadLocalCategories = (successCallback: () => void = () => {}) => loadLocalCategories(
        (categories: Array<CategoryType>) => {
            this.setCategories(categories);
            successCallback();
        },
        this.loadLocalCategoriesError,
    );

    loadLocalCategoriesError = (errors: Array<Error>) => {

    };

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
            this.setSelectedCategory(cat);
        } else {
            this.setCategories(this.categories
                .map((item: CategoryType) => {
                    if (item.uuid === cat.uuid) {
                        this.setSelectedCategory(cat);
                        return cat;
                    }
                    return item;
                }));
        }

        localStorageService.saveCategoriesList(this.categoryAllItems, errorCallback, successCallback);
    };

    get getSyncErrors() {
        return this.syncError;
    }

    get areCategoriesSyncing() {
        return this.categoriesAreSyncing;
    }

    get getExpandedNodes() {
        return this.expandedNodes.toJS();
    }

    get categoryAllItems() {
        return this.categories.toJS();
    }

    get categoryAllItemUUIDS() {
        const catUUIDs = {};
        this.categories.toJS()
            .filter((cat: CategoryType) => !cat.isDeleted)
            .forEach((cat: CategoryType) => catUUIDs[cat.uuid] = true);
        return catUUIDs;
    }

    get categoryItems() {
        return this.categories.toJS().filter((category: CategoryType) => !category.isDeleted);
    }

    get getSelectedCategory() {
        return this.selectedCategory;
    }

    get getSelectedCategoryUUID() {
        return this.selectedCategory ? this.selectedCategory.uuid : null;
    }

    get getCategoriesIsLoading() {
        return this.categoriesIsLoading;
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
        // categories.unshift(EMPTY_CATEGORY);
        // categories.unshift(DELETED_CATEGORY);
        return getTreeFromFlatData({
            flatData: categories,
            rootKey:  ROOT_CATEGORY_NAME,
            getKey,
            getParentKey,
        });
    }
}

export default new CategoryStore();
