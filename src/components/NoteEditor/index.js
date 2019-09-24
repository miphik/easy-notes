import {Input} from 'antd';
import debounce from 'lodash/debounce';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Editor, EditorState } from "draft-js";
import ScrollableColumn from "components/ScrollableColumn";

const {TextArea} = Input;

@inject(stores => (
    {
        theme: stores.themeStore.getTheme,
        noteText: stores.noteStore.getNoteText,
        selectedNote: stores.noteStore.getSelectedNote,
        setSelectedNoteText: stores.noteStore.setSelectedNoteText,
    }
))
@observer
export default class NoteEditor extends React.Component {
    state = {
        currentNoteText: null,
        currentNote: null,
        editorState: EditorState.createEmpty(),
    };

    static propTypes = {
        name: PropTypes.string,
    };

    static defaultProps = {
        name: '',
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log(nextProps, prevState);
        if (!nextProps.selectedNote) return {currentNote: null, currentNoteText: null};
        if (!prevState.currentNote || nextProps.selectedNote.uuid !== prevState.currentNote.uuid) {
            return {currentNote: nextProps.selectedNote, currentNoteText: nextProps.noteText};
        }
        return null;
    }

    debounceChangeNoteText = debounce(this.props.setSelectedNoteText, 1000);

    onChangeNote = (data) => {
        this.setState({
            currentNoteText: data,
            currentNote: this.props.selectedNote
        }, () => this.debounceChangeNoteText(data));
    };
    onChange = editorState => this.setState({ editorState });
    render() {
        const {noteText, theme} = this.props;
        const {currentNoteText, currentNote} = this.state;
        if (noteText === null) return null;
        return (
            <ScrollableColumn
                showScrollShadow
                autoHideScrollbar
                shadowColor={theme.color.second}
                scrollColor={theme.color.second}
                width="inherit"
            >
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                />
            </ScrollableColumn>
        );
    }
}
