// @flow
import memoizeOne from 'memoize-one';
import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {Route, Switch, withRouter} from 'react-router-dom';
import {setIntl} from 'services/LocaleService';
import {ABOUT_PATH, HOME_PATH, WEBDAV_AUTH_PATH} from 'src/constants/routes';
import About from 'src/pages/About';
import Home from 'src/pages/Home';
import WebdavAuth from 'src/pages/WebdavAuth';
import type {ThemeType} from 'stores/ThemeStore';

// import Header from './Header';
// import Menu from './Menu';

// const {Content, Sider} = Layout;
// const MESSAGES = {
//     versionTitle: <Fm id="AppLayout.render.version" defaultMessage="Admin UI #"/>,
// };

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        wrapper: {
            backgroundColor: theme.color.first,
            color:           theme.color.textMain,
            width:           '100%',
            height:          '100%',
            fontSize:        theme.mainFontSize,
        },
    }
));

type PropsType = {
    theme: ThemeType,
};

@withRouter
@injectIntl
@inject(stores => (
    {
        syncCategories:      stores.categoryStore.syncCategories,
        loadLocalCategories: stores.categoryStore.loadLocalCategories,
        syncNotes:           stores.noteStore.syncNotes,
        loadLocalNotes:      stores.noteStore.loadLocalNotes,
        remoteStoreIsAuth:   stores.remoteAuthStore.isAuth,
        remoteStoreIsInited: stores.remoteAuthStore.isInited,
        theme:               stores.themeStore.getTheme,
    }
))
// @onlyUpdateForKeys(['profileStore', 'error', 'location'])
@observer
class AppLayout extends Component<PropsType> {
    constructor(props) {
        super(props);
        setIntl(props.intl);
    }

    componentDidMount() {
        const {
            remoteStoreIsInited, remoteStoreIsAuth, loadLocalCategories, loadLocalNotes,
        } = this.props;
        if (remoteStoreIsInited && !remoteStoreIsAuth) {
            loadLocalCategories(loadLocalNotes);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            remoteStoreIsAuth, remoteStoreIsInited, syncCategories, syncNotes,
        } = nextProps;
        const {remoteStoreIsAuth: remoteStoreIsAuthPrev, remoteStoreIsInited: remoteStoreIsInitedPrev} = this.props;
        const isAuthAndItChanged = remoteStoreIsAuthPrev !== remoteStoreIsAuth && remoteStoreIsAuth;
        if (remoteStoreIsInited
            && (
                !remoteStoreIsInitedPrev || isAuthAndItChanged
            )) {
            syncCategories(syncNotes);
        }
    }

    render() {
        const {theme} = this.props;

        return (
            <div style={STYLES(theme).wrapper} className={theme.isBlack ? 'AppLayout_is_black' : 'AppLayout_is_white'}>
                <section className="msp-content-inner">
                    <Switch>
                        <Route exact path={HOME_PATH} component={Home}/>
                        <Route exact path={ABOUT_PATH} component={About}/>
                        <Route exact path={WEBDAV_AUTH_PATH} component={WebdavAuth}/>
                        <Route exact component={() => <div>NOT FOUND</div>}/>
                        {/* routes.map(route => <Route key={route.path} {...route} />)*/}
                    </Switch>
                </section>
            </div>
        );
    }
}

export default AppLayout;
