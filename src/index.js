// import 'animate.css';
import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';
import 'src/styles/index.styl';
import App from './App';
// configure({enforceActions: 'observed'});

if (__DEV__) {
    // import('mobx-logger').then(({enableLogging}) => enableLogging());
    // import('kuker-emitters').then(({ReactEmitter}) => ReactEmitter());
}

const rootEl = document.getElementById('app-mount');
const render = Elem => ReactDOM.render(<Elem/>, rootEl);
render(App);
