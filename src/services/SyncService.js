// @flow
import {Button, Modal} from 'antd';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {formatMessageIntl} from 'services/LocaleService';
import type {LocalStoreType} from 'services/LocalStoreService';
import LocalStoreService from 'services/LocalStoreService';
import {mergeIndex} from 'services/MergeService';
import {showNotification} from 'services/NotificationService';
import type {RemoteStoreType} from 'services/RemoteStoreService';
import RemoteStoreService from 'services/RemoteStoreService';
import type {CategoryType, NoteType} from 'src/types/NoteType';

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

type NotesType = {
    notes: Array<NoteType>,
};
type NotificationServiceType = {
    showNotification: (title: string, text: string, ff: boolean) => void
};
type CategoriesType = {
    categories: Array<CategoryType>,
};

let remoteStorageService: RemoteStoreType = RemoteStoreService;
let localStorageService: LocalStoreType = LocalStoreService;
let notificationService: NotificationServiceType = {showNotification};

export const setRemoteStorageService = (remoteService: RemoteStoreType) => remoteStorageService = remoteService;
export const setLocalStorageService = (localService: LocalStoreType) => localStorageService = localService;
export const setNotificationService = (notifyService: NotificationServiceType) => notificationService = notifyService;

export type UpdateOperationType = {
    uuid: string,
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

const syncData = (remoteNotes: Array<NoteType> = [], localNotes: Array<NoteType> = []) => {
    if (!remoteNotes.length && !localNotes.length) {
        remoteStorageService.saveNotesList([]);
        localStorageService.saveNotesList([]);
    } else if (!remoteNotes.length && localNotes.length) {
        remoteStorageService.saveNotesList(localNotes);
    } else if (remoteNotes.length && !localNotes.length) {
        localStorageService.saveNotesList(remoteNotes);
    } else {
        const {mergedIndex, updateOperations} = mergeIndex(remoteNotes, localNotes);
        updateOperations.forEach((operation: UpdateOperationType) => {
            const fromStore = operation.isFromLocalStore ? localStorageService : remoteStorageService;
            const toStore = operation.isFromLocalStore ? remoteStorageService : localStorageService;
            switch (operation.action) {
                case UPDATE_NEW_NOTE_OPERATION:
                case ADD_NEW_NOTE_OPERATION: {
                    fromStore.readNote(operation.uuid, (err: Error) => {
                        notificationService.showNotification(
                            formatMessageIntl(operation.isFromLocalStore
                                ? MESSAGES.localNoteNotFound(operation.uuid)
                                : MESSAGES.remoteNoteNotFound(operation.uuid)),
                            err.toString(),
                            {
                                type:     'error',
                                duration: 10,
                            },
                        );
                    }, (note: NoteType) => {
                        toStore.writeNote(note, (err: Error) => {
                            notificationService.showNotification(
                                formatMessageIntl(
                                    operation.isFromLocalStore
                                        ? MESSAGES.localWriteNoteError
                                        : MESSAGES.remoteWriteNoteError,
                                    err.toString(),
                                    {
                                        type:     'error',
                                        duration: 10,
                                    },
                                ),
                            );
                        });
                    });
                    break;
                }
                case DELETE_NEW_NOTE_OPERATION: {
                    toStore.deleteNote(operation.uuid, (err: Error) => {
                        notificationService.showNotification(
                            formatMessageIntl(
                                operation.isFromLocalStore
                                    ? MESSAGES.localDeleteNoteError(operation.uuid)
                                    : MESSAGES.remoteDeleteNoteError(operation.uuid),
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
        remoteStorageService.saveNotesList(mergedIndex);
        localStorageService.saveNotesList(mergedIndex);
    }
};

const syncCategoriesData = (remoteCategories: Array<CategoryType> = [], localCategories: Array<CategoryType> = []) => {
    if (!remoteCategories.length && !localCategories.length) {
        remoteStorageService.saveCategoriesList([]);
        localStorageService.saveCategoriesList([]);
    } else if (!remoteCategories.length && localCategories.length) {
        remoteStorageService.saveCategoriesList(remoteCategories);
    } else if (remoteCategories.length && !localCategories.length) {
        localStorageService.saveCategoriesList(remoteCategories);
    } else {
        const {mergedIndex} = mergeIndex(remoteCategories, localCategories);
        remoteStorageService.saveCategoriesList(mergedIndex);
        localStorageService.saveCategoriesList(mergedIndex);
    }
};

export const loadLocalData = () => {
    localStorageService.getCategoriesList(
        (err: Error) => {
            notificationService.showNotification(
                formatMessageIntl(
                    MESSAGES.localReadCategoriesError,
                    err.toString(),
                    {
                        type:     'error',
                        duration: 10,
                    },
                ),
            );
        },
        (localCategories: CategoriesType) => {},
    );
    localStorageService.getNotesList(
        (err: Error) => {
            notificationService.showNotification(
                formatMessageIntl(
                    MESSAGES.localReadNotesError,
                    err.toString(),
                    {
                        type:     'error',
                        duration: 10,
                    },
                ),
            );
        },
        (localNotes: NotesType) => {},
    );
};

export const syncRemoteAndLocalData = () => {
    // Sync categories
    remoteStorageService.getCategoriesList((err: Error) => {
        notificationService.showNotification(
            formatMessageIntl(
                MESSAGES.remoteReadCategoriesError,
                err.toString(),
                {
                    type:     'error',
                    duration: 10,
                },
            ),
        );
    }, (remoteCategories: CategoriesType) => {
        localStorageService.getCategoriesList(
            (err: Error) => {
                notificationService.showNotification(
                    formatMessageIntl(
                        MESSAGES.localReadCategoriesError,
                        err.toString(),
                        {
                            type:     'error',
                            duration: 10,
                        },
                    ),
                );
            },
            (localCategories: CategoriesType) => syncCategoriesData(
                remoteCategories.categories,
                localCategories.categories,
            ),
        );
    });

    // Sync notes
    remoteStorageService.getNotesList((err: Error) => {
        notificationService.showNotification(
            formatMessageIntl(
                MESSAGES.remoteReadNotesError,
                err.toString(),
                {
                    type:     'error',
                    duration: 10,
                },
            ),
        );
    }, (remoteNotes: NotesType) => {
        localStorageService.getNotesList((err: Error) => {
            notificationService.showNotification(
                formatMessageIntl(
                    MESSAGES.localReadNotesError,
                    err.toString(),
                    {
                        type:     'error',
                        duration: 10,
                    },
                ),
            );
        }, (localNotes: NotesType) => syncData(remoteNotes.notes, localNotes.notes));
    });
};
