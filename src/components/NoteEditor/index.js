import {Input} from 'antd';
import debounce from 'lodash/debounce';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import EditorJs from 'react-editor-js';
import * as React from 'react';
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

    render() {
        const {noteText, theme} = this.props;
        const {currentNoteText, currentNote} = this.state;
        if (noteText === null) return null;
        console.log(111, currentNoteText !== null ? currentNoteText : noteText);
        return (
            <ScrollableColumn
                showScrollShadow
                autoHideScrollbar
                shadowColor={theme.color.second}
                scrollColor={theme.color.second}
                width="inherit"
            >
                <EditorJs
                    enableReInitialize
                    // key={currentNote.uuid}
                    // autofocus
                    // holderId={currentNote.uuid}
                    // excludeDefaultTools={['header']}
                    onChange={this.onChangeNote}
                    customTools={{
                        // header: CustomHeader
                    }}
                    onReady={() => console.log('Start!')}
                    data={currentNoteText !== null ? currentNoteText : noteText}
                />
            </ScrollableColumn>
        );
    }
}
