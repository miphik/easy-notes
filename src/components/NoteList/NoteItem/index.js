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

const STYLES = memoizeOne((theme: ThemeType, noteIsDragging: boolean, noteIsSelected: boolean, isOver: boolean) => {
    const borderColor = theme.isBlack ? Color(theme.color.second).lighten(0.6) : Color(theme.color.second).darken(0.6);
    return (
        {
            containerWrapper: {
                display:                'flex',
                cursor:                 noteIsDragging ? (isOver ? 'copy' : 'grabbing') : 'pointer',
                flex:                   1,
                backgroundColor:        noteIsDragging ? Color(theme.color.second).alpha(0.1) : theme.color.second,
                border:                 noteIsDragging ? '1px dashed gray' : '1px solid transparent',
                borderTopLeftRadius:    '0.25em',
                borderBottomLeftRadius: '0.25em',
                overflow:               'hidden',
            },
            divider: {
                height:     1,
                background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${borderColor} 25%, ${borderColor} 75%, rgba(0,0,0,0) 100%)`,
            },
            container: {
                background: 'transparent',
                outline:    'none',
                boxShadow:  'none',
                marginLeft: '0',
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
    );
});

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
            <>
                <div style={style.containerWrapper}>
                    <div style={style.selectionMark}/>
                    <div
                        className={styles.container}
                        style={{...style.container, ...style.selectedItem}}
                        onClick={onSelectNode(note)}
                    >
                        {/* <Inlinese
                        onSubmit={value => alert(value)}
                        value={note.title}
                        // primaryColor="orange"
                        style={{color: 'transparent'}}
                        secondaryColor="transparent"
                        hoverStyleString="border:none;"
                        roundness="0px"
                        submitText=""
                        showEditIcon={false}
                        showButtons={false}
                        cancelText="No Taco"
                    >
                        {note.title}
                    </Inlinese>*/}
                        {selectedAndEdit ? (
                            <div style={{position: 'relative'}}>
                                <div style={{opacity: 0}}>
                                    {note.title}
                                </div>
                                <Input.TextArea
                                    style={{
                                        background: 'transparent',
                                        color:      'white',
                                        border:     'none',
                                        outline:    'none',
                                        boxShadow:  'none',
                                        padding:    0,
                                        display:    'flex',
                                        // lineHeight: 'calc(100% + 2px)',
                                        flex:       1,
                                        position:   'absolute',
                                        top:        0,
                                        height:     '100%',
                                        // height:        '1.572em',
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
                            <div style={{overflow: 'hidden'}}>
                                {note.title}
                            </div>
                        )}
                        <div style={style.date} className={styles.date}>{moment(note.updatedAt).format('lll')}</div>
                    </div>
                </div>
                <div
                    style={style.divider}
                    onClick={(event: MouseEvent) => {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }}
                />
            </>
        );
    }
}
