import {Button} from 'antd';
import WebdavAuthForm from 'pages/WebdavAuth/WebdavAuthForm';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {withRouter} from 'react-router-dom';
import {HOME_PATH} from 'src/constants/routes';
import {formatMessageIntl} from 'utils/LocaleService';
import {showNotification} from 'utils/NotificationService';
import RemoteStorageService from 'utils/RemoteStorageService';
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

@withRouter
class WebdavAuth extends React.PureComponent {
    onFormSubmit = values => {
        RemoteStorageService.logIn(values.url, values.username, values.password, err => {
            showNotification(
                formatMessageIntl(MESSAGES.webdavAuthError),
                err.toString(),
                {
                    type:     'error',
                    duration: 10,
                },
            );
        }, () => {
            const {history} = this.props;
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

    onLogOut = () => RemoteStorageService.logOut(() => this.forceUpdate());

    render() {
        const wdIsAuth = RemoteStorageService.isAuth();
        return (
            <div>
                {wdIsAuth ? (
                    <Button className="WebdavAuthForm__submit" type="primary" onClick={this.onLogOut}>
                        Log out
                    </Button>
                ) : <WebdavAuthForm onSubmit={this.onFormSubmit}/>}
            </div>
        );
    }
}

export default WebdavAuth;
