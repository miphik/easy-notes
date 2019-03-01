// @flow
import 'babel-polyfill';
import {mergeIndex} from 'services/MergeService';
import {ADD_NEW_NOTE_OPERATION, UPDATE_NEW_NOTE_OPERATION} from 'services/SyncService';
import type {NoteType} from 'types/NoteType';

jest.mock(
    'electron-json-storage',
    () => (
        {
            doSomething: jest.fn(),
        }
    ),
);

const localeNotesList = [
    {
        uuid:          'ba31020c-77b7-4c4e-85dd-acb00e781031',
        categoryUUIDs: ['2b2a6ee6-11f5-42c2-8c42-7e92f5655648'],
        title:         'Veniam dolor consequat et sint proident velit fugiat do in.',
        tags:          [
            'minim',
            'eiusmod',
            'velit',
            'nulla',
            'enim',
        ],
        noteType:  'TEXT',
        updatedAt: '2018-04-30T10:54:50+00:00',
        createdAt: '2017-08-24T09:26:38+00:00',
        isDeleted: false,
    },
    {
        uuid:          '934bd087-842a-4285-89e6-f7d70b2dd8b8',
        categoryUUIDs: ['b37e8534-0492-431b-9ecb-a97caf40f350'],
        title:         'Mollit sunt aliqua eu in magna officia duis dolore esse.',
        tags:          [
            'aliquip',
            'in',
            'amet',
            'ullamco',
            'et',
        ],
        noteType:  'HTML',
        updatedAt: '2018-04-11T04:00:44+00:00',
        createdAt: '2015-09-18T22:28:08+00:00',
        isDeleted: true,
    },
    {
        uuid:          'ae141995-df1e-468a-bda7-964533aedc2e',
        categoryUUIDs: ['8c64ef70-55db-4625-bc36-86be7e0fd1c6'],
        title:         'Cupidatat dolore est ex Lorem eiusmod do duis ullamco dolor.',
        tags:          [
            'do',
            'consectetur',
            'Lorem',
            'ea',
            'sit',
        ],
        noteType:  'CODE',
        updatedAt: '2015-06-16T07:19:31+00:00',
        createdAt: '2014-01-18T09:52:22+00:00',
        isDeleted: true,
    },
];

const remoteNotesList = [
    {
        uuid:          'ba31020c-77b7-4c4e-85dd-acb00e781031',
        categoryUUIDs: ['48fefcf1-e3c0-4645-b7e9-91007cbf0b4b'],
        title:         'Non cupidatat sunt fugiat tempor ullamco aute in adipisicing cupidatat esse amet minim.',
        tags:          [
            'et',
            'ad',
            'non',
            'sint',
            'nostrud',
        ],
        noteType:  'HTML',
        updatedAt: '2019-01-13T21:45:10+00:00',
        createdAt: '2019-01-13T21:45:10+00:00',
        isDeleted: true,
    },
    {
        uuid:          'b5c968df-f0b2-4ac9-8aa0-228b9d4be280',
        categoryUUIDs: ['e22345a0-58c9-43e7-b4eb-9646aef53996'],
        title:         'Laboris aliquip nisi consectetur esse enim occaecat.',
        tags:          [
            'nisi',
            'dolor',
            'laboris',
            'ad',
            'qui',
        ],
        noteType:  'CODE',
        updatedAt: '2018-04-11T04:00:44+00:00',
        createdAt: '2015-09-18T22:28:08+00:00',
        isDeleted: false,
    },
];

const remoteNotesList2 = [
    {
        uuid:          'b5c968df-f0b2-4ac9-8aa0-228b9d4be280',
        categoryUUIDs: ['e22345a0-58c9-43e7-b4eb-9646aef53996'],
        title:         'Laboris aliquip nisi consectetur esse enim occaecat.',
        tags:          [
            'nisi',
            'dolor',
            'laboris',
            'ad',
            'qui',
        ],
        noteType:  'CODE',
        updatedAt: '2018-04-11T04:00:44+00:00',
        createdAt: '2015-09-18T22:28:08+00:00',
        isDeleted: false,
    },
    {
        uuid:          'ba31020c-77b7-4c4e-85dd-acb00e781031',
        categoryUUIDs: ['48fefcf1-e3c0-4645-b7e9-91007cbf0b4b'],
        title:         'Non cupidatat sunt fugiat tempor ullamco aute in adipisicing cupidatat esse amet minim.',
        tags:          [
            'et',
            'ad',
            'non',
            'sint',
            'nostrud',
        ],
        noteType:  'HTML',
        updatedAt: '2016-01-13T21:45:10+00:00',
        createdAt: '2016-01-13T21:45:10+00:00',
        isDeleted: true,
    },
];

const emptyResult = {updateOperations: [], mergedIndex: []};
const result = {
    updateOperations: [
        {action: UPDATE_NEW_NOTE_OPERATION, isFromLocalStore: true, note: remoteNotesList[0]},
        {action: ADD_NEW_NOTE_OPERATION, isFromLocalStore: true, note: remoteNotesList[1]},
        {action: ADD_NEW_NOTE_OPERATION, isFromLocalStore: false, note: localeNotesList[1]},
        {action: ADD_NEW_NOTE_OPERATION, isFromLocalStore: false, note: localeNotesList[2]},
    ],
    mergedIndex: [
        ...remoteNotesList,
        ...localeNotesList.slice().splice(1, 2),
    ],
};
// result.mergedIndex.sort((in1: NoteType, in2: NoteType) => in2.updatedAt.localeCompare(in1.updatedAt));

const result2 = {
    updateOperations: [
        {action: ADD_NEW_NOTE_OPERATION, isFromLocalStore: true, note: remoteNotesList2[0]},
        {action: UPDATE_NEW_NOTE_OPERATION, isFromLocalStore: false, note: localeNotesList[0]},
        {action: ADD_NEW_NOTE_OPERATION, isFromLocalStore: false, note: localeNotesList[1]},
        {action: ADD_NEW_NOTE_OPERATION, isFromLocalStore: false, note: localeNotesList[2]},
    ],
    mergedIndex: [
        ...remoteNotesList2.slice().splice(0, 1),
        ...localeNotesList,
    ],
};
// result2.mergedIndex.sort((in1: NoteType, in2: NoteType) => in2.updatedAt.localeCompare(in1.updatedAt));

describe('Check calculate merged index', () => {
    test('Without parameters', () => {
        expect(mergeIndex()).toEqual(emptyResult);
    });

    test('Empty parameters', () => {
        expect(mergeIndex([], [])).toEqual(emptyResult);
    });

    test('Check with both correct parameters', () => {
        expect(mergeIndex(localeNotesList, remoteNotesList))
            .toEqual(result);
    });

    test('Check with both correct parameters second', () => {
        expect(mergeIndex(localeNotesList, remoteNotesList2))
            .toEqual(result2);
    });
});
