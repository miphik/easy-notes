// @flow
import {Icon} from 'antd';
import CategoryTree from 'components/CategoryTree';
import CButton from 'components/CButton';
import NoteEditor from 'components/NoteEditor';
import NoteList from 'components/NoteList';
import memoizeOne from 'memoize-one';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {NavLink} from 'react-router-dom';
import SplitPane from 'react-split-pane';
import LocalStorageService from 'services/LocalStorageService';
import {WEBDAV_AUTH_PATH} from 'src/constants/routes';
import backgroundImage from 'src/images/background6.png';
import type {ThemeType} from 'stores/ThemeStore';
import './styles.styl';
import type {CategoryType, NoteType} from 'types/NoteType';

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

const STYLES = memoizeOne((theme: ThemeType, isCategorySelected: boolean, isNoteSelected: boolean) => (
    {
        container:       {
            border: '1px solid gray',
        },
        firstColumn:     {
            backgroundColor: theme.color.first,
            display:         'flex',
            flexDirection:   'column',
        },
        containerSecond: {
            position: 'absolute',
            top:      '50%',
            //background: `${theme.color.second} url(${backgroundImage}) left center no-repeat`,
        },
        secondAndThirdColumn:    {
            backgroundColor: theme.color.second,
            zIndex: isCategorySelected ? 1 : 0,
        },
        secondColumn:    {
            backgroundColor: theme.color.second,
            width: '100%',
            height: '100%',
        },
        thirdColumn:    {
            backgroundColor: theme.color.second,
            zIndex: isNoteSelected ? 1 : 0,
            width: '100%',
            height: '100%',
        },
        backgroundImage: {
            position:  'relative',
            content:   ' ',
            //top:      '-50%',
            //left:     0,
            width:     '100%',
            marginTop: '-20%',
            // height:   '100%',
            zIndex:    0,
            filter:    theme.isBlack ? 'invert(100%)' : '',
            opacity:   0.2,
        },
        resizerStyle:    {
            backgroundColor: theme.color.black,
            opacity:         0.4,
        },
    }
));

type PropsType = {
    theme: ThemeType,
    selectedCategory: CategoryType,
    selectedNote: NoteType,
};

@inject(stores => (
    {
        remoteStoreIsAuth: stores.remoteAuthStore.isAuth,
        selectedCategory:  stores.categoryStore.getSelectedCategory,
        selectedNote:      stores.noteStore.getSelectedNote,
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
        const {remoteStoreIsAuth, theme, selectedCategory, selectedNote} = this.props;
        const {columnsWidth} = this.state;
        const style = STYLES(theme, !!selectedCategory, !!selectedNote);
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
                    style={style.container}
                    minSize={columnsWidth.first.minSize}
                    maxSize={columnsWidth.first.maxSize}
                    step={columnsWidth.first.step}
                    size={columnsWidth.first.size}
                    onDragFinished={this.onResizeFirstColumn}
                    paneStyle={style.firstColumn}
                    resizerStyle={style.resizerStyle}
                >
                    <CategoryTree/>

                    <div>

                        <SplitPane
                            split="vertical"
                            //style={style.secondColumn}
                            minSize={columnsWidth.second.minSize}
                            maxSize={columnsWidth.second.maxSize}
                            step={columnsWidth.second.step}
                            size={columnsWidth.second.size}
                            onDragFinished={this.onResizeSecondColumn}
                            paneStyle={style.secondAndThirdColumn}
                            pane2Style={style.thirdColumn}
                            resizerStyle={style.resizerStyle}
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
                        <div style={style.containerSecond}>
                            <img style={style.backgroundImage} src={backgroundImage}/>
                        </div>
                    </div>
                </SplitPane> : null}
            </div>
        );
    }
}
