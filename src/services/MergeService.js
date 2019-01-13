// @flow
import type {UpdateOperationType} from 'services/SyncService';
import type {NoteType} from 'src/types/NoteType';

const sortNotes = (noteA: NoteType, noteB: NoteType) => noteB.updatedAt.localeCompare(noteA.updatedAt);

export type MergedIndexResultType = {
    updateOperations: Array<UpdateOperationType>
};

// eslint-disable-next-line import/prefer-default-export
export const mergeIndex = (remoteNotes: Array<NoteType> = [], localNotes: Array<NoteType> = []): MergedIndexResultType => {
    const updateOperations = [];
    const lNotes = {};
    const rNotes = {};
    const localAdd = {};
    const remoteAdd = {};
    const notes = {};
    remoteNotes.map((note: NoteType) => rNotes[note.uuid] = note);
    localNotes.map((note: NoteType) => lNotes[note.uuid] = note);
    Object.values(lNotes).forEach((note: NoteType) => {
        if (!rNotes[note.uuid] || note.updatedAt > rNotes[note.uuid].updatedAt) {
            notes[note.uuid] = note;
            remoteAdd[note.uuid] = note;
        } else {
            notes[note.uuid] = rNotes[note.uuid];
            localAdd[note.uuid] = note;
        }
    });
    Object.values(rNotes).forEach((note: NoteType) => {
        if (!lNotes[note.uuid] || note.updatedAt > lNotes[note.uuid].updatedAt) {
            notes[note.uuid] = note;
            localAdd[note.uuid] = note;
        } else {
            notes[note.uuid] = lNotes[note.uuid];
            remoteAdd[note.uuid] = note;
        }
    });

    const mergedIndex = Object.values(notes).sort(sortNotes);
    console.info('MERGED STATUS', mergedIndex, updateOperations);
    return {mergedIndex, updateOperations};
};
