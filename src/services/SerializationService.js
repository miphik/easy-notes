// @flow
import {load, Root} from 'protobufjs';
import type {CategoryType, NoteType} from 'types/NoteType';

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
    convertNoteToString: (note: NoteType) => string,
    convertStringToNote: (data: string) => NoteType,
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

    static convertNoteToString = (note: NoteType): string => {
        note['.easy_note.NoteFull.text'] = note.text;
        const buffer = NoteMessage.encode(NoteMessage.create(note)).finish();
        return buffer.toString('latin1');
    };

    static convertStringToNote = (data: string): NoteType => {
        if (data === '' || data.length < 5) return {};
        const note = NoteMessage.decode(Buffer.from(data, 'latin1'));
        note.text = note['.easy_note.NoteFull.text'];
        return note;
    };

    static convertNotesListToString = (notes: Array<NoteType>): string => {
        const notesList = NotesListMessage.create({
            notes: notes.map((note: NoteType) => {
                const newNote = {...note};
                newNote.text = '';
                newNote['.easy_note.NoteFull.text'] = '';
                return NoteMessage.create(newNote);
            }),
        });
        const buffer = NotesListMessage.encode(notesList).finish();
        return buffer.toString('latin1');
    };

    static convertStringToNotesList = (data: string): Array<NoteType> => {
        if (data === '' || data.length < 5) return [];
        return NotesListMessage.decode(Buffer.from(data, 'latin1'));
    };

    static convertCategoriesListToString = (categories: Array<CategoryType>) => {
        const categoriesList = CategoriesListMessage.create({
            categories: categories.map((category: CategoryType) => CategoryMessage.create(category)),
        });
        const buffer = CategoriesListMessage.encode(categoriesList).finish();
        return buffer.toString('latin1');
    };

    static convertStringToCategoriesList = (data: string): Array<CategoryType> => {
        if (data === '' || data.length < 5) return [];
        return CategoriesListMessage.decode(Buffer.from(data, 'latin1'));
    };
}

export default SerializationService;
