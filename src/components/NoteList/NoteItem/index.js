// @flow
import * as React from 'react';
import type {NoteType} from 'types/NoteType';

type PropsType = {
    note: NoteType,
    noteIsSelected: boolean,
    onSelectNode: (note: NoteType) => void,
};

export default class NoteItem extends React.Component<PropsType> {
    render() {
        const {
            note, onSelectNode, noteIsSelected,
        } = this.props;
        console.log(2222, this.props);
        return (
            <div
                onClick={onSelectNode(note)}
                style={noteIsSelected ? {color: 'red'} : {}}
            >
                {note.title}
            </div>
        );
    }
}
