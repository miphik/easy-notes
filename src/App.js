import Spinner from 'components/Spinner';
import React, {PureComponent} from 'react';
// import {Provider} from 'mobx-react';
import {hot} from 'react-hot-loader/root';
import {IntlProvider} from 'react-intl';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Layout from 'src/components/Layout';
import RemoteStorageService from 'utils/RemoteStorageService';
import SerializationService from 'utils/SerializationService';
// import {LocaleProvider} from 'antd';

// import enUS from 'antd/lib/locale-provider/en_US';
// import 'antd/lib/button/style/index.css';
// import 'app/styles/base.styl';
// import stores from './store';

@hot
class App extends PureComponent {
    state = {
        remoteStorageInited: false,
        serializationInited: false,
    };

    componentDidMount() {
        const setStateRemoteStorage = () => this.setState({remoteStorageInited: true});
        const setStateSerialization = () => this.setState({serializationInited: true});
        RemoteStorageService.auth(setStateRemoteStorage, setStateRemoteStorage);
        SerializationService.init(setStateSerialization);
    }

    render() {
        const {remoteStorageInited, serializationInited} = this.state;
        return (
            <React.Fragment>
                <IntlProvider key="en" locale="en">
                    <Router>
                        {serializationInited ? <Route exact path="*" component={Layout}/> : null}
                    </Router>
                </IntlProvider>
                <Spinner size="big" show={!serializationInited && !remoteStorageInited} fullSize/>
            </React.Fragment>
        );
    }
}

export default App;
