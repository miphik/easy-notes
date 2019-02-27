import {Input} from 'antd';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import * as React from 'react';

const {TextArea} = Input;

@inject(stores => (
    {
        noteText:    stores.noteStore.getNoteText,
        selectedNote:    stores.noteStore.getSelectedNote,
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

    onChangeNote = (event) => {
        const {setSelectedNoteText} = this.props;
        setSelectedNoteText(event.currentTarget.value);
        //console.log(1111, event.currentTarget.value);
    };

    render() {
        const {noteText} = this.props;
        if (noteText === null) return null;
        return (
            <div>
                <div>{noteText}</div>
                <TextArea value={noteText} type="textarea" onChange={this.onChangeNote}/>
            </div>
        );
    }
}
