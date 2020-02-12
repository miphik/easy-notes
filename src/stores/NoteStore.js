// @flow
import {action, observable} from 'mobx';
import moment from 'moment';
import LocalStoreService from 'services/LocalStoreService';
import RemoteStoreService from 'services/RemoteStoreService';
import {loadLocalNotes, syncRemoteAndLocalNotes} from 'services/SyncService';
import categoryStore from 'stores/CategoryStore';
import type {CategoryType, NoteHistoryType, NoteType} from 'types/NoteType';
import type {StoreType} from 'types/StoreType';
import uuidv4 from 'uuid/v4';

let remoteStorageService: StoreType = RemoteStoreService;
let localStorageService: StoreType = LocalStoreService;

export const WITHOUT_CATEGORY = 'WITHOUT_CATEGORY';
export const REMOVED_CATEGORY = 'REMOVED_CATEGORY';

export const setRemoteStorageService = (remoteService: StoreType) => remoteStorageService = remoteService;
export const setLocalStorageService = (localService: StoreType) => localStorageService = localService;

class NoteStore {
    @observable notes = observable.map();

    @observable selectedNote = null;

    @observable tags = observable.map();

    @action
    setNotes = (notes: Array<NoteStore>) => {
        this.changeSyncingStatus(false);
        console.info('LOAD NOTES', notes);
        const newNotes = {
            [WITHOUT_CATEGORY]: [],
            [REMOVED_CATEGORY]: [],
        };
        const catUUIDs = categoryStore.categoryAllItemUUIDS;
        notes
            .forEach((note: NoteType) => {
                if (!note.categoryUUIDs) note.categoryUUIDs = [];
                if (note.isDeleted) {
                    note.categoryUUIDs = [];
                    newNotes[REMOVED_CATEGORY].push(note);
                    return;
                }
                if (!note.categoryUUIDs.length) {
                    newNotes[WITHOUT_CATEGORY].push(note);
                }
                note.categoryUUIDs.forEach((catUUID: string) => {
                    if (!catUUIDs[catUUID]) {
                        newNotes[WITHOUT_CATEGORY].push(note);
                    } else {
                        if (!newNotes[catUUID]) newNotes[catUUID] = [];
                        newNotes[catUUID].push(note);
                    }
                });

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
    removeNote = (
        noteUUID: string,
        errorCallback: () => void,
        successCallback: () => void,
    ) => {
        const notes = this.noteItems.map((item: NoteType) => {
            if (item.uuid === noteUUID) {
                // eslint-disable-next-line no-param-reassign
                item.isDeleted = true;
                item.updatedAt = moment().format();
            }
            return item;
        });
        this.setNotes(notes);
        localStorageService.saveNotesList(notes, (err: Error) => {
            console.error('localStorageService.removeNote', err);
            errorCallback(err);
        }, successCallback);
        remoteStorageService.saveNotesList(notes, (err: Error) => console
            .error('remoteStorageService.removeNote', err));
    };

    @action
    setSelectedNote = (note: NoteType) => {
        if (note !== null) {
            // if (this.selectedNote && this.selectedNote.uuid === note.uuid) return;
            note.textIsLoaded = true;
            localStorageService.getNote(note, this.setSelectedNoteInner, this.setSelectedNoteInner);
        } else this.setSelectedNoteInner(note);
    };

    @action
    setNoteCategory = (noteUUID: string, categoryUUID: string, isRemoving: boolean = false) => {
        let note = null;
        let changedNoteExists = false;
        if (this.selectedNote && this.selectedNote.uuid === noteUUID) {
            note = {...this.selectedNote};
        }
        const notes = this.noteItems.map((noteItem: NoteType) => {
            if (noteUUID === noteItem.uuid) {
                changedNoteExists = true;
                if (isRemoving) {
                    noteItem.categoryUUIDs = noteItem.categoryUUIDs
                        .filter((catUUID: string) => catUUID !== categoryUUID);
                } else {
                    if (categoryUUID !== WITHOUT_CATEGORY && categoryUUID !== REMOVED_CATEGORY) {
                        noteItem.categoryUUIDs = noteItem.categoryUUIDs
                            .filter((catUUID: string) => catUUID !== WITHOUT_CATEGORY);
                        noteItem.isDeleted = false;
                    }
                    noteItem.categoryUUIDs.push(categoryUUID);
                }
                noteItem.updatedAt = moment().format();
                if (note) note = {...noteItem};
                this.setSelectedNoteInner(note);
            }
            return noteItem;
        });
        if (changedNoteExists) {
            this.setNotes(notes);
            localStorageService.saveNotesList(notes, (err: Error) => console
                .error('localStorageService.saveNotesList', err));
            remoteStorageService.saveNotesList(notes, (err: Error) => console
                .error('remoteStorageService.saveNotesList', err));
        }
    };

    @action
    setSelectedNoteText = (
        savingNote: NoteType,
        category: CategoryType,
        text: string,
        history: Array<NoteHistoryType>,
    ) => {
        const note = {...savingNote};
        note.text = text;
        note.history = history;
        note.updatedAt = moment().format();
        const notes = this.noteItems.map((noteItem: NoteType) => {
            if (note.uuid === noteItem.uuid) {
                note.categoryUUIDs = noteItem.categoryUUIDs;
                return note;
            }
            return noteItem;
        });
        categoryStore.setSelectedCategory(category);
        this.setNotes(notes);
        this.setSelectedNoteInner(note);
        localStorageService.saveNote(note, (err: Error) => console.error('localStorageService.saveNote', err));
        localStorageService.saveNotesList(notes, (err: Error) => console
            .error('localStorageService.saveNotesList', err));
        if (RemoteStoreService.isClientInitialized()) {
            remoteStorageService.saveNote(note, (err: Error) => console.error('remoteStorageService.saveNote', err));
            remoteStorageService.saveNotesList(notes, (err: Error) => console
                .error('remoteStorageService.saveNotesList', err));
        }
    };

    @action
    syncNotes = () => {
        categoryStore.changeSyncingStatus(true);
        syncRemoteAndLocalNotes(this.setNotes, this.syncNotesError);
    };

    @action
    changeSyncingStatus = categoryStore.debounceChangeSyncingStatus;

    @action
    syncNotesError = (errors: Array<Error>) => {
        this.changeSyncingStatus(false);
        categoryStore.syncCategoriesError(errors);
    };

    @action
    loadLocalNotes = () => loadLocalNotes(this.setNotes, this.loadLocalNotesError);

    loadLocalNotesError = (errors: Array<Error>) => {

    };

    @action
    createUpdateNote = (
        noteItem: NoteType,
        errorCallback: () => void,
        successCallback: () => void,
    ) => {
        const note = {...noteItem};
        const isNew = !note.uuid;

        note.categoryUUIDs = [categoryStore.getSelectedCategory.uuid];
        note.updatedAt = moment().format();
        if (isNew) {
            note.createdAt = note.updatedAt;
            note.uuid = uuidv4();
            note.tags = [];
            const notes = this.noteItems;
            notes.unshift(note);
            this.setNotes(notes);
            this.setSelectedNote(note);
        } else {
            this.setNotes(this.noteItems
                .map((item: NoteType) => {
                    if (item.uuid === note.uuid) {
                        this.setSelectedNote(note);
                        return note;
                    }
                    return item;
                }));
        }
        localStorageService.saveNote(note);
        localStorageService.saveNotesList(this.noteItems, errorCallback, successCallback);
    };

    get noteItems() {
        const notes = {};
        this.notes.toJS().forEach((catNotes: Array<NoteType>) => catNotes
            .forEach((catNote: NoteType) => notes[catNote.uuid] = catNote));
        return Object.values(notes);
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
