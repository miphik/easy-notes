// @flow
import {action, observable} from 'mobx';
import {syncRemoteAndLocalCategories} from 'services/SyncService';
import type {CategoryType} from 'types/NoteType';

class CategoryStore {
    @observable categories = observable.array();

    @action
    setCategories = (categories: Array<CategoryType>) => this.categories = observable.array(categories);

    @action
    syncCategories = () => syncRemoteAndLocalCategories(this.setCategories);

    get breadcrumbsItems() {
        return this.categories.toJS();
    }
}

export default new CategoryStore();
