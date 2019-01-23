// @flow
import {load, Root} from 'protobufjs';
import type {CategoryType, NoteType} from 'types/NoteType';
import LZString from 'lz-string';

let NoteMessage = null;
let NoteFullMessage = null;
let NotesListMessage = null;

let CategoryMessage = null;
let CategoriesListMessage = null;

export type SerializationServiceType = {
    convertNotesListToString: (notes: Array<NoteType>) => string,
    convertStringToNotesList: (data: string) => Array<NoteType>,
    convertCategoriesListToString: (categories: Array<CategoryType>) => string,
    convertStringToCategoriesList: (data: string) => Array<CategoryType>,
};

class SerializationService {
    static init = (accomplish: () => {}) => {
        load('proto/note.proto', (err: Error, root: Root) => {
            if (err) throw err;

            NoteMessage = root.lookupType('easy_note.Note');
            NoteFullMessage = root.lookupType('easy_note.NoteFull');
            NotesListMessage = root.lookupType('easy_note.NotesList');

            CategoryMessage = root.lookupType('easy_note.Category');
            CategoriesListMessage = root.lookupType('easy_note.CategoriesList');
            /* const message = AwesomeMessage.create({awesomeField: 'hello'});
            console.log(`message = ${JSON.stringify(message)}`);

            const buffer = AwesomeMessage.encode(message).finish();
            console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

            const decoded = AwesomeMessage.decode(buffer);
            console.log(`decoded = ${JSON.stringify(decoded)}`);*/
            accomplish();
        });
    };

    static convertNotesListToString = (notes: Array<NoteType>): string => {
        const notesList = NotesListMessage.create({notes: notes.map((note: NoteType) => NoteMessage.create(note))});
        const buffer = NotesListMessage.encode(notesList).finish();
        return LZString.compress(buffer.toString());
    };

    static convertStringToNotesList = (data: string) => NotesListMessage.decode(Buffer.from(LZString.decompress(data)));

    static convertCategoriesListToString = (categories: Array<CategoryType>) => {
        const categoriesList = CategoriesListMessage.create({
            categories: categories.map((category: CategoryType) => CategoryMessage.create(category)),
        });
        const buffer = CategoriesListMessage.encode(categoriesList).finish();
        return LZString.compress(buffer.toString());
    };

    static convertStringToCategoriesList = (data: string) => {
        return CategoriesListMessage.decode(Buffer.from(LZString.decompress(data)));
    };
}

export default SerializationService;
