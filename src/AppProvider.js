// @flow
import {Provider} from 'mobx-react';
import React, {PureComponent} from 'react';
import {hot} from 'react-hot-loader/root';
import App from 'src/App';
import stores from 'stores';

@hot
class AppProvider extends PureComponent {
    render() {
        return (
            <Provider {...stores}>
                <App/>
            </Provider>
        );
    }
}

export default AppProvider;
