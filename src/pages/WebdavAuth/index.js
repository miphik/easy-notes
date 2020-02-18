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
import 'styles/index.styl';
import memoizeOne from 'memoize-one';
import yandex from 'images/pngwave.png';
import yandex2 from 'images/Yandex_Logo..png';
import type {ThemeType} from 'stores/ThemeStore';
import Color from 'color';
import theme from "components/CategoryTree/CategorySortebleTreeTheme";

const MESSAGES = {
    webdavAuthError: <Fm id="WebdavAuth.webdavAuthError" defaultMessage="Login failed"/>,
    webdavAuthSuccess: account => (
        <Fm
            id="WebdavAuth.webdavAuthError"
            defaultMessage="Login {account} successfully"
            values={{account}}
        />
    ),
};

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        wrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        container: {
            width: '90%',
            height: '90%',
            borderRadius: 8,
            display: 'flex',
            border: '1px solid gray',
            boxShadow: `0px 0px 10px 0px ${theme.color.selected}`,
        },
        leftSide: {
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: theme.color.third,
        },
        logo: {
            background: `url(${yandex})`,
            height: '50%',
            width: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPositionY: '100%',
        },
        logo2: {
            background: `url(${yandex2})`,
            height: '50%',
            width: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
        },
        rightSide: {
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column',
        },
        backButton: {
            height: '3em',
            margin: '1em',
            backgroundColor: theme.color.third,
            borderColor: theme.color.marker,
        },
        logInButton: {
            height: '3em',
            backgroundColor: theme.color.first,
            borderColor: theme.color.marker,
        },
        logOutButton: {
            height: '3em',
            margin: '1em',
            backgroundColor: theme.color.first,
            borderColor: theme.color.marker,
        },
        form: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: '1em',
        },
    }
));

@inject(stores => (
    {
        theme: stores.themeStore.getTheme,
        remoteStoreLogOut: stores.remoteAuthStore.setAuthFalse,
        remoteStoreLogIn: stores.remoteAuthStore.setAuthTrue,
        remoteStoreIsAuth: stores.remoteAuthStore.isAuth,
        remoteStoreIsLogin: stores.remoteAuthStore.isLogin,
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
                    type: 'error',
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
                    type: 'success',
                    duration: 7,
                },
            );
            history.replace(HOME_PATH);
        });
        return false;
    };

    onLogOut = () => {
        const {remoteStoreLogOut, history} = this.props;
        RemoteStoreService.logOut(() => remoteStoreLogOut());
        history.replace(HOME_PATH);
    };

    onBackHome = () => {
        const {history} = this.props;
        history.replace(HOME_PATH);
    };

    render() {
        const {remoteStoreIsLogin, theme} = this.props;
        const styles = STYLES(theme);
        return (
            <div style={styles.wrapper} className="login__form">
                <div style={styles.container}>
                    <div style={styles.leftSide}>
                        <div style={styles.logo}/>
                        <div style={styles.logo2}/>
                    </div>
                    <div style={styles.rightSide}>
                        <Button
                            style={styles.backButton}
                            className="WebdavAuthForm__submit"
                            type="primary"
                            onClick={this.onBackHome}
                        >
                            Back
                        </Button>
                        {remoteStoreIsLogin ? (

                            <Button
                                style={styles.logOutButton}
                                className="WebdavAuthForm__submit"
                                type="primary"
                                onClick={this.onLogOut}
                            >
                                Log out
                            </Button>
                        ) : <WebdavAuthForm formStyle={styles.form} buttonStyle={styles.logInButton} onSubmit={this.onFormSubmit}/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default WebdavAuth;
