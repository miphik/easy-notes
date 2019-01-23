import {action, observable} from 'mobx';

class BreadcrumbsService {
    @observable items = observable.array();

    @action
    updateBreadcrumb = items => this.items = observable.array(items);

    get breadcrumbsItems() {
        return this.items.toJS();
    }
}

export default new BreadcrumbsService();
