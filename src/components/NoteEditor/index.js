import {Input} from 'antd';
import debounce from 'lodash/debounce';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import * as React from 'react';

const {TextArea} = Input;

@inject(stores => (
    {
        noteText:            stores.noteStore.getNoteText,
        selectedNote:        stores.noteStore.getSelectedNote,
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
        if (!nextProps.selectedNote || !prevState.currentNote) return null;
        if (nextProps.selectedNote.uuid !== prevState.currentNote.uuid) {
            return {currentNote: nextProps.selectedNote, currentNoteText: nextProps.noteText};
        }
        return null;
    }

    debounceChangeNoteText = debounce(this.props.setSelectedNoteText, 250);

    onChangeNote = (event) => {
        const {value} = event.currentTarget;
        this.setState({currentNoteText: value, currentNote: this.props.selectedNote}, () => this.debounceChangeNoteText(value));
    };

    render() {
        const {noteText} = this.props;
        const {currentNoteText} = this.state;
        if (noteText === null) return null;
        return (
            <div>
                <div>{noteText}</div>
                <TextArea
                    value={currentNoteText !== null ? currentNoteText : noteText} type="textarea"
                    onChange={this.onChangeNote}
                />
            </div>
        );
    }
}
