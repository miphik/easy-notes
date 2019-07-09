// @flow
import type {
    CategoriesType, CategoryType, NotesType, NoteType,
} from 'types/NoteType';

export type StoreType = {
    isClientInitialized: () => boolean,
    saveNotesList: (data: Array<NoteType>, error: (err: Error) => void, success: () => void) => void,
    saveCategoriesList: (data: Array<CategoryType>, error: (err: Error) => void, success: () => void) => void,
    getNotesList: (error: (err: Error) => void, success: (notes: NotesType) => void) => Array<NoteType>,
    getNote: (note: NoteType, error: (err: Error) => void, success: (note: NoteType) => void) => NoteType,
    saveNote: (note: NoteType, error: (err: Error) => void, success: () => void, createNoteDir: boolean) => void,
    createNoteDir: (note: NoteType, error: (err: Error) => void, success: () => void) => void,
    createNotesDir: (notes: Array<NoteType>, error: (err: Error) => void, success: () => void) => void,
    getCategoriesList: (
        error: (err: Error) => void,
        success: (categories: CategoriesType) => void
    ) => Array<CategoryType>,
};
