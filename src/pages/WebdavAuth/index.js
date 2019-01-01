import React from 'react';
import './styles.styl';
import WebdavAuthForm from './WebdavAuthForm';

export default class WebdavAuth extends React.PureComponent {
    render() {
        return (
            <div><WebdavAuthForm typeValue={{}}/></div>
        );
    }
}
