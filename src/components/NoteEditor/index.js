// @flow

import debounce from 'lodash/debounce';
import {inject, observer} from 'mobx-react';
import React from 'react';
import ScrollableColumn from 'components/ScrollableColumn';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import Radium, {Style} from 'radium';
import JoditEditor from 'components/Jodit';
import {Jodit} from 'jodit';
import {STYLES, getTextStyles} from './styles';
import styles from './styles.styl';
import {tasklist} from "components/Jodit/plugins/tasklist";

Jodit.plugins.add('codeBlock', tasklist);
Jodit.modules.Dummy = function (editor) {
    this.insertDummyImage = function (w, h, textcolor, bgcolor) {
        /* const t = editor.getInstance('Dialog');
        const html = editor.create.fromHTML('<div><span>Click me to add text to editor </span></div>');

        html.querySelector('span').onclick = function () {
            editor.selection.insertHTML('Add this text on click');
        };
        t.setTitle(editor.i18n('Liste des mots à utiliser')),
        t.setContent(html),
        t.setSize(500, 900),
        t.open();*/
        console.log(2342342342);
        const html = editor.create.fromHTML(`
<section class="tasks-checkbox">
    <div><input type="checkbox"/>&nbsp;<span></span></div>
</section>
`);
        editor.selection.insertHTML(html);
        editor.selection.setCursorIn(html.getElementsByTagName('span')[0]);

    };
};

const button = ['source',
    '|',
    'strikethrough',
    'bold',
    'underline',
    'italic',
    '|',
    'superscript',
    'subscript',
    '|',
    'ul',
    'ol',
    '|',
    'outdent',
    'indent',
    '|',
    'font',
    'fontsize',
    'brush',
    'paragraph',
    '|',
    'image',
    'file',
    'video',
    'table',
    'link',
    '|',
    'align',
    'undo',
    'redo',
    '\n',
    'cut',
    'dots',
    'copy',
    'paste',
    'eraser',
    'copyformat',
    '|',
    'hr',
    'symbol',
    'code',
    'fullsize', {
        iconURL: 'images/dummy.png',
        tooltip: 'insert Dummy Image',
        exec: editor => editor.dummy.insertDummyImage(100, 100, 'f00', '000'),
    }, {
        command: 'insertcode',
        icon: 'source',
        controlName: 'ul',
        tags: ['ul'],
        tooltip: 'Insert Unordered List'
    }];

const config = {
    showPlaceholder: false,
    askBeforePasteHTML: false,
    autofocus: true,
    theme: 'dark',
    toolbarStickyOffset: 0,
    showCharsCounter: false,
    showWordsCounter: false,
    iframeStyle: `
    .jodit_resizer,
    table td{
        border: 1px solid white;
    }
    table {
        border-style: solid;
        border-collapse: collapse;
        border-color: white;
    }
    pre {
        white-space: inherit;
    }
    iframe: {
        flex: 1;
        height: 100%;
        }
    html {
        color: white;
        overflow-y: auto !important;
    }
    a {
        color:lightblue;
        }
        
    .jodit_container {
  font-size: 1em !important;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100% !important;
  background: transparent !important;
  border: none !important;
}
.jodit_container .jodit_toolbar {
  font-size: 1em;
}
.jodit_container .jodit_wysiwyg,
.jodit_container .jodit_workplace {
  flex-direction: column;
  flex: 1;
  display: inline-block;
  min-height: 100% !important;
  background: transparent !important;
  border: none !important;
}
.jodit_container .jodit_toolbar .jodit_toolbar_btn {
  min-width: 2.29em;
  height: 2.29em;
  line-height: 2.29em;
}
.jodit_container .jodit_workplace,
.jodit_container .jodit_toolbar,
.jodit_container .jodit_statusbar,
.jodit_container .jodit_toolbar > li.jodit_toolbar_btn.jodit_toolbar_btn-separator,
.jodit_container .jodit_toolbar > li.jodit_toolbar_btn.jodit_toolbar_btn-break {
  border-color: transparent;
}
.jodit_container .jodit_toolbar .jodit_toolbar .jodit_toolbar {
  font-size: 1.2em !important;
}
.jodit_container .jodit_dark_theme .jodit_tabs .jodit_tabs_buttons > a.active {
  background-color: transparent !important;
  border: none;
}
.jodit_container .jodit_toolbar,
.jodit_container .jodit_statusbar {
  padding: 0.5em !important;
}
.jodit_container .jodit_toolbar_list > .jodit_toolbar li.jodit_toolbar_btn > a {
  padding: 0.5em 1em;
}
.jodit_container .jodit_icon {
  width: 1em;
  height: 1em;
  font-size: 1.1em;
}
.jodit_container .jodit_toolbar .jodit_toolbar_btn.jodit_with_dropdownlist {
  padding: 0 0.5em;
}
.jodit_container .jodit_form label {
  margin: 1em 0;
}
.jodit_container .jodit_disabled,
.jodit_container .jodit_dark_theme .jodit_toolbar_list > .jodit_toolbar {
  font-size: 1em;
}
.jodit_container .jodit_button {
  padding: 0 1.5em !important;
  border-radius: 0.3em !important;
  font-size: 1em !important;
  text-align: center;
  margin: 0;
}
.jodit_container .jodit_form {
  color: inherit !important;
}
.jodit_container .jodit_tabs_buttons {
  margin: 1.2em 0 !important;
}
.jodit_container .jodit_toolbar_container {
  position: sticky;
  z-index: 3;
  top: 0;
  left: auto;
}
.jodit_container .jodit_container .jodit_dark_theme .jodit_tabs .jodit_tabs_buttons > a.active,
.jodit_container .jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn > a:hover {
  background-color: transparent !important;
}
.jodit_container .jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn.jodit_toolbar_btn-break {
  margin: 0.8em 0 !important;
}

.jodit_dark_theme .jodit_tabs .jodit_tabs_buttons > a.active {
  background-color: transparent !important;
}

.jodit_toolbar_btn .jodit_toolbar_popup {
  font-size: 1em !important;
}

.jodit_toolbar_popup > div {
  width: 13em !important;
}

.jodit_toolbar_popup-inline > div > .jodit_toolbar {
  border-radius: 0.2em !important;
}

.jodit_toolbar_popup {
  border-radius: 0.2em !important;
  font-size: 0.8em !important;
}
    `,
    //askBeforePasteHTML:   false,
    iframe: true,
    defaultActionOnPaste: 'insert_as_html',
    showXPathInStatusbar: false,
    disablePlugins: 'cleanHTML',
    cleanHTML: {
        timeout: null,
        cleanOnPaste: false,
        removeEmptyElements: false,
        fillEmptyParagraph: false,
        replaceNBSP: false,
    },
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    buttonsSM: button,
    buttonsMD: button,
    buttonsXS: button,
    buttons: button,
    events: {
        afterInit: editor => editor.dummy = new Jodit.modules.Dummy(editor),
    },
};

const toolbarClassName = 'NoteText__toolbar';

@inject(stores => (
    {
        theme: stores.themeStore.getTheme,
        noteText: stores.noteStore.getNoteText,
        selectedNote: stores.noteStore.getSelectedNote,
        selectedCategory: stores.categoryStore.getSelectedCategory,
        setSelectedNoteText: stores.noteStore.setSelectedNoteText,
    }
))
@observer
@Radium
class NoteEditor extends React.Component {
    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.selectedNote) return {currentNote: null, currentNoteText: ''};
        if (!prevState.currentNote
            || !nextProps.selectedNote.text
            || nextProps.selectedNote.uuid !== prevState.currentNote.uuid) {
            const state = {currentNote: nextProps.selectedNote};
            if ((!prevState.currentNoteText || nextProps.selectedNote.uuid !== prevState.currentNote.uuid)) {
                state.currentNoteText = nextProps.noteText;
            } else if (!prevState.currentNoteText) {
                state.currentNoteText = '';
            }
            return state;
        }
        return null;
    }

    constructor(props) {
        super(props);
        const {noteText, selectedNote} = props;
        this.state = {currentNoteText: noteText, currentNote: selectedNote};
    }

    debounceChangeNoteText = debounce(this.props.setSelectedNoteText, 700);

    onChangeNote = data => {
        const {selectedNote, selectedCategory} = this.props;
        this.setState({
            currentNoteText: data,
            currentNote: selectedNote,
        }, () => {
            if (!this.props.selectedNote.text || !isEqual(this.props.selectedNote.text, data)) {
                this.debounceChangeNoteText(selectedNote, selectedCategory, data);
            }
        });
    };

    onChange = data => {
        const {selectedNote, selectedCategory, setSelectedNoteText} = this.props;
        setSelectedNoteText(selectedNote, selectedCategory, data);
    };

    editor = null;

    render() {
        const {selectedNote, offset, theme} = this.props;
        const {currentNoteText} = this.state;
        const showComponent = currentNoteText !== null && selectedNote;
        const style = STYLES(theme);
        const textStyle = getTextStyles(style);
        return (
            <ScrollableColumn
                autoHideScrollbar
                shadowColor={theme.color.second}
                scrollColor={theme.color.second}
                width="inherit"
                toolbar={(
                    <>
                        <div className="main__toolbar"/>
                        {showComponent ? (
                            <div style={style.toolbar} className={`${styles.toolbar} ${toolbarClassName}`}>
                                {moment(selectedNote.updatedAt).format('DD MMMM YYYY, HH:mm')}
                            </div>
                        ) : null}
                    </>
                )}
                footer={<div className={styles.footer}/>}
            >
                <Style rules={textStyle}/>
                {showComponent ? (
                    <>
                        <JoditEditor
                            ref={this.editor}
                            value={currentNoteText}
                            config={config}
                            // tabIndex={1} // tabIndex of textarea
                            onBlur={this.onChange} // preferred to use
                            // only this option to update the content for performance reasons
                            onChange={newContent => {
                            }}
                        />
                    </>
                ) : <span/>}
            </ScrollableColumn>
        );
    }
}

export default NoteEditor;
