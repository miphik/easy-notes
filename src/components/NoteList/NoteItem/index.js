// @flow
import * as React from 'react';
import type {NoteType} from 'types/NoteType';

type PropsType = {
    note: NoteType,
    noteIsSelected: boolean,
    noteIsDragging: boolean,
    onSelectNode: (note: NoteType) => void,
};

export default class NoteItem extends React.PureComponent<PropsType> {
    render() {
        const {
            note, onSelectNode, noteIsSelected, noteIsDragging,
        } = this.props;
        const style = {};
        if (noteIsDragging) {
            style.border = '1px dashed gray';
        }
        if (noteIsSelected) {
            style.color = 'red';
        }
        return (
            <div
                onClick={onSelectNode(note)}
                style={style}
            >
                {note.title}
            </div>
        );
    }
}
