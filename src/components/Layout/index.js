// import {Icon, Layout} from 'antd';
// import logo from 'app/images/logo-3-white.png';
// import Routes from 'app/js/components/Layout/Routes';
// import {PREVIOUS_PATH, redirectToLogin} from 'app/js/utils/ApiUtils';
// import {setIntl} from 'app/js/utils/LocaleUtils';
// import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {
    NavLink, Route, Switch, withRouter,
} from 'react-router-dom';
import {setIntl} from 'services/LocaleService';
import {ABOUT_PATH, HOME_PATH, WEBDAV_AUTH_PATH} from 'src/constants/routes';
import About from 'src/pages/About';
// import {onlyUpdateForKeys} from 'recompose';
// import store from 'store';
// import {unsetToken} from '../../utils/TokenManger';
// import AppBreadcrumbs from '../AppBreadcrumbs';
import Home from 'src/pages/Home';
import WebdavAuth from 'src/pages/WebdavAuth';
import styles from './Layout.styl';

// import Header from './Header';
// import Menu from './Menu';

// const {Content, Sider} = Layout;
// const MESSAGES = {
//     versionTitle: <Fm id="AppLayout.render.version" defaultMessage="Admin UI #"/>,
// };

@withRouter
@injectIntl
// @inject(stores => ({
//     profileStore: stores.profileStore,
//     error:        stores.profileStore.error,
// }))
// @onlyUpdateForKeys(['profileStore', 'error', 'location'])
// @observer
class AppLayout extends Component {
    constructor(props) {
        super(props);
        setIntl(props.intl);
    }

    componentDidMount() {
        // const {profileStore} = this.props;
        // profileStore.fetchUserProfile({
        // Remove splash screen after load
        // successCallback: () => setTimeout(() => {
        // const splash = document.getElementsByClassName('splash')[0];
        // splash.classList.add('splash_hide');
        // setTimeout(() => (splash.style.display = 'none'), 500);
        // }, 500),
        // });
    }

    /* componentWillReceiveProps(nextProps) {
        setIntl(nextProps.intl);
        const {
            profileStore: {error},
        } = nextProps;
        if (error) {
            unsetToken();
            redirectToLogin();
        }
    }*/

    render() {
        // const {} = this.props;
        return (
            <div>
                <div>
                    <NavLink to="/">
                        <div className={styles.ul}>
                            LOGO
                        </div>
                    </NavLink>

                    <div className="msp-sider-menu-item-profile">
                        MENU
                        <NavLink to={ABOUT_PATH}>
                            ABOUT
                        </NavLink>
                    </div>
                </div>
                <div>
                    BREADCRUMPS
                </div>
                <section className="msp-content-inner">
                    <Switch>
                        <Route exact path={ABOUT_PATH} component={About}/>
                        <Route exact path={HOME_PATH} component={Home}/>
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
