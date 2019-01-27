// @flow
import Layout from 'components/Layout';
import Spinner from 'components/Spinner';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {hot} from 'react-hot-loader/root';
import {IntlProvider} from 'react-intl';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import SerializationService from 'services/SerializationService';
import type {StoresType} from 'stores';
// import {LocaleProvider} from 'antd';

// import enUS from 'antd/lib/locale-provider/en_US';
// import 'antd/lib/button/style/index.css';
// import 'app/styles/base.styl';

@hot
@inject(mobxStores => (
    {
        remoteStoreAuth:     mobxStores.remoteAuthStore.remoteStoreAuth,
        remoteStoreIsAuth:   mobxStores.remoteAuthStore.isAuth,
        remoteStoreIsInited: mobxStores.remoteAuthStore.isInited,
    }
))
class App extends PureComponent {
    state = {
        serializationInited: false,
    };

    componentDidMount() {
        const {remoteStoreAuth} = this.props;
        const setStateSerialization = () => this.setState({serializationInited: true});
        remoteStoreAuth();
        SerializationService.init(setStateSerialization);
    }

    render() {
        const {remoteStoreIsInited, serializationInited} = this.state;
        return (
            <React.Fragment>
                <IntlProvider key="en" locale="en">
                    <Router>
                        {serializationInited ? <Route exact path="*" component={Layout}/> : null}
                    </Router>
                </IntlProvider>
                <Spinner size="big" show={!serializationInited && !remoteStoreIsInited} fullSize/>
            </React.Fragment>
        );
    }
}

App.propTypes = {
    remoteStoreAuth: PropTypes.func,
};
App.defaultProps = {
    remoteStoreAuth: () => {},
};

export default App;
