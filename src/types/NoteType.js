// @flow

export type NoteType = {
    uuid: string,
    categoryUuid: string,
    title: string,
    tags: Array<string>,
    noteType: 'TEXT' | 'HTML' | 'MARKDOWN' | 'CODE',
    updatedAt: string,
    createdAt: string,
    isDeleted: boolean,
};

export type CategoryType = {
    uuid: string,
    parentUuid: string,
    title: string,
    description: string,
    updatedAt: string,
    createdAt: string,
    isDeleted: boolean,
};
