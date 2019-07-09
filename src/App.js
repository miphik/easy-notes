// @flow
import Layout from 'components/Layout';
import Spinner from 'components/Spinner';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {hot} from 'react-hot-loader/root';
import {IntlProvider} from 'react-intl';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import 'react-sortable-tree/style.css';
import {Slide, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SerializationService from 'services/SerializationService';
import 'utils/momentUtils';
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
class App extends Component {
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
                <ToastContainer
                    transition={Slide}
                    newestOnTop
                    toastClassName="dark-toast"
                    progressClassName={{
                        height: '1px',
                    }}
                />
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
