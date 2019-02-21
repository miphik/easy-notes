// @flow
import {action, observable} from 'mobx';
import moment from 'moment';
import LocalStoreService from 'services/LocalStoreService';
import type {LocalStoreType} from 'services/LocalStoreService';
import RemoteStoreService from 'services/RemoteStoreService';
import type {RemoteStoreType} from 'services/RemoteStoreService';
import {loadLocalNotes, syncRemoteAndLocalNotes} from 'services/SyncService';
import categoryStore from 'stores/CategoryStore';
import type {NoteType} from 'types/NoteType';
import uuidv4 from 'uuid/v4';

let remoteStorageService: RemoteStoreType = RemoteStoreService;
let localStorageService: LocalStoreType = LocalStoreService;

export const setRemoteStorageService = (remoteService: RemoteStoreType) => remoteStorageService = remoteService;
export const setLocalStorageService = (localService: LocalStoreType) => localStorageService = localService;

class NoteStore {
    @observable notes = observable.array();

    @observable selectedNote = null;

    @action
    setNotes = (notes: Array<NoteStore>) => {
        console.info('LOAD NOTES', notes);
        this.notes = observable.array(notes);
    };

    @action
    setSelectedNote = (note: NoteType) => this.selectedNote = note;

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
            this.notes.unshift(note);
        } else {
            this.setNotes(this.noteItems
                .map((item: NoteType) => (
                    item.uuid === note.uuid ? note : item
                )));
        }

        localStorageService.saveNotesList(this.noteItems, errorCallback, successCallback);
    };

    get noteItems() {
        return this.notes.toJS();
    }

    get getNoteItemsByCategory() {
        const categoryUUID = categoryStore.getSelectedCategoryUUID;
        return this.notes.toJS().filter((item: NoteType) => item.categoryUUID === categoryUUID);
    }

    get getSelectedNote() {
        return this.selectedNote;
    }
}

export default new NoteStore();
