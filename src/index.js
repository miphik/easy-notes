// import 'animate.css';
// import {configure} from 'mobx';
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {AUTH_KEY} from 'src/constants/storage';
import 'src/styles/index.styl';
import Storage from 'src/utils/LocalStorage';
import App from './App';
import Login from './Login';

// configure({enforceActions: 'observed'});

if (__DEV__) {
    // import('mobx-logger').then(({enableLogging}) => enableLogging());
    // import('kuker-emitters').then(({ReactEmitter}) => ReactEmitter());
}

const rootEl = document.getElementById('app-mount');
const render = Elem => ReactDOM.render(<Elem/>, rootEl);
(async () => {
    const key = await Storage.has(AUTH_KEY);
    render(key ? App : Login);
})();
