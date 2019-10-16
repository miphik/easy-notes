import debounce from 'lodash/debounce';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import * as React from 'react';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import ScrollableColumn from 'components/ScrollableColumn';
import isEqual from 'lodash/isEqual';
import styles from './styles.styl';
import moment from "moment";
import memoizeOne from "memoize-one";
import type {ThemeType} from "stores/ThemeStore";
import Editor, { composeDecorators } from "draft-js-plugins-editor";
import createStore from "components/Plug/utils/createStore";
import {defaultTheme} from "components/Plug/theme";
import Toolbar from "components/Plug/components/Toolbar";
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;
const sideToolbarPlugin = createSideToolbarPlugin();
const { SideToolbar } = sideToolbarPlugin;

const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const ccc = (config = {}) => {
    const store = createStore({
        isVisible: false,
    });

    const {theme = defaultTheme} = config;

    return {
        initialize: ({getEditorState, setEditorState, getEditorRef}) => {
            store.updateItem('getEditorState', getEditorState);
            store.updateItem('setEditorState', setEditorState);
            store.updateItem('getEditorRef', getEditorRef);
        },
        // Re-Render the text-toolbar on selection change
        onChange: editorState => {
            store.updateItem('selection', editorState.getSelection());
            return editorState;
        },
        InlineToolbar: props => <Toolbar {...props} store={store} theme={theme}/>,
    };
};

const inlineToolbarPlugin = ccc();
const {InlineToolbar} = inlineToolbarPlugin;
const plugins = [
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    inlineToolbarPlugin,
    sideToolbarPlugin
];

const toolbarClassName = 'NoteText__toolbar';
const STYLES = memoizeOne((theme: ThemeType) => (
    {
        toolbar: {
            color: theme.color.gray,
        },
    }
));

@inject(stores => (
    {
        theme: stores.themeStore.getTheme,
        noteText: stores.noteStore.getNoteText,
        selectedNote: stores.noteStore.getSelectedNote,
        selectedCategory: stores.categoryStore.getSelectedCategory,
        setSelectedNoteText: stores.noteStore.setSelectedNoteText,
    }
))
@observer
export default class NoteEditor extends React.Component {
    static propTypes = {
        name: PropTypes.string,
    };

    static defaultProps = {
        name: '',
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.selectedNote) return {currentNote: null, currentNoteText: null};
        if (!prevState.currentNote
            || !nextProps.selectedNote.text
            || nextProps.selectedNote.uuid !== prevState.currentNote.uuid) {

            const state = {currentNote: nextProps.selectedNote};
            if (nextProps.noteText && nextProps.noteText.entityMap) {
                state.currentNoteText = EditorState.createWithContent(convertFromRaw(nextProps.noteText))
            } else if (!prevState.currentNoteText || !nextProps.selectedNote.text) {
                state.currentNoteText = EditorState.createEmpty();
            }
            return state;
        }
        return null;
    }

    constructor(props) {
        super(props);
        const {noteText} = props;
        this.state = {
            currentNoteText: noteText && noteText.entityMap
                ? EditorState.createWithContent(convertFromRaw(noteText))
                : EditorState.createEmpty(),
            currentNote: props.selectedNote,
        };
    }

    debounceChangeNoteText = debounce(this.props.setSelectedNoteText, 1000);

    onChangeNote = data => {
        const {selectedNote, selectedCategory} = this.props;
        this.setState({
            currentNoteText: data,
            currentNote: selectedNote
        }, () => {
            if (!isEqual(this.props.selectedNote.text.blocks, convertToRaw(data.getCurrentContent()).blocks)) {
                this.debounceChangeNoteText(selectedNote, selectedCategory, convertToRaw(data.getCurrentContent()));
            }
        });
    };
    onChange = editorState => this.setState({editorState});

    render() {
        const {selectedNote, offset, theme} = this.props;
        const {currentNoteText} = this.state;
        if (currentNoteText === null || !selectedNote) return null;
        const style = STYLES(theme);

        return (
            <ScrollableColumn
                showScrollShadow
                autoHideScrollbar
                shadowColor={theme.color.second}
                scrollColor={theme.color.second}
                width="inherit"
                toolbar={
                    <div style={style.toolbar} className={`${styles.toolbar} ${toolbarClassName}`}>
                        {moment(selectedNote.updatedAt).format('DD MMMM YYYY, HH:mm')}
                    </div>
                }
                footer={<div className={styles.footer}/>}
            >
                <Editor
                    plugins={plugins}
                    editorState={currentNoteText}
                    onChange={this.onChangeNote}
                />
                <InlineToolbar offset={offset} scaleFactor={theme.scaleFactor} toolbarClassName={toolbarClassName}/>
                <SideToolbar />
            </ScrollableColumn>
        );
    }
}
