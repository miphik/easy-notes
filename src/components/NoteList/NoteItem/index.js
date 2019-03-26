// @flow
import {Input} from 'antd';
import * as React from 'react';
import type {NoteType} from 'types/NoteType';

type PropsType = {
    note: NoteType,
    noteIsSelected: boolean,
    noteIsEditing: boolean,
    noteIsDragging: boolean,
    onSelectNode: (note: NoteType) => void,
    updateNoteTitle: (noteTitle: string) => void,
};

export default class NoteItem extends React.PureComponent<PropsType> {
    state = {
        noteTitle: null,
    };

    handleKeyPress = event => {
        const isEscape = event.key === 'Escape';
        if (event.key === 'Enter' || isEscape) {
            const {noteIsEditing, noteIsSelected, updateNoteTitle} = this.props;
            const {noteTitle} = this.state;
            if (noteIsEditing
                && noteIsSelected
                && (
                    noteTitle || noteTitle === null || isEscape
                )) {
                this.setState({noteTitle: null});
                event.preventDefault();
                updateNoteTitle(isEscape ? null : noteTitle);
            }
        }
    };

    onChangeNoteTitle = event => this.setState({noteTitle: event.currentTarget.value});

    editCancel = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({noteTitle: null});
        const {updateNoteTitle} = this.props;
        updateNoteTitle(null);
    };

    render() {
        const {
            note, onSelectNode, noteIsDragging, noteIsEditing, noteIsSelected,
        } = this.props;
        const {noteTitle} = this.state;
        const style = {
            display:    'flex',
            alignItems: 'center',
        };
        if (noteIsDragging) {
            style.border = '1px dashed gray';
        }
        if (noteIsSelected) {
            style.color = 'red';
        }

        return (
            <React.Fragment>
                {noteIsEditing && noteIsSelected ? (
                    <div>
                        <Input
                            style={{
                                background: 'transparent',
                                color:      'white',
                                border:     'none',
                                outline:    'none',
                                boxShadow:  'none',
                                marginLeft: -11,
                            }}
                            autoFocus
                            onBlur={this.editCancel}
                            onKeyDown={this.handleKeyPress}
                            onChange={this.onChangeNoteTitle}
                            value={noteTitle || note.title}
                            defaultValue={note.title}
                        />
                    </div>
                ) : (
                    <div
                        onClick={onSelectNode(note)}
                        style={style}
                    >
                        {note.title}
                    </div>
                )}
            </React.Fragment>
        );
    }
}
