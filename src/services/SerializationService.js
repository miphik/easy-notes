// @flow
import {load, Root} from 'protobufjs';
import type {
    CategoriesType, CategoryType, NotesType, NoteType,
} from 'types/NoteType';

const zlib = require('zlib');

const NoteMessage = null;
const NoteFullMessage = null;
const NotesListMessage = null;

const CategoryMessage = null;
const CategoriesListMessage = null;

export type SerializationServiceType = {
    convertNotesListToString: (notes: Array<NoteType>) => string,
    convertStringToNotesList: (data: string) => Array<NoteType>,
    convertCategoriesListToString: (categories: Array<CategoryType>) => string,
    convertStringToCategoriesList: (data: string) => Array<CategoryType>,
    convertNoteToString: (note: NoteType) => string,
    convertStringToNote: (data: string) => NoteType,
};

class SerializationService {
    static init = (accomplish: () => {}) => {
        /* load('proto/note.proto', (err: Error, root: Root) => {
            if (err) throw err;

            NoteMessage = root.lookupType('easy_note.Note');
            NoteFullMessage = root.lookupType('easy_note.NoteFull');
            NotesListMessage = root.lookupType('easy_note.NotesList');

            CategoryMessage = root.lookupType('easy_note.Category');
            CategoriesListMessage = root.lookupType('easy_note.CategoriesList');
            /!* const message = AwesomeMessage.create({awesomeField: 'hello'});
            console.log(`message = ${JSON.stringify(message)}`);

            const buffer = AwesomeMessage.encode(message).finish();
            console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

            const decoded = AwesomeMessage.decode(buffer);
            console.log(`decoded = ${JSON.stringify(decoded)}`);*!/
        });*/
        accomplish();
    };

    static convertNoteToString = (note: NoteType): string => {
        if (note.text && typeof note.text !== 'string') note.text = JSON.stringify(note.text);
        return zlib.deflateSync(JSON.stringify(note)).toString('base64');
    };

    static convertStringToNote = (data: string): NoteType => {
        if (data === '' || data.length < 5) return {};
        return JSON.parse(zlib.inflateSync(Buffer.from(data, 'base64')).toString());
    };

    static convertNotesListToString = (notes: NotesType): string => {
        const notesList = notes.map((note: NoteType) => {
            const newNote = {...note};
            newNote.text = '';
            newNote.history = [];
            return newNote;
        });
        return zlib.deflateSync(JSON.stringify(notesList)).toString('base64');
    };

    static convertStringToNotesList = (data: string): NotesType => {
        if (data === '' || data.length < 5) return [];
        return JSON.parse(zlib.inflateSync(Buffer.from(data, 'base64')).toString());
    };

    static convertCategoriesListToString = (categories: CategoriesType) => zlib.deflateSync(JSON.stringify(categories)).toString('base64');

    static convertStringToCategoriesList = (data: string): CategoriesType => {
        if (data === '' || data.length < 5) return [];
        return JSON.parse(zlib.inflateSync(Buffer.from(data, 'base64')).toString());
    };
}

export default SerializationService;
