// @flow
import {Button, Icon} from 'antd';
import CategoryTree from 'components/CategoryTree';
import {inject} from 'mobx-react';
/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {NavLink} from 'react-router-dom';
import SplitPane from 'react-split-pane';
import {WEBDAV_AUTH_PATH} from 'src/constants/routes';
import './styles.styl';

const MESSAGES = {
    addNewCategory: <Fm id="Home.render.button_add_new_category" defaultMessage="Add category"/>,
};

@inject(stores => (
    {
        remoteStoreIsAuth:    stores.remoteAuthStore.isAuth,
    }
))
export default class Home extends React.PureComponent {


    static propTypes = {
        remoteStoreIsAuth:    PropTypes.bool,
        createUpdateCategory: PropTypes.func,
        syncCategories:       PropTypes.func,
        removeCategory:       PropTypes.func,
        categories:           PropTypes.array,
    };

    static defaultProps = {
        remoteStoreIsAuth:    false,
        createUpdateCategory: () => {},
        syncCategories:       () => {},
        removeCategory:       () => {},
        categories:           [],
    };

    render() {
        const {remoteStoreIsAuth} = this.props;
        //const wbIsAuth = RemoteStoreService.isAuth();
        /*if (wbIsAuth) RemoteStoreService.getNotesList(() => {}, data => {
            const notes = SerializationService.convertStringToNotesList(data);
            console.log(2222, notes);
        });*/
        /*const text = SerializationService.convertNotesListToString([{title: '435435435 drgdfgварекпарое'}]);
        console.log(1111, text);
        RemoteStorageService.saveNotesList(text, data => console.log(222, data), data => console.log(333, data));*/
        return (
            <div>
                <SplitPane
                    split="vertical"
                    minSize={150}
                    maxSize={500}
                    step={50}
                    defaultSize={180}
                >
                    <CategoryTree/>

                    <SplitPane
                        split="vertical"
                        minSize={150}
                        maxSize={500}
                        step={50}
                        defaultSize={250}
                    >
                        <div>
                            <Button>
                                <NavLink to={WEBDAV_AUTH_PATH}>WEBDAV</NavLink>
                            </Button>
                            pane 2 size: 50% (of remaining space)
                        </div>
                        <div>
                            <div>
                                AUTH: {remoteStoreIsAuth ? <Icon type="check"/> : <Icon type="cross"/>}
                            </div>
                            pane 3
                        </div>
                    </SplitPane>
                </SplitPane>

            </div>
        );
    }
}
