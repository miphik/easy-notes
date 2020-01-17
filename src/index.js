// import 'animate.css';
import {configure} from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';
import AppProvider from './AppProvider';

configure({enforceActions: 'observed'});

if (__DEV__) {
    import('mobx-logger').then(({enableLogging}) => enableLogging());
    // import('kuker-emitters').then(({ReactEmitter}) => ReactEmitter());
}

const rootEl = document.getElementById('app-mount');
const render = Elem => ReactDOM.render(<Elem/>, rootEl);
if (rootEl) render(AppProvider);
