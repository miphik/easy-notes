import {Button} from 'antd';
import {inject} from 'mobx-react';
import WebdavAuthForm from 'pages/WebdavAuth/WebdavAuthForm';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {withRouter} from 'react-router-dom';
import {formatMessageIntl} from 'services/LocaleService';
import {showNotification} from 'services/NotificationService';
import RemoteStoreService from 'services/RemoteStoreService';
import {HOME_PATH} from 'src/constants/routes';
import './styles.styl';

const MESSAGES = {
    webdavAuthError:   <Fm id="WebdavAuth.webdavAuthError" defaultMessage="Login failed"/>,
    webdavAuthSuccess: account => (
        <Fm
            id="WebdavAuth.webdavAuthError"
            defaultMessage="Login {account} successfully"
            values={{account}}
        />
    ),
};

@inject(stores => (
    {
        remoteStoreLogOut: stores.remoteAuthStore.setAuthFalse,
        remoteStoreLogIn:  stores.remoteAuthStore.setAuthTrue,
        remoteStoreIsAuth: stores.remoteAuthStore.isAuth,
    }
))
@withRouter
class WebdavAuth extends React.PureComponent {
    onFormSubmit = values => {
        RemoteStoreService.logIn(values.url, values.username, values.password, err => {
            showNotification(
                formatMessageIntl(MESSAGES.webdavAuthError),
                err.toString(),
                {
                    type:     'error',
                    duration: 10,
                },
            );
        }, () => {
            const {history, remoteStoreLogIn} = this.props;
            remoteStoreLogIn();
            showNotification(
                formatMessageIntl(MESSAGES.webdavAuthSuccess(values.username)),
                '',
                {
                    type:     'success',
                    duration: 7,
                },
            );
            history.replace(HOME_PATH);
        });
        return false;
    };

    onLogOut = () => {
        const {remoteStoreLogOut} = this.props;
        RemoteStoreService.logOut(() => remoteStoreLogOut());
    };

    render() {
        const {remoteStoreIsAuth} = this.props;
        return (
            <div>
                {remoteStoreIsAuth ? (
                    <Button className="WebdavAuthForm__submit" type="primary" onClick={this.onLogOut}>
                        Log out
                    </Button>
                ) : <WebdavAuthForm onSubmit={this.onFormSubmit}/>}
            </div>
        );
    }
}

export default WebdavAuth;
