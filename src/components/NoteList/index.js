// @flow
import {Button} from 'antd';
import NoteForm from 'components/NoteList/NoteForm';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {formatMessageIntl} from 'services/LocaleService';
import {showNotification} from 'services/NotificationService';
import type {CategoryType, NoteType} from 'types/NoteType';
import {FormattedMessage as Fm} from 'react-intl';
import {emptyFunc} from 'utils/General';

type PropsType = {
    notes: Array<NoteType>,
    selectedNote: CategoryType,
    syncNotes: () => void,
    createUpdateNote: () => void,
    bar?: string,
};

const MESSAGES = {
    addNewNote:              <Fm id="NoteList.render.add_new_note" defaultMessage="Add new note"/>,
    deleteNoteSuccess:       <Fm id="NoteList.onRemoveNote.delete_note_success"
                                 defaultMessage="Note was successfully removed"/>,
    noteUpdatedSuccessfully: <Fm id="NoteList.onSubmitNoteForm.note_updated_successfully"
                                 defaultMessage="Note successfully updated"/>,
    noteCreatedSuccessfully: <Fm id="NoteList.onSubmitNoteForm.note_created_successfully"
                                 defaultMessage="New note successfully created"/>,
};

@inject(stores => (
    {
        notes:            stores.noteStore.getNoteItemsByCategory,
        selectedCategory: stores.categoryStore.getSelectedCategory,
        selectedNote:     stores.noteStore.getSelectedNote,
        setSelectedNote:  stores.noteStore.setSelectedNote,
        createUpdateNote: stores.noteStore.createUpdateNote,
        syncNotes:        stores.noteStore.syncNotes,
    }
))
@observer
export default class NoteList extends React.Component<PropsType> {

    static defaultProps = {
        name: '',
    };

    state = {
        noteModalIsOpen:   false,
        noteModalIsForNew: false,
    };

    openNoteModalForNew = () => this.setState({
        noteModalIsOpen:   true,
        noteModalIsForNew: true,
    });

    openNoteModal = () => this.setState({
        noteModalIsOpen:   true,
        noteModalIsForNew: false,
    });

    closeNoteModal = () => this.setState({noteModalIsOpen: false});

    onSubmitNoteForm = (values: NoteType, update = !this.state.noteModalIsForNew) => {
        const {createUpdateNote, syncNotes} = this.props;
        createUpdateNote(values, emptyFunc, () => {
            syncNotes();
            showNotification(
                formatMessageIntl(update ? MESSAGES.noteUpdatedSuccessfully : MESSAGES.noteCreatedSuccessfully),
                '',
                {
                    type:     'success',
                    duration: 7,
                },
            );
            this.closeNoteModal();
        });
        return true;
    };

    onClearSelectNode = () => this.props.setSelectedNote(null);

    onSelectNode = (node: NoteType) => this.props.setSelectedNote(node);

    onRemoveNote = () => {
        const {removeNote, syncNotes, selectedNote} = this.props;
        removeNote(selectedNote.uuid, emptyFunc, () => {
            this.onClearSelectNode();
            syncNotes();
            showNotification(
                formatMessageIntl(MESSAGES.deleteNoteSuccess),
                '',
                {
                    type:     'success',
                    duration: 7,
                },
            );
        });
    };

    render() {
        const {noteModalIsForNew, noteModalIsOpen,} = this.state;
        const {notes, selectedCategory} = this.props;
        return (
            <div>
                {selectedCategory ? (
                    <Button onClick={this.openNoteModalForNew}>
                        {MESSAGES.addNewNote}
                    </Button>
                ) : null}
                <div>NoteList {selectedCategory ? notes.length : 'Select any category'}</div>
                {notes.map((note: NoteType) => (
                    <div key={note.uuid}>
                        {note.title}
                    </div>
                ))}
                <NoteForm
                    isNew={noteModalIsForNew}
                    onSubmit={this.onSubmitNoteForm}
                    isVisible={noteModalIsOpen}
                    onClose={this.closeNoteModal}
                    initialValues={{}}
                />
            </div>
        );
    }
}
