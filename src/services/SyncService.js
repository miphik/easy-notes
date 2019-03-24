// @flow
import {Button, Modal} from 'antd';
import isEqual from 'lodash/isEqual';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {formatMessageIntl} from 'services/LocaleService';
import LocalStoreService from 'services/LocalStoreService';
import {mergeIndex} from 'services/MergeService';
import {showNotification} from 'services/NotificationService';
import RemoteStoreService from 'services/RemoteStoreService';
import type {CategoryType, NoteType} from 'src/types/NoteType';
import type {CategoriesType, NotesType, NotificationServiceType} from 'types/NoteType';
import type {StoreType} from 'types/StoreType';
import {emptyFunc} from 'utils/General';

export const ADD_NEW_NOTE_OPERATION = 'ADD';
export const UPDATE_NEW_NOTE_OPERATION = 'UPDATE';
export const DELETE_NEW_NOTE_OPERATION = 'DELETE';
const MESSAGES = {
    localNoteNotFound: (noteUUID: string) => (
        <Fm
            id="syncRemoteAndLocalData.localNoteNotFound"
            defaultMessage="Can't read local note with UUID: {noteUUID}"
            values={{noteUUID}}
        />
    ),
    remoteNoteNotFound: (noteUUID: string) => (
        <Fm
            id="syncRemoteAndLocalData.remoteNoteNotFound"
            defaultMessage="Can't read remote note with UUID: {noteUUID}"
            values={{noteUUID}}
        />
    ),
    localWriteNoteError: <Fm
        id="syncRemoteAndLocalData.localWriteNoteError"
        defaultMessage="Can't write local note"
    />,
    remoteWriteNoteError: <Fm
        id="syncRemoteAndLocalData.remoteWriteNoteError"
        defaultMessage="Can't write remote note"
    />,
    localReadNotesError: <Fm
        id="syncRemoteAndLocalData.localReadNotesError"
        defaultMessage="Can't read local notes"
    />,
    localReadCategoriesError: <Fm
        id="syncRemoteAndLocalData.localReadCategoriesError"
        defaultMessage="Can't read local categories"
    />,
    remoteReadNotesError: <Fm
        id="syncRemoteAndLocalData.remoteReadNotesError"
        defaultMessage="Can't read remote notes"
    />,
    remoteReadCategoriesError: <Fm
        id="syncRemoteAndLocalData.remoteReadCategoriesError"
        defaultMessage="Can't read remote categories"
    />,
    localDeleteNoteError: (noteUUID: string) => (
        <Fm
            id="syncRemoteAndLocalData.localDeleteNoteError"
            defaultMessage="Can't delete local note with UUID: {noteUUID}"
            values={{noteUUID}}
        />
    ),
    remoteDeleteNoteError: (noteUUID: string) => (
        <Fm
            id="syncRemoteAndLocalData.remoteDeleteNoteError"
            defaultMessage="Can't delete remote note with UUID: {noteUUID}"
            values={{noteUUID}}
        />
    ),
};
const {info} = Modal;

let remoteStorageService: StoreType = RemoteStoreService;
let localStorageService: StoreType = LocalStoreService;
let notificationService: NotificationServiceType = {showNotification};

export const setRemoteStorageService = (remoteService: StoreType) => remoteStorageService = remoteService;
export const setLocalStorageService = (localService: StoreType) => localStorageService = localService;
export const setNotificationService = (notifyService: NotificationServiceType) => notificationService = notifyService;

export type UpdateOperationType = {
    note: NoteType,
    isFromLocalStore: boolean,
    action: ADD_NEW_NOTE_OPERATION | UPDATE_NEW_NOTE_OPERATION | DELETE_NEW_NOTE_OPERATION
};

const showMergeConflictDialog = () => {
    info({
        className:        'asdsadsad',
        destroyOnClose:   true,
        okButtonDisabled: true,
        okText:           '',
        onOk:             undefined,
        content:          (
            <Button>
                                  Click to destroy all
            </Button>
        ),
        footer: (
            <div>11`231</div>
        ),
    });
};

const saveNoteToStore = (
    fromStore: StoreType,
    toStore: StoreType,
    note: NoteType, isFromLocalStore: boolean,
    errorCallback: (errors: Array<Error>) => {} = () => {},
) => {
    fromStore.getNote(
        note,
        errorCallback,
        (noteFull: NoteType) => {
            toStore.saveNote(
                noteFull,
                errorCallback,
                emptyFunc,
                false,
            );
        },
    );
};

const syncData = (
    remoteNotes: Array<NoteType> = [],
    localNotes: Array<NoteType> = [],
    successCallback: () => {} = () => {},
    errorCallback: (errors: Array<Error>) => {} = () => {},
) => {
    if (!remoteNotes.length && localNotes.length) {
        const errors = [];
        const setError = (err: Error) => errors.push(err);
        remoteStorageService.createNotesDir(localNotes, setError, () => {
            localNotes.forEach((note: NoteType) => saveNoteToStore(
                localStorageService, remoteStorageService, note, true, setError,
            ));
            // @TODO just hack to caught promise errors, change later
            setTimeout(() => {
                remoteStorageService.saveNotesList(localNotes, setError);
                successCallback(localNotes);
                if (errors.length) errorCallback(errors);
            }, 2000);
        });
    } else if (remoteNotes.length && !localNotes.length) {
        const errors = [];
        const setError = (err: Error) => errors.push(err);
        localStorageService.createNotesDir(remoteNotes, setError, () => {
            remoteNotes.forEach((note: NoteType) => saveNoteToStore(
                remoteStorageService, localStorageService, note, false, setError,
            ));
            // @TODO just hack to caught promise errors, change later
            setTimeout(() => {
                localStorageService.saveNotesList(remoteNotes, setError);
                successCallback(remoteNotes);
                if (errors.length) errorCallback(errors);
            }, 2000);
        });
    } else if (remoteNotes.length && localNotes.length) {
        const errors = [];
        const {mergedIndex, updateOperations} = mergeIndex(remoteNotes, localNotes);
        updateOperations.forEach((operation: UpdateOperationType) => {
            const fromStore = operation.isFromLocalStore ? localStorageService : remoteStorageService;
            const toStore = operation.isFromLocalStore ? remoteStorageService : localStorageService;
            switch (operation.action) {
                case UPDATE_NEW_NOTE_OPERATION:
                case ADD_NEW_NOTE_OPERATION: {
                    fromStore.getNote(
                        operation.note,
                        (err: Error) => errors.push(err),
                        (note: NoteType) => toStore.saveNote(note, (err: Error) => errors.push(err)),
                    );
                    break;
                }
                case DELETE_NEW_NOTE_OPERATION: {
                    toStore.deleteNote(operation.note, (err: Error) => {
                        notificationService.showNotification(
                            formatMessageIntl(
                                operation.isFromLocalStore
                                    ? MESSAGES.localDeleteNoteError(operation.note.uuid)
                                    : MESSAGES.remoteDeleteNoteError(operation.note.uuid),
                                err.toString(),
                                {
                                    type:     'error',
                                    duration: 10,
                                },
                            ),
                        );
                    });
                    break;
                }
                default:
                    throw new Error(`Something went wrong, there is no any action with type: ${operation.action}`);
            }
        });
        if (errors.length) errorCallback(errors);
        else {
            remoteStorageService.saveNotesList(mergedIndex);
            localStorageService.saveNotesList(mergedIndex);
        }
        successCallback(mergedIndex);
    }
};

const syncCategoriesData = (
    remoteCategories: Array<CategoryType> = [],
    localCategories: Array<CategoryType> = [],
    successCallback: () => {} = () => {},
) => {
    if (!remoteCategories.length && localCategories.length) {
        remoteStorageService.saveCategoriesList(localCategories);
        successCallback(localCategories);
    } else if (remoteCategories.length && !localCategories.length) {
        localStorageService.saveCategoriesList(remoteCategories);
        successCallback(remoteCategories);
    } else if (remoteCategories.length && localCategories.length) {
        const {mergedIndex} = mergeIndex(remoteCategories, localCategories);
        if (!isEqual(mergedIndex, remoteCategories)) {
            remoteStorageService.saveCategoriesList(mergedIndex);
        }
        if (!isEqual(mergedIndex, localCategories)) {
            localStorageService.saveCategoriesList(mergedIndex);
        }
        successCallback(mergedIndex);
    } else {
        successCallback([]);
    }
};

export const loadLocalCategories = (
    successCallback: () => {} = () => {},
    errorCallback: (errors: Array<Error>) => {} = () => {},
) => {
    localStorageService.getCategoriesList(
        (err: Error) => errorCallback(err),
        (localCategories: CategoriesType) => successCallback(localCategories.categories),
    );
};

export const loadLocalNotes = (
    successCallback: () => {} = () => {},
    errorCallback: (errors: Array<Error>) => {} = () => {},
) => {
    localStorageService.getNotesList(
        (err: Error) => errorCallback([err]),
        (localNotes: NotesType) => successCallback(localNotes.notes),
    );
};

export const syncRemoteAndLocalCategories = (
    successCallback: () => {} = () => {},
    errorCallback: (errors: Array<Error>) => {} = () => {},
) => {
    remoteStorageService.getCategoriesList(
        (err: Error) => errorCallback([err]),
        (remoteCategories: CategoriesType) => {
            localStorageService.getCategoriesList(
                (err: Error) => errorCallback([err]),
                (localCategories: CategoriesType) => syncCategoriesData(
                    remoteCategories.categories,
                    localCategories.categories,
                    successCallback,
                ),
            );
        },
    );
};

export const syncRemoteAndLocalNotes = (
    successCallback: () => {} = () => {},
    errorCallback: (errors: Array<Error>) => {} = () => {},
) => {
    remoteStorageService.getNotesList((err: Error) => errorCallback([err]), (remoteNotes: NotesType) => {
        localStorageService.getNotesList(
            (err: Error) => errorCallback([err]),
            (localNotes: NotesType) => syncData(remoteNotes.notes, localNotes.notes, successCallback, errorCallback),
        );
    });
};
