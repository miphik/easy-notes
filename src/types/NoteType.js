// @flow

export type NoteType = {
    uuid: string,
    categoryUUID: string,
    title: string,
    tags: Array<string>,
    noteType: 'TEXT' | 'HTML' | 'MARKDOWN' | 'CODE',
    updatedAt: string,
    createdAt: string,
    isDeleted: boolean,
};

export type CategoryType = {
    uuid: string,
    parentUUID: Array<CategoryType>,
    title: string,
    description: string,
    updatedAt: string,
    createdAt: string,
    isDeleted: boolean,
};

export type NotesType = {
    notes: Array<NoteType>,
};
export type NotificationServiceType = {
    showNotification: (title: string, text: string, ff: boolean) => void
};
export type CategoriesType = {
    categories: Array<CategoryType>,
};
