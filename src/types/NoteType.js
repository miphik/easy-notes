// @flow

export type NoteType = {
    uuid: string,
    parentUuid: string,
    title: string,
    tags: Array<string>,
    noteType: 'TEXT' | 'HTML' | 'MARKDOWN' | 'CODE',
    updatedAt: string,
    createdAt: string,
    isDeleted: boolean,
};
