import Spinner from 'components/Spinner';
import React, {PureComponent} from 'react';
import {Provider} from 'mobx-react';
import {hot} from 'react-hot-loader/root';
import {IntlProvider} from 'react-intl';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Layout from 'components/Layout';
import RemoteStoreService from 'services/RemoteStoreService';
import SerializationService from 'services/SerializationService';
import stores from 'stores';
// import {LocaleProvider} from 'antd';

// import enUS from 'antd/lib/locale-provider/en_US';
// import 'antd/lib/button/style/index.css';
// import 'app/styles/base.styl';

@hot
class App extends PureComponent {
    state = {
        remoteStorageInited: false,
        serializationInited: false,
    };

    componentDidMount() {
        const setStateRemoteStorage = () => this.setState({remoteStorageInited: true});
        const setStateSerialization = () => this.setState({serializationInited: true});
        RemoteStoreService.auth(setStateRemoteStorage, setStateRemoteStorage);
        SerializationService.init(setStateSerialization);
    }

    render() {
        const {remoteStorageInited, serializationInited} = this.state;
        return (
            <Provider {...stores}>
                <React.Fragment>
                    <IntlProvider key="en" locale="en">
                        <Router>
                            {serializationInited ? <Route exact path="*" component={Layout}/> : null}
                        </Router>
                    </IntlProvider>
                    <Spinner size="big" show={!serializationInited && !remoteStorageInited} fullSize/>
                </React.Fragment>
            </Provider>
        );
    }
}

export default App;
