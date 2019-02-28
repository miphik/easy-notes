// @flow
import {action, observable} from 'mobx';
import moment from 'moment';
import LocalStoreService from 'services/LocalStoreService';
import RemoteStoreService from 'services/RemoteStoreService';
import {loadLocalNotes, syncRemoteAndLocalNotes} from 'services/SyncService';
import categoryStore from 'stores/CategoryStore';
import type {NoteType} from 'types/NoteType';
import type {StoreType} from 'types/StoreType';
import uuidv4 from 'uuid/v4';

let remoteStorageService: StoreType = RemoteStoreService;
let localStorageService: StoreType = LocalStoreService;

export const WITHOUT_CATEGORY = 'WITHOUT_CATEGORY';

export const setRemoteStorageService = (remoteService: StoreType) => remoteStorageService = remoteService;
export const setLocalStorageService = (localService: StoreType) => localStorageService = localService;

class NoteStore {
    @observable notes = observable.map();

    @observable selectedNote = null;

    @observable tags = observable.map();

    @action
    setNotes = (notes: Array<NoteStore>) => {
        console.info('LOAD NOTES', notes);
        const newNotes = {
            [WITHOUT_CATEGORY]: [],
        };
        const catUUIDs = categoryStore.categoryAllItemUUIDS;
        notes.forEach((note: NoteType) => {
            if (!catUUIDs[note.categoryUUID]) {
                newNotes[WITHOUT_CATEGORY].push(note);
            } else {
                if (!newNotes[note.categoryUUID]) newNotes[note.categoryUUID] = [];
                newNotes[note.categoryUUID].push(note);
            }

            note.tags.forEach((tag: string) => {
                if (!this.tags[tag]) this.tags[tag] = [];
                this.tags[tag].push(note.uuid);
            });
        });
        this.notes = observable.map(newNotes);
    };

    @action
    setSelectedNoteInner = (note: NoteType) => this.selectedNote = note;

    @action
    setSelectedNote = (note: NoteType) => {
        if (note !== null) {
            note.textIsLoaded = true;
            localStorageService.getNote(note, this.setSelectedNoteInner, this.setSelectedNoteInner);
        } else this.setSelectedNoteInner(note);
    };

    @action
    setNoteCategory = (noteUUID: string, categoryUUID: string) => {
        let note = null;
        let changedNoteExists = false;
        if (this.selectedNote && this.selectedNote.uuid === noteUUID) {
            note = {...this.selectedNote};
        }
        const notes = this.noteItems.map((noteItem: NoteType) => {
            if (noteUUID === noteItem.uuid) {
                changedNoteExists = true;
                noteItem.categoryUUID = categoryUUID;
                noteItem.updatedAt = moment().format();
                if (note) note = {...noteItem};
                this.setSelectedNoteInner(note);
            }
            return noteItem;
        });
        if (changedNoteExists) {
            this.setNotes(notes);
            if (note) {
                localStorageService.saveNote(note, (err: Error) => console.error('localStorageService.saveNote', err));
                remoteStorageService.saveNote(
                    note,
                    (err: Error) => console.error('remoteStorageService.saveNote', err));
            }
            localStorageService.saveNotesList(notes, (err: Error) => console
                .error('localStorageService.saveNotesList', err));
            remoteStorageService.saveNotesList(notes, (err: Error) => console
                .error('remoteStorageService.saveNotesList', err));
        }
    };

    @action
    setSelectedNoteText = (text: string) => {
        const note = {...this.selectedNote};
        note.text = text;
        note.updatedAt = moment().format();
        const notes = this.noteItems.map((noteItem: NoteType) => (
            note.uuid === noteItem.uuid ? note : noteItem
        ));
        this.setNotes(notes);
        this.setSelectedNoteInner(note);
        localStorageService.saveNote(note, (err: Error) => console.error('localStorageService.saveNote', err));
        remoteStorageService.saveNote(note, (err: Error) => console.error('remoteStorageService.saveNote', err));
        localStorageService.saveNotesList(notes, (err: Error) => console
            .error('localStorageService.saveNotesList', err));
        remoteStorageService.saveNotesList(notes, (err: Error) => console
            .error('remoteStorageService.saveNotesList', err));
    };

    @action
    syncNotes = () => syncRemoteAndLocalNotes(this.setNotes);

    @action
    loadLocalNotes = () => loadLocalNotes(this.setNotes);

    @action
    createUpdateNote = (
        noteItem: NoteType,
        errorCallback: () => void,
        successCallback: () => void,
    ) => {
        const note = {...noteItem};
        const isNew = !note.uuid;

        note.categoryUUID = categoryStore.getSelectedCategory.uuid;
        note.updatedAt = moment().format();
        if (isNew) {
            note.createdAt = note.updatedAt;
            note.uuid = uuidv4();
            note.tags = [];
            const notes = this.noteItems;
            notes.unshift(note);
            this.setNotes(notes);
        } else {
            this.setNotes(this.noteItems
                .map((item: NoteType) => (
                    item.uuid === note.uuid ? note : item
                )));
        }
        localStorageService.saveNote(note);
        localStorageService.saveNotesList(this.noteItems, errorCallback, successCallback);
    };

    get noteItems() {
        const notes = [];
        this.notes.toJS().forEach((catNotes: Array<NoteType>) => notes.push(...catNotes));
        return notes;
    }

    get getTags() {
        return this.tags.toJS();
    }

    get getNoteText() {
        return this.selectedNote ? this.selectedNote.text : null;
    }

    get getNoteItemsByCategory() {
        const categoryUUID = categoryStore.getSelectedCategoryUUID;
        return this.notes.get(categoryUUID) || [];
    }

    get getSelectedNote() {
        return this.selectedNote;
    }
}

export default new NoteStore();
