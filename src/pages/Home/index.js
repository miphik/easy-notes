import {Button, Icon} from 'antd';
import PropTypes from 'prop-types';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {NavLink} from 'react-router-dom';
import {WEBDAV_AUTH_PATH} from 'src/constants/routes';
import './styles.styl';
import RemoteStorageService from 'utils/RemoteStorageService';
import SerializationService from 'utils/SerializationService';

export default class Home extends React.PureComponent {
    static propTypes = {
        active: PropTypes.bool,
    };

    static defaultProps = {
        active: false,
    };

    render() {
        // const {} = this.props;
        const wbIsAuth = RemoteStorageService.isAuth();
        if (wbIsAuth) RemoteStorageService.getNotesList(() => {}, data => {
            const notes = SerializationService.convertStringToNotesList(data);
            console.log(2222, notes);
        });
        /*const text = SerializationService.convertNotesListToString([{title: '435435435 drgdfgварекпарое'}]);
        console.log(1111, text);
        RemoteStorageService.saveNotesList(text, data => console.log(222, data), data => console.log(333, data));*/
        return (
            <div>
                <div>HOME</div>
                <Button>

                    <NavLink to={WEBDAV_AUTH_PATH}>WEBDAV</NavLink>

                </Button>
                <div>
                    AUTH: {wbIsAuth ? <Icon type="check" /> : <Icon type="cross" />}
                </div>
            </div>
        );
    }
}
