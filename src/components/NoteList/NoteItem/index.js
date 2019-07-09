// @flow
import {Input, Tooltip} from 'antd';
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

const STYLES = memoizeOne((theme: ThemeType, noteIsDragging: boolean, noteIsSelected: boolean) => (
    {
        container: {
            cursor:       'pointer',
            background:   'transparent',
            border:       noteIsDragging ? '1px dashed gray' : '1px solid transparent',
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
        item: {
            display:                'flex',
            cursor:                 'pointer',
            height:                 theme.measure.rowCategoryHeight,
            alignItems:             'center',
            border:                 '1px dashed transparent',
            borderTopLeftRadius:    '0.25em',
            borderBottomLeftRadius: '0.25em',
            overflow:               'hidden',
            ':hover':               {
                color: theme.color.white,
            },
        },
        toolbarButton: {
            marginRight: '0.5em',
            marginLeft:  '0.4em',
            fontSize:    '1.1em',
        },
        overItem: {
            border: '1px dashed white',
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
            note, onSelectNode, noteIsDragging, noteIsEditing, noteIsSelected, theme,
        } = this.props;

        const {noteTitle} = this.state;
        const style = STYLES(theme, noteIsDragging, noteIsSelected);
        const selectedAndEdit = noteIsEditing && noteIsSelected;

        return (
            <div
                className={styles.container}
                style={{...style.container, ...style.selectedItem}}
                onClick={onSelectNode(note)}
            >
                {selectedAndEdit ? (
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
                    <div>
                        {note.title}
                    </div>
                )}
                <Tooltip mouseEnterDelay={0.4} title={moment(note.updatedAt).format()}>
                    <div style={style.date} className={styles.date}>{moment(note.updatedAt).format('lll')}</div>
                </Tooltip>
            </div>
        );
    }
}
