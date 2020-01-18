// @flow
import type {CategoryType, NoteType} from 'types/NoteType';

export const categoryComparator = (a: CategoryType, b: CategoryType) => a.orderNumber - b.orderNumber;
export const sortEntities = (noteA: NoteType, noteB: NoteType) => noteB.updatedAt.localeCompare(noteA.updatedAt);
