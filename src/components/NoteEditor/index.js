// @flow

import {inject, observer} from 'mobx-react';
import React from 'react';
import ScrollableColumn from 'components/ScrollableColumn';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import Radium, {Style} from 'radium';
import JoditEditor from 'components/Jodit';
import 'prismjs/themes/prism-twilight.css';
import 'highlight.js/styles/a11y-dark.css';
import Jodit from 'jodit';
import styles from './styles.styl';
import {STYLES, getTextStyles} from './styles';
import config from './config';
import 'components/NoteEditor/plugins/search';
import {Command} from 'components/NoteEditor/plugins/types';
import type {NoteHistoryType} from 'types/NoteType';

const toolbarClassName = 'NoteText__toolbar';
const maxHistoryElements = 100;

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
@Radium
class NoteEditor extends React.Component {
    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.selectedNote) return {currentNote: null, currentNoteText: ''};
        if (!prevState.currentNote
            || !nextProps.selectedNote.text
            || nextProps.selectedNote.uuid !== prevState.currentNote.uuid) {
            NoteEditor.isChanged = true;
            const state = {currentNote: nextProps.selectedNote};
            if ((!prevState.currentNoteText || nextProps.selectedNote.uuid !== prevState.currentNote.uuid)) {
                state.currentNoteText = nextProps.noteText;
            } else if (!prevState.currentNoteText) {
                state.currentNoteText = '';
            }
            return state;
        }
        return null;
    }

    static isChanged = false;

    constructor(props) {
        super(props);
        const {noteText, selectedNote} = props;
        this.state = {currentNoteText: noteText, currentNote: selectedNote, focused: false};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (NoteEditor.isChanged) {
            const {selectedNote} = this.props;
            NoteEditor.isChanged = false;
            setTimeout(() => {
                const editor = Jodit.instances[Object.keys(Jodit.instances)[0]];
                if (!editor) return;
                editor.observer.stack.clear();
                if (!selectedNote.history) return;
                selectedNote.history.forEach(item => {
                    editor.observer.stack.push(new Command(item.oldValue, item.newValue, editor.observer));
                });
            }, 500);
        }
    }

    onChangeNote = data => {
        const {selectedNote, selectedCategory, setSelectedNoteText} = this.props;
        this.setState({
            focused: false,
            currentNoteText: data,
            currentNote: selectedNote,
        }, () => {
            if (!this.props.selectedNote.text || !isEqual(this.props.selectedNote.text, data)) {
                const editor = Jodit.instances[Object.keys(Jodit.instances)[0]];
                const history: Array<NoteHistoryType> = [];
                if (editor && editor.observer.stack.commands.length) {
                    const {commands} = editor.observer.stack;
                    commands.slice(Math.max(commands.length - maxHistoryElements, 1)).forEach(command => history.push({
                        createdAt: moment().format(),
                        oldValue: command.oldValue,
                        newValue: command.newValue,
                    }));
                }
                setSelectedNoteText(selectedNote, selectedCategory, data, history);
            }
        });
    };

    onChange = data => {
        const {selectedNote, selectedCategory, setSelectedNoteText} = this.props;
        if (selectedNote.text !== data) setSelectedNoteText(selectedNote, selectedCategory, data);
    };

    onFocus = () => this.setState({focused: true});

    render() {
        const {selectedNote, offset, theme} = this.props;
        const {currentNoteText, focused} = this.state;
        const showComponent = currentNoteText !== null && selectedNote;
        const style = STYLES(theme, focused);
        const textStyle = getTextStyles(style);
        return (
            <ScrollableColumn
                autoHideScrollbar
                renderScrollbar={false}
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
                <Style rules={textStyle}/>
                {showComponent ? (
                    <div className="NoteEditor__container">
                        <JoditEditor
                            value={currentNoteText}
                            config={config}
                            // tabIndex={1} // tabIndex of textarea
                            onBlur={this.onChangeNote} // preferred to use
                            // onFocus={this.onFocus}
                            // only this option to update the content for performance reasons
                            onChange={newContent => {
                            }}
                        />
                    </div>
                ) : <span/>}
            </ScrollableColumn>
        );
    }
}

export default NoteEditor;
