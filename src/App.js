import React, {PureComponent} from 'react';
// import {Provider} from 'mobx-react';
import {hot} from 'react-hot-loader';
import {IntlProvider} from 'react-intl';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Layout from 'src/components/Layout';
// import {LocaleProvider} from 'antd';
// import enUS from 'antd/lib/locale-provider/en_US';
// import 'antd/lib/button/style/index.css';
// import 'app/styles/base.styl';
// import stores from './store';

@hot(module)
class App extends PureComponent {
    render() {
        return (
            // eslint-disable-next-line react/prop-types
            // <Provider {...stores}>
            // <LocaleProvider locale={enUS}>
            <IntlProvider key="en" locale="en">
                <Router>
                    <Route exact path="*" component={Layout}/>
                </Router>
            </IntlProvider>
            // </LocaleProvider>
            // </Provider>
        );
    }
}

export default App;
