// @flow
import {Button, Icon} from 'antd';
import CategoryTree from 'components/CategoryTree';
import CButton from 'components/CButton';
import NoteEditor from 'components/NoteEditor';
import NoteList from 'components/NoteList';
import memoizeOne from 'memoize-one';
import {inject} from 'mobx-react';
/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {NavLink} from 'react-router-dom';
import SplitPane from 'react-split-pane';
import LocalStorageService from 'services/LocalStorageService';
import {WEBDAV_AUTH_PATH} from 'src/constants/routes';
import type {ThemeType} from 'stores/ThemeStore';
import './styles.styl';

const MESSAGES = {
    addNewCategory: <Fm id="Home.render.button_add_new_category" defaultMessage="Add category"/>,
};
const COLUMNS_WIDTH_KEY = 'COLUMNS_WIDTH_KEY';

type ColumnWidthType = {
    minSize: number,
    maxSize: number,
    step: number,
    size: number,
};

type ColumnsWidthType = {
    first: ColumnWidthType,
    second: ColumnWidthType,
};

const DEFAULT_COLUMNS_WIDTH: ColumnsWidthType = {
    first:  {
        minSize: 150,
        maxSize: 500,
        step:    15,
        size:    180,
    },
    second: {
        minSize: 150,
        maxSize: 500,
        step:    15,
        size:    250,
    },
};

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        firstColumn:  {
            backgroundColor: theme.color.first,
            display: 'flex',
            flexDirection: 'column',
        },
        secondColumn: {
            backgroundColor: theme.color.second,
        },
        resizerStyle: {
            backgroundColor: theme.color.black,
            opacity:         0.4,
        }
    }
));

type PropsType = {
    theme: ThemeType,
};

@inject(stores => (
    {
        remoteStoreIsAuth: stores.remoteAuthStore.isAuth,
        theme:             stores.themeStore.getTheme,
    }
))
export default class Home extends React.Component<PropsType> {
    state = {
        columnsWidth: null,
    };

    componentDidMount() {
        LocalStorageService.getAsync(COLUMNS_WIDTH_KEY, (error: Error, data: ColumnsWidthType) => {
            const newColumnsWidth: ColumnsWidthType = {};
            if (!error && data && Object.keys(data).length) {
                newColumnsWidth.first = data.first;
                newColumnsWidth.second = data.second;
            } else {
                newColumnsWidth.first = DEFAULT_COLUMNS_WIDTH.first;
                newColumnsWidth.second = DEFAULT_COLUMNS_WIDTH.second;
            }
            this.setState({columnsWidth: newColumnsWidth});
        });
    }

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

    onResizeFirstColumn = (newSize: number) => {
        const {columnsWidth} = this.state;
        columnsWidth.first.size = newSize;
        LocalStorageService.setAsync(COLUMNS_WIDTH_KEY, columnsWidth);
        this.setState({columnsWidth});
    };
    onResizeSecondColumn = (newSize: number) => {
        const {columnsWidth} = this.state;
        columnsWidth.second.size = newSize;
        LocalStorageService.setAsync(COLUMNS_WIDTH_KEY, columnsWidth);
        this.setState({columnsWidth});
    };

    render() {
        const {remoteStoreIsAuth, theme} = this.props;
        const {columnsWidth} = this.state;
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
                {columnsWidth ? <SplitPane
                    split="vertical"
                    minSize={columnsWidth.first.minSize}
                    maxSize={columnsWidth.first.maxSize}
                    step={columnsWidth.first.step}
                    size={columnsWidth.first.size}
                    onDragFinished={this.onResizeFirstColumn}
                    paneStyle={STYLES(theme).firstColumn}
                    resizerStyle={STYLES(theme).resizerStyle}
                >
                    <CategoryTree/>

                    <SplitPane
                        split="vertical"
                        minSize={columnsWidth.second.minSize}
                        maxSize={columnsWidth.second.maxSize}
                        step={columnsWidth.second.step}
                        size={columnsWidth.second.size}
                        onDragFinished={this.onResizeSecondColumn}
                        paneStyle={STYLES(theme).secondColumn}
                        resizerStyle={STYLES(theme).resizerStyle}
                    >
                        <div>
                            <NoteList/>
                        </div>
                        <div>
                            <div>
                                AUTH: {remoteStoreIsAuth ? <Icon type="check"/> : <Icon type="cross"/>}
                            </div>
                            <NavLink to={WEBDAV_AUTH_PATH}><CButton ghost icon="link"/></NavLink>
                            <NoteEditor/>
                        </div>
                    </SplitPane>
                </SplitPane> : null}
            </div>
        );
    }
}
