import LocalStoreService from 'services/LocalStoreService';
import RemoteStoreService from 'services/RemoteStoreService';

const ADD_NEW_NOTE_OPERATION = 'ADD';
const UPDATE_NEW_NOTE_OPERATION = 'UPDATE';
const DELETE_NEW_NOTE_OPERATION = 'DELETE';

let remoteStorageService = RemoteStoreService;
let localStorageService = LocalStoreService;

export const setRemoteStorageService = remoteService => remoteStorageService = remoteService;
export const setLocalStorageService = localService => localStorageService = localService;

const mergeIndex = (remoteNotes, localNotes) => {
    const resultNotes = [];
    // @TODO merge
    return resultNotes;
};

export const syncRemoteAndLocalData = () => {
    const remoteNotes = remoteStorageService.getNotesList();
    const localNotes = localStorageService.getNotesList();

    if (!remoteNotes && !localNotes) {
        remoteStorageService.saveNotesList([]);
        localStorageService.saveNotesList([]);
    } else if (!remoteNotes && localNotes) {
        remoteStorageService.saveNotesList(localNotes);
    } else if (remoteNotes && !localNotes) {
        localStorageService.saveNotesList(remoteNotes);
    } else {
        const {mergedIndex, updateOperations} = mergeIndex(remoteNotes, localNotes);
        updateOperations.forEach(operation => {
            const fromStore = operation.isFromLocalStore ? localStorageService : remoteStorageService;
            const toStore = operation.isFromLocalStore ? remoteStorageService : localStorageService;
            switch (operation.action) {
                case ADD_NEW_NOTE_OPERATION: {
                    const note = fromStore.readNote(operation.id);
                    // @TODO check error
                    toStore.writeNote(note);
                    // @TODO check error
                    break;
                }
                case UPDATE_NEW_NOTE_OPERATION: {
                    const note = fromStore.readNote(operation.id);
                    // @TODO check error
                    toStore.writeNote(note);
                    // @TODO check error
                    break;
                }
                case DELETE_NEW_NOTE_OPERATION: {
                    toStore.deleteNote(operation.id);
                    // @TODO check error
                    break;
                }
                default:
                    throw new Error(`Something went wrong, there is no any action with type: ${operation.action}`);
            }
        });
        remoteStorageService.saveNotesList(mergedIndex);
        localStorageService.saveNotesList(mergedIndex);
    }
};
