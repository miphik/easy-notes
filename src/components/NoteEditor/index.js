// @flow

import debounce from 'lodash/debounce';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import * as React from 'react';
import {
    EditorState, convertToRaw, convertFromRaw, Modifier, convertFromHTML, ContentState,
} from 'draft-js';
import ScrollableColumn from 'components/ScrollableColumn';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import memoizeOne from 'memoize-one';
import type {ThemeType} from 'stores/ThemeStore';
import Editor, {composeDecorators} from 'draft-js-plugins-editor';
import createStore from 'components/Plug/utils/createStore';
import {defaultTheme} from 'components/Plug/theme';
import Toolbar from 'components/Plug/components/Toolbar';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import {stateFromHTML} from 'draft-js-import-html';
import JoditEditor from "jodit-react";
import styles from './styles.styl';

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const {AlignmentTool} = alignmentPlugin;
const sideToolbarPlugin = createSideToolbarPlugin();
const {SideToolbar} = sideToolbarPlugin;

const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator,
);
const imagePlugin = createImagePlugin({decorator});

const inlineToolbar = (config = {}) => {
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

const inlineToolbarPlugin = inlineToolbar();
const {InlineToolbar} = inlineToolbarPlugin;
const plugins = [
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    inlineToolbarPlugin,
    sideToolbarPlugin,
];

const config = {
    showPlaceholder: false,
    askBeforePasteHTML: false,
    autofocus: true,
    "theme": "dark",
    "showCharsCounter": false,
    "showWordsCounter": false,
    defaultActionOnPaste: 'insert_as_html',
    "showXPathInStatusbar": false,
    readonly: false // all options from https://xdsoft.net/jodit/doc/
}

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
        theme:               stores.themeStore.getTheme,
        noteText:            stores.noteStore.getNoteText,
        selectedNote:        stores.noteStore.getSelectedNote,
        selectedCategory:    stores.categoryStore.getSelectedCategory,
        setSelectedNoteText: stores.noteStore.setSelectedNoteText,
    }
))
@observer
class NoteEditor extends React.Component {
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
            if ((!prevState.currentNoteText || nextProps.selectedNote.uuid !== prevState.currentNote.uuid)
                && nextProps.noteText && nextProps.noteText.entityMap) {
                state.currentNoteText = EditorState.createWithContent(CustomContentStateConverter(convertFromRaw(nextProps.noteText)));
            } else if (!prevState.currentNoteText) {
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
            content: '',
            currentNoteText: noteText && noteText.entityMap
                ? EditorState.createWithContent(convertFromRaw(noteText))
                : EditorState.createEmpty(),
            currentNote: props.selectedNote,
        };
    }

    debounceChangeNoteText = debounce(this.props.setSelectedNoteText, 700);

    onChangeNote = data => {
        const {selectedNote, selectedCategory} = this.props;
        this.setState({
            currentNoteText: EditorState.set(
                data,
                {currentContent: CustomContentStateConverter(data.getCurrentContent())},
            ),
            currentNote: selectedNote,
        }, () => {
            if (!this.props.selectedNote.text
                || !isEqual(this.props.selectedNote.text.blocks, convertToRaw(data.getCurrentContent()).blocks)) {
                this.debounceChangeNoteText(selectedNote, selectedCategory, convertToRaw(data.getCurrentContent()));
            }
        });
    };

    handlePastedText = (text: string, html?: string): boolean => {
        const contentState = stateFromHTML(html);
        const blocksFromHTML = convertFromHTML(html || text);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );

        console.log(1111, state, html);
        // if they try to paste something they shouldn't let's handle it
        if (text.indexOf('text that should not be pasted') !== -1) {
            // we'll add a message for the offending user to the editor state
            const newContent = Modifier.insertText(
                this.state.editorState.getCurrentContent(),
                this.state.editorState.getSelection(),
                'nice try, chump!',
            );

            // update our state with the new editor content
            this.onChange(EditorState.push(
                this.state.editorState,
                newContent,
                'insert-characters',
            ));
            return true;
        }
        this.onChange(EditorState.createWithContent(
            CustomContentStateConverter(state),
            decoratorR,
        ));
        return true;
    };

    onChange = editorState => this.setState({editorState});

    render() {
        const {selectedNote, offset, theme} = this.props;
        const {currentNoteText, content} = this.state;
        const showComponent = currentNoteText !== null && selectedNote;
        const style = STYLES(theme);
        return (
            <ScrollableColumn
                showScrollShadow
                autoHideScrollbar
                shadowColor={theme.color.second}
                scrollColor={theme.color.second}
                width="inherit"
                toolbar={(
                    <>
                        <div className="main__toolbar"/>
                        {showComponent ? (
                            <div style={style.toolbar} className={`${styles.toolbar} ${toolbarClassName}`}>
                                {moment(selectedNote.updatedAt).format('DD MMMM YYYY, HH:mm')}
                            </div>
                        ) : null}
                    </>
                )}
                footer={<div className={styles.footer}/>}
            >
                {showComponent ? (
                    <>
                        <JoditEditor
                            // ref={editor}
                            value={content}
                            config={config}
                            // tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => this.setState({content: newContent})} // preferred to use
                                // only this option to update the content for performance reasons
                            onChange={newContent => {}}
                        />
                    </>
                ) : <span/>}
            </ScrollableColumn>
        );
    }
}

export default NoteEditor;

export const CustomContentStateConverter = contentState => {
    // changes block type of images to 'atomic'
    const newBlockMap = contentState.getBlockMap().map(block => {
        const entityKey = block.getEntityAt(0);
        if (entityKey !== null) {
            const entityBlock = contentState.getEntity(entityKey);
            const entityType = entityBlock.getType();
            switch (entityType) {
                case 'IMAGE': {
                    const newBlock = block.merge({
                        type: 'atomic',
                        text: 'img',
                    });
                    return newBlock;
                }
                default:
                    return block;
            }
        }
        return block;
    });
    const newContentState = contentState.set('blockMap', newBlockMap);
    return newContentState;
};
