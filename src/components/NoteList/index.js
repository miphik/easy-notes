// @flow
import {Button, Popconfirm} from 'antd';
import NoteForm from 'components/NoteList/NoteForm';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {formatMessageIntl} from 'services/LocaleService';
import {showNotification} from 'services/NotificationService';
import type {CategoryType, NoteType} from 'types/NoteType';
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
    updateNote:              <Fm id="NoteList.render.button_update_note" defaultMessage="Update note"/>,
    removeNote:              <Fm id="NoteList.render.button_remove_note" defaultMessage="Remove note"/>,
    deleteNoteSuccess:       <Fm id="NoteList.onRemoveNote.delete_note_success"
                                 defaultMessage="Note was successfully removed"/>,
    noteUpdatedSuccessfully: <Fm id="NoteList.onSubmitNoteForm.note_updated_successfully"
                                 defaultMessage="Note successfully updated"/>,
    noteCreatedSuccessfully: <Fm id="NoteList.onSubmitNoteForm.note_created_successfully"
                                 defaultMessage="New note successfully created"/>,
    deleteNoteConfirm:       <Fm
                                 id="NoteList.render.delete_note_confirm"
                                 defaultMessage="Are you sure about deleting this note?"
                             />,
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

    onSelectNode = (node: NoteType) => event => {
        event.stopPropagation();
        this.props.setSelectedNote(node);
    };

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
        const {notes, selectedCategory, selectedNote} = this.props;
        return (
            <div>
                {selectedCategory ? (
                    <Button onClick={this.openNoteModalForNew}>
                        {MESSAGES.addNewNote}
                    </Button>
                ) : null}
                {selectedCategory && selectedNote ? <div>
                    <Button onClick={this.openNoteModal}>
                        {MESSAGES.updateNote}
                    </Button>
                    <Popconfirm
                        // placement="rightTop"
                        title={MESSAGES.deleteNoteConfirm}
                        onConfirm={this.onRemoveNote}
                    >
                        <Button
                            type="danger"
                            ghost
                        >
                            {MESSAGES.removeNote}
                        </Button>
                    </Popconfirm>
                </div> : null}
                <div>NoteList {selectedCategory ? notes.length : 'Select any category'}</div>
                <div onClick={this.onClearSelectNode}>
                    <br/>
                    {notes.map((note: NoteType) => (
                        <div key={note.uuid} onClick={this.onSelectNode(note)}
                             style={selectedNote && note.uuid === selectedNote.uuid ? {color: 'red'} : {}}>
                            {note.title}
                        </div>
                    ))}
                    <br/>
                </div>
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
