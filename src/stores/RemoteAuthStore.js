// @flow
import {action, observable} from 'mobx';
import RemoteStoreService from 'services/RemoteStoreService';

class RemoteAuthStore {
    @observable isAuth = false;

    @observable error = null;

    @observable isInited = false;

    @observable isLogin = false;

    @action
    setAuthTrue = () => {
        this.isAuth = true;
        this.isInited = true;
        this.isLogin = true;
        this.error = null;
    };

    @action
    setAuthFalse = (error: string) => {
        this.isAuth = false;
        this.isInited = true;
        this.isLogin = false;
        this.error = error;
    };

    @action
    setAuthError = (error: string) => {
        this.isAuth = false;
        this.isInited = true;
        this.isLogin = true;
        this.error = error;
    };

    @action
    remoteStoreAuth = () => RemoteStoreService.auth(this.setAuthTrue, this.setAuthError, this.setAuthFalse);
}

export default new RemoteAuthStore();
