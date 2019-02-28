// @flow
import type {UpdateOperationType} from 'services/SyncService';
import {ADD_NEW_NOTE_OPERATION, UPDATE_NEW_NOTE_OPERATION} from 'services/SyncService';
import type {CategoryType, NoteType} from 'src/types/NoteType';

const sortEntities = (noteA: NoteType, noteB: NoteType) => noteB.updatedAt.localeCompare(noteA.updatedAt);

export type MergedIndexResultType = {
    updateOperations: Array<UpdateOperationType>
};

// eslint-disable-next-line import/prefer-default-export
export const mergeIndex = (
    remote: Array<NoteType | CategoryType> = [],
    locals: Array<NoteType | CategoryType> = [],
): MergedIndexResultType => {
    const updateOperations = [];
    const lEntities = {};
    const rEntities = {};
    const localAdd = {};
    const remoteAdd = {};
    const entities = {};
    remote.map((entity: NoteType | CategoryType) => rEntities[entity.uuid] = entity);
    locals.map((entity: NoteType | CategoryType) => lEntities[entity.uuid] = entity);
    Object.values(lEntities).forEach((entity: NoteType | CategoryType) => {
        if (!rEntities[entity.uuid] || entity.updatedAt > rEntities[entity.uuid].updatedAt) {
            entities[entity.uuid] = entity;
            remoteAdd[entity.uuid] = entity;
            updateOperations.push({
                note:             entity,
                isFromLocalStore: true,
                action:           !rEntities[entity.uuid] ? ADD_NEW_NOTE_OPERATION : UPDATE_NEW_NOTE_OPERATION,
            });
        } else {
            entities[entity.uuid] = rEntities[entity.uuid];
            localAdd[entity.uuid] = entity;
        }
    });
    Object.values(rEntities).forEach((entity: NoteType | CategoryType) => {
        if (!lEntities[entity.uuid] || entity.updatedAt > lEntities[entity.uuid].updatedAt) {
            entities[entity.uuid] = entity;
            localAdd[entity.uuid] = entity;
            updateOperations.push({
                note:             entity,
                isFromLocalStore: false,
                action:           !lEntities[entity.uuid] ? ADD_NEW_NOTE_OPERATION : UPDATE_NEW_NOTE_OPERATION,
            });
        } else {
            entities[entity.uuid] = lEntities[entity.uuid];
            remoteAdd[entity.uuid] = entity;
        }
    });

    const mergedIndex = Object.values(entities);// .sort(sortEntities);
    console.info('MERGED STATUS', mergedIndex, updateOperations);
    return {mergedIndex, updateOperations};
};
