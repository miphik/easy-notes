// @flow
import {Input} from 'antd';
import * as React from 'react';
import type {NoteType} from 'types/NoteType';
import memoizeOne from 'memoize-one';
import type {ThemeType} from 'stores/ThemeStore';
import Color from 'color';
import moment from 'moment';
import styles from './styles.styl';

type PropsType = {
    note: NoteType,
    noteIsSelected: boolean,
    noteIsEditing: boolean,
    noteIsDragging: boolean,
    onSelectNode: (note: NoteType) => void,
    updateNoteTitle: (noteTitle: string) => void,
};

const STYLES = memoizeOne((theme: ThemeType, noteIsDragging: boolean, noteIsSelected: boolean, isOver: boolean) => (
    {
        containerWrapper: {
            display:         'flex',
            cursor:          noteIsDragging ? (isOver ? 'copy' : 'grabbing') : 'pointer',
            flex:            1,
            backgroundColor: noteIsDragging ? Color(theme.color.second).alpha(0.1) : theme.color.second,
            border:          noteIsDragging ? '1px dashed gray' : '1px solid transparent',
        },
        container: {
            background:   'transparent',
            outline:      'none',
            boxShadow:    'none',
            marginLeft:   '0',
            borderBottom: `1px solid ${theme.isBlack
                ? Color(theme.color.second).lighten(0.4)
                : Color(theme.color.second).darken(0.4)}`,
        },
        date: {
            color: theme.color.button,
        },
        selectionMark: {
            position:        'relative',
            display:         'inline-block',
            flex:            '0 0 auto',
            width:           '0.25em',
            backgroundColor: noteIsSelected ? theme.color.marker : 'transparent',
        },
        selectedItem: {
            backgroundColor: noteIsSelected ? Color(theme.color.textMain).alpha(0.2) : 'transparent',
        },
    }
));

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
            note, onSelectNode, noteIsDragging, noteIsEditing, noteIsSelected, theme, isOver,
        } = this.props;

        const {noteTitle} = this.state;
        const style = STYLES(theme, noteIsDragging, noteIsSelected, isOver);
        const selectedAndEdit = noteIsEditing && noteIsSelected;

        return (
            <div style={style.containerWrapper}>
                <div style={style.selectionMark}/>
                <div
                    className={styles.container}
                    style={{...style.container, ...style.selectedItem}}
                    onClick={onSelectNode(note)}
                >
                    {selectedAndEdit ? (
                        <div>
                            <Input
                                style={{
                                    background:    'transparent',
                                    color:         'white',
                                    border:        'none',
                                    outline:       'none',
                                    boxShadow:     'none',
                                    marginLeft:    -11,
                                    paddingTop:    0,
                                    paddingBottom: 0,
                                    height:        '1.572em',
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
                        <div>
                            {note.title}
                        </div>
                    )}
                    <div style={style.date} className={styles.date}>{moment(note.updatedAt).format('lll')}</div>
                </div>
            </div>
        );
    }
}
