// @flow
import {action, observable} from 'mobx';
import moment from 'moment';
import type {LocalStoreType} from 'services/LocalStoreService';
import LocalStoreService from 'services/LocalStoreService';
import type {RemoteStoreType} from 'services/RemoteStoreService';
import RemoteStoreService from 'services/RemoteStoreService';
import {loadLocalNotes, syncRemoteAndLocalNotes} from 'services/SyncService';
import categoryStore from 'stores/CategoryStore';
import type {NoteType} from 'types/NoteType';
import uuidv4 from 'uuid/v4';

let remoteStorageService: RemoteStoreType = RemoteStoreService;
let localStorageService: LocalStoreType = LocalStoreService;

export const setRemoteStorageService = (remoteService: RemoteStoreType) => remoteStorageService = remoteService;
export const setLocalStorageService = (localService: LocalStoreType) => localStorageService = localService;

class NoteStore {
    @observable notes = observable.map();

    @observable selectedNote = null;

    @observable tags = observable.map();

    @action
    setNotes = (notes: Array<NoteStore>) => {
        console.info('LOAD NOTES', notes);
        const newNotes = {};
        notes.forEach((note: NoteType) => {
            if (!newNotes[note.categoryUUID]) newNotes[note.categoryUUID] = [];
            newNotes[note.categoryUUID].push(note);
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
    setSelectedNoteText = (text: string) => {
        const note = {...this.selectedNote};
        note.text = text;
        this.setSelectedNoteInner(note);
        localStorageService.saveNote(note);
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
            const notes = this.noteItems;
            if (!notes[note.categoryUUID]) notes[note.categoryUUID] = [];
            notes[note.categoryUUID].unshift(note);
            this.setNotes(notes);
        } else {
            this.setNotes(this.noteItems
                .map((item: NoteType) => (
                    item.uuid === note.uuid ? note : item
                )));
        }
        localStorageService.saveNotesList(this.noteItems, errorCallback, successCallback);
    };

    get noteItems() {
        const notes = [];
        this.notes.toJS().forEach(categoryNotes => notes.push(categoryNotes));
        return this.notes.toJS().values();
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
