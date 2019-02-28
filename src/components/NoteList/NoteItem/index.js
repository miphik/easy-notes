// @flow
import * as React from 'react';
import type {NoteType} from 'types/NoteType';

type PropsType = {
    note: NoteType,
    noteIsSelected: boolean,
    onSelectNode: (note: NoteType) => void,
};

export default class NoteItem extends React.Component<PropsType> {
    onDragStart = event => {
        const {note} = this.props;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('Text', note.uuid);
        event.dataTransfer.items.add('Text', 'category');
        // event.dataTransfer.setDragImage(event.target, 100, 100);
        return true;
    };

    render() {
        const {
            note, onSelectNode, noteIsSelected,
        } = this.props;
        return (
            <div
                onDragStart={this.onDragStart}
                draggable
                onClick={onSelectNode(note)}
                style={noteIsSelected ? {color: 'red'} : {}}
            >
                {note.title}
            </div>
        );
    }
}
