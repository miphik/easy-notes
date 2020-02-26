// @flow
import Layout from 'components/Layout';
import Spinner from 'components/Spinner';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {hot} from 'react-hot-loader/root';
import {IntlProvider} from 'react-intl';
import {HashRouter as Router, Route} from 'react-router-dom';
import 'react-sortable-tree/style.css';
import {Slide, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SerializationService from 'services/SerializationService';
import 'utils/momentUtils';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import {Style} from 'radium';
import memoizeOne from 'memoize-one';
import {STYLES} from 'components/NoteEditor/styles';
import type {ThemeType} from 'stores/ThemeStore';
import SqliteService from "services/SqliteService";

require('v8-compile-cache');
// `remote.require` since `Menu` is a main-process module.
// import {LocaleProvider} from 'antd';

// import enUS from 'antd/lib/locale-provider/en_US';
// import 'antd/lib/button/style/index.css';
// import 'app/styles/base.styl';

const styles = memoizeOne((theme: ThemeType) => ({
    '.Toast__left_side-success': {
        backgroundColor: theme.color.marker,
    },
    '.Toast__left_side-error': {
        backgroundColor: theme.color.dangerButton,
    },
    '.Toast__left_side': {
        height:   '100%',
        width:    5,
        position: 'absolute',
        left:     0,
        top:      0,
    },
    '.Toast__content': {
        marginLeft: '1em',
    },
    '.Toastify__close-button': {
        display: 'none',
    },
    '.Toastify__toast': {
        background:   theme.color.first,
        boxShadow: `0 0 7px 2px ${theme.color.lightBlack}`,
        border: `1px solid ${theme.color.selected}`,
        borderRadius: 4,
    },
}));

@hot
@inject(mobxStores => (
    {
        theme:               mobxStores.themeStore.getTheme,
        remoteStoreAuth:     mobxStores.remoteAuthStore.remoteStoreAuth,
        remoteStoreIsAuth:   mobxStores.remoteAuthStore.isAuth,
        remoteStoreIsInited: mobxStores.remoteAuthStore.isInited,
    }
))
class App extends Component {
    state = {
        serializationInited: false,
    };

    componentDidMount() {
        const {remoteStoreAuth} = this.props;
        const setStateSerialization = () => this.setState({serializationInited: true});
        remoteStoreAuth();
        SerializationService.init(setStateSerialization);
        SqliteService.init();
    }

    render() {
        const {remoteStoreIsInited, serializationInited} = this.state;
        const {theme} = this.props;
        return (
            <>
                <IntlProvider key="en" locale="en">
                    <Router>
                        {serializationInited ? <Route exact path="*" component={Layout}/> : null}
                    </Router>
                </IntlProvider>
                <Spinner size="big" show={!remoteStoreIsInited && !serializationInited} fullSize/>
                <Style rules={styles(theme)}/>
                <ToastContainer
                    transition={Slide}
                    hideProgressBar
                    newestOnTop
                    toastClassName="dark-toast"
                    progressClassName={{
                        height: '1px',
                    }}
                />
            </>
        );
    }
}

App.propTypes = {
    remoteStoreAuth: PropTypes.func,
};
App.defaultProps = {
    remoteStoreAuth: () => {
    },
};

export default App;
