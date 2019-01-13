import {mergeIndex} from 'services/MergeService';

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
        uuid:       'ba31020c-77b7-4c4e-85dd-acb00e781031',
        parentUuid: '2b2a6ee6-11f5-42c2-8c42-7e92f5655648',
        title:      'Veniam dolor consequat et sint proident velit fugiat do in.',
        tags:       [
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
        uuid:       '934bd087-842a-4285-89e6-f7d70b2dd8b8',
        parentUuid: 'b37e8534-0492-431b-9ecb-a97caf40f350',
        title:      'Mollit sunt aliqua eu in magna officia duis dolore esse.',
        tags:       [
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
        uuid:       'ae141995-df1e-468a-bda7-964533aedc2e',
        parentUuid: '8c64ef70-55db-4625-bc36-86be7e0fd1c6',
        title:      'Cupidatat dolore est ex Lorem eiusmod do duis ullamco dolor.',
        tags:       [
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
        uuid:       'ba31020c-77b7-4c4e-85dd-acb00e781031',
        parentUuid: '48fefcf1-e3c0-4645-b7e9-91007cbf0b4b',
        title:      'Non cupidatat sunt fugiat tempor ullamco aute in adipisicing cupidatat esse amet minim.',
        tags:       [
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
];

const emptyResult = {updateOperations: [], mergedIndex: []};
const result = {
    updateOperations: [],
    mergedIndex:      [
        ...remoteNotesList,
        ...localeNotesList.slice().splice(1, 2),
    ],
};

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
});
