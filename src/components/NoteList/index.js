// @flow
import ColumnToolbar from 'components/ColumnToolbar';
import Nodata from 'components/Nodata';
import NoteItem from 'components/NoteList/NoteItem';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {formatMessageIntl} from 'services/LocaleService';
import {showNotification} from 'services/NotificationService';
import {REMOVED_CATEGORY, WITHOUT_CATEGORY} from 'stores/NoteStore';
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
    removedCategoryExplanation: <Fm
                                    id="NoteList.render.removed_category_explanation"
                                    defaultMessage="Notes are available here for 30 days.
                                    After that time, notes will be permanently deleted"
                                />,
    newNoteTitle:               <Fm id="NoteList.render.new_note_title" defaultMessage="Untitled"/>,
    addNewNote:                 <Fm id="NoteList.render.add_new_note" defaultMessage="Add new note"/>,
    removeNoteFromCategory:     <Fm
                                    id="NoteList.render.remove_note_from_category"
                                    defaultMessage="Remove the note from this category"
                                />,
    updateNote:                 <Fm id="NoteList.render.button_update_note" defaultMessage="Update note"/>,
    removeNote:                 <Fm id="NoteList.render.button_remove_note" defaultMessage="Remove note"/>,
    deleteNoteSuccess:          <Fm
                                    id="NoteList.onRemoveNote.delete_note_success"
                                    defaultMessage="Note was successfully removed"
                                />,
    noteUpdatedSuccessfully:    <Fm
                                    id="NoteList.onSubmitNoteForm.note_updated_successfully"
                                    defaultMessage="Note successfully updated"
                                />,
    noteCreatedSuccessfully:    <Fm
                                    id="NoteList.onSubmitNoteForm.note_created_successfully"
                                    defaultMessage="New note successfully created"
                                />,
    deleteNoteConfirm:          <Fm
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
        removeNote:       stores.noteStore.removeNote,
        setNoteCategory:  stores.noteStore.setNoteCategory,
        theme:            stores.themeStore.getTheme,
    }
))
@observer
export default class NoteList extends React.Component<PropsType> {

    static defaultProps = {
        name: '',
    };

    state = {
        noteIsEdit:           false,
        removeCategoryIsOver: false,
        noteIsDragging:       false,
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.noteIsDragging &&
            (
                !this.props.selectedCategory || !prevProps.selectedCategory
                || this.props.selectedCategory.uuid !== prevProps.selectedCategory.uuid
            )) {

            this.setState({noteIsDragging: false});
        }
    }

    onAddNewNote = () => {
        const {createUpdateNote, syncNotes} = this.props;
        this.setState({
            noteIsEdit: true,
        });
        createUpdateNote({title: formatMessageIntl(MESSAGES.newNoteTitle)}, emptyFunc, () => {
            syncNotes();
        });
    };

    onEditNote = () => this.setState({
        noteIsEdit: true,
    });

    closeNoteModal = () => this.setState({noteIsEdit: false});

    updateNoteTitle = (noteTitle: string) => {
        if (noteTitle === null) {
            this.closeNoteModal();
            return true;
        }
        const {createUpdateNote, syncNotes, selectedNote} = this.props;
        const note = {...selectedNote};
        note.title = noteTitle;
        createUpdateNote(note, emptyFunc, () => {
            syncNotes();
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

    onDragLeave = event => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({removeCategoryIsOver: false});
    };

    onDragOver = event => {
        event.stopPropagation();
        event.preventDefault();
        if (event.dataTransfer.items.length !== 2 || event.dataTransfer.items[1].type !== 'category') return true;
        const {removeCategoryIsOver} = this.state;
        event.dataTransfer.dropEffect = 'move';
        if (removeCategoryIsOver) return false;
        this.setState({removeCategoryIsOver: true});
        return false;
    };

    onDrop = event => {
        event.stopPropagation();
        event.preventDefault();
        const {noteUUID} = JSON.parse(event.dataTransfer.getData('Text'));
        if (!noteUUID) return true;
        const {selectedCategory, setNoteCategory} = this.props;
        setNoteCategory(noteUUID, selectedCategory.uuid, true);
        this.setState({removeCategoryIsOver: false, noteIsDragging: false});
        return false;
    };

    onNoteDragEnd = event => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({noteIsDragging: false});
    };

    onNoteDragStart = (note: NoteType) => event => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData(
            'Text', JSON.stringify({noteUUID: note.uuid, categoryUUIDs: note.categoryUUIDs}),
        );
        event.dataTransfer.items.add('Text', 'category');
        // event.dataTransfer.setDragImage(event.target, 100, 100);
        this.setState({noteIsDragging: note.uuid});
        return true;
    };

    render() {
        const {noteIsEdit, removeCategoryIsOver, noteIsDragging} = this.state;
        const {notes, selectedCategory, selectedNote, theme} = this.props;
        const isAddButtonDisabled = !selectedCategory
            || selectedCategory.uuid === WITHOUT_CATEGORY
            || selectedCategory.uuid === REMOVED_CATEGORY;
        const notesIsEmpty = !notes.length;

        return (
            <div>
                {selectedCategory && selectedCategory.uuid === REMOVED_CATEGORY ? (
                    <div>{MESSAGES.removedCategoryExplanation}</div>
                ) : null}
                <ColumnToolbar
                    theme={theme}
                    addButtonIsDisabled={isAddButtonDisabled}
                    selectedItem={selectedNote}
                    deleteConfirmText={MESSAGES.deleteNoteConfirm}
                    createNewItem={this.onAddNewNote}
                    updateItem={this.onEditNote}
                    deleteItem={this.onRemoveNote}
                />
                <div
                    style={{
                        backgroundColor: removeCategoryIsOver ? 'lightblue' : 'transparent',
                        height:          50,
                        position:        'relative',
                        top:             noteIsDragging && selectedCategory.uuid !== WITHOUT_CATEGORY ? 0 : -11000,
                        border: '1px dashed white',
                        borderRadius: 4,
                    }}
                    onDragLeave={this.onDragLeave}
                    onDragOver={this.onDragOver}
                    onDrop={this.onDrop}
                >
                    {formatMessageIntl(MESSAGES.removeNoteFromCategory)}
                </div>
                {/*<div>{selectedCategory ? notes.length : <Nodata showImage={false} text="select any"/>}</div>*/}
                <div>{selectedCategory && notesIsEmpty ? <Nodata/> : null}</div>
                <div onClick={this.onClearSelectNode}>
                    <br/>
                    {notes.map((note: NoteType) => (
                        <div
                            key={note.uuid}
                            onDragStart={this.onNoteDragStart(note)}
                            onDragEnd={this.onNoteDragEnd}
                            draggable
                        >
                            <NoteItem
                                note={note}
                                noteIsEditing={noteIsEdit}
                                updateNoteTitle={this.updateNoteTitle}
                                noteIsDragging={noteIsDragging === note.uuid}
                                noteIsSelected={selectedNote && note.uuid === selectedNote.uuid}
                                onSelectNode={this.onSelectNode}
                            />
                        </div>
                    ))}
                    <br/>
                </div>

                {/*<NoteForm
                    isNew={noteModalIsForNew}
                    onSubmit={this.onSubmitNoteForm}
                    isVisible={noteIsEdit}
                    onClose={this.closeNoteModal}
                    initialValues={{}}
                />*/}
            </div>
        );
    }
}
