// @flow
import {action, observable} from 'mobx';
import RemoteStoreService from 'services/RemoteStoreService';

class RemoteAuthStore {
    @observable isAuth = false;

    @observable isInited = false;

    @action
    setAuthTrue = () => {
        this.isAuth = true;
        this.isInited = true;
    };

    @action
    setAuthFalse = () => {
        this.isAuth = false;
        this.isInited = true;
    };

    @action
    remoteStoreAuth = () => RemoteStoreService.auth(this.setAuthTrue, this.setAuthFalse);
}

export default new RemoteAuthStore();
