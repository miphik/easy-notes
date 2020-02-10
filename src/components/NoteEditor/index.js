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
import {tasklist} from 'components/Jodit/plugins/tasklist';
import memoizeOne from 'memoize-one';
import type {ThemeType} from 'stores/ThemeStore';
import Prism from 'prismjs';
import hljs from 'highlight.js';
import 'prismjs/themes/prism-twilight.css';
import 'highlight.js/styles/a11y-dark.css';
import styles from './styles.styl';
import {STYLES, getTextStyles, IFRAME_EDITOR_STYLES} from './styles';
import './plugins/code';

const removeStyles = el => {
    if (!el) return;
    el.removeAttribute('style');
    el.removeAttribute('class');

    if (el.childNodes.length > 0) {
        for (const child in el.childNodes) {
            /* filter element nodes only */
            if (el.childNodes[child].nodeType == 1) removeStyles(el.childNodes[child]);
        }
    }
};

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

const LANGUAGES = [
    'arduino', 'bash', 'c-like', 'css', 'dart', 'd', 'dockerfile', 'go', 'gradle', 'http', 'java', 'javascript',
    'json', 'kotlin', 'pgsql', 'protobuf', 'python', 'sql',
];

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
        exec:    editor => editor.dummy.insertDummyImage(100, 100, 'f00', '000'),
    }, {
        command:     'insertcode',
        icon:        'source',
        controlName: 'ul',
        tags:        ['ul'],
        tooltip:     'Insert Unordered List',
    }];
const helpers = {
    closest(tags, el, editor) {
        const condition = node => new RegExp(`^(${tags})$`, 'i').test(node.nodeName);
        let closest = el;
        do {
            if (condition(closest)) {
                return closest;
            }
            closest = closest.parentElement;
        } while (closest && closest !== editor.editor);
        return null;
    },
    nextSiblings(el) {
        const nextSiblings = [];
        let current = el;
        while (current.nextElementSibling) {
            current = current.nextElementSibling;
            nextSiblings.push(current);
        }
        return nextSiblings;
    },
};

const config = {
    showPlaceholder:    false,
    // askBeforePasteHTML: false,
    // autofocus: true,
    theme:              'dark',
    link:               {
        followOnDblClick: false,
    },
    toolbarStickyOffset:  0,
    showCharsCounter:     false,
    showWordsCounter:     false,
    // iframeStyle: IFRAME_EDITOR_STYLES(theme),
    // askBeforePasteHTML:   false,
    // iframe: true,
    defaultActionOnPaste: 'insert_as_html',
    showXPathInStatusbar: false,
    disablePlugins:       'cleanHTML',
    enter:                'div',
    cleanHTML:            {
        timeout:             null,
        cleanOnPaste:        false,
        removeEmptyElements: false,
        fillEmptyParagraph:  false,
        replaceNBSP:         false,
    },
    readonly:     false, // all options from https://xdsoft.net/jodit/doc/
    buttonsSM:    button,
    buttonsMD:    button,
    buttonsXS:    button,
    buttons:      button,
    /* popup:     {
        a: Jodit.Array(Jodit.defaultOptions.popup.a.filter(b => b.icon !== 'pencil')),
    },*/
    extraButtons: [
        "info",
        {
            name:    'clear',
            iconURL: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiB3aWR0aD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIyIDM0aDIwdi00aC0yMHY0em0tMTYtMTBsOCA4di0xNmwtOCA4em0wIDE4aDM2di00aC0zNnY0em0wLTM2djRoMzZ2LTRoLTM2em0xNiAxMmgyMHYtNGgtMjB2NHptMCA4aDIwdi00aC0yMHY0eiIvPjxwYXRoIGQ9Ik0wIDBoNDh2NDhoLTQ4eiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
            tooltip: 'Clear list indent',
            exec:    (editor, ...rest) => {
                let parentElement = editor.selection.current(false);
                console.log(323232, parentElement, parentElement == editor.editor, parentElement.innerHTML);
                if (parentElement.parentElement && (parentElement.parentElement.tagName === 'CODE' || parentElement.parentElement.tagName === 'PRE')) {
                    parentElement = parentElement.parentElement;
                }
                if (parentElement.parentElement && (parentElement.parentElement.tagName === 'CODE' || parentElement.parentElement.tagName === 'PRE')) {
                    parentElement = parentElement.parentElement;
                }
                if (!parentElement.innerHTML) return;
                const html = document.createTextNode(parentElement.innerHTML.replace(/(<([^>]+)>)/ig, ''));
                Jodit.modules.Dom.safeRemove(parentElement);
                // editor.selection.remove();
                editor.selection.insertNode(html);
            },
        },
        {
            name:    'aaa',
            icon: 'source',
            tooltip: 'Clear list indent11111',
            exec: (editor, event, control) => {
                editor.execCommand(
                    'clear',
                    false,
                    control.args ? control.args[0] : undefined
                );
            },
        },
        {
            name:    'list-increase-indent',
            iconURL: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiB3aWR0aD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIyIDM0aDIwdi00aC0yMHY0em0tMTYtMTBsOCA4di0xNmwtOCA4em0wIDE4aDM2di00aC0zNnY0em0wLTM2djRoMzZ2LTRoLTM2em0xNiAxMmgyMHYtNGgtMjB2NHptMCA4aDIwdi00aC0yMHY0eiIvPjxwYXRoIGQ9Ik0wIDBoNDh2NDhoLTQ4eiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
            tooltip: 'Increase list indent',
            exec:    (editor, ...rest) => {
                const current = editor.selection.current(false);
                const html = document.createTextNode(editor.selection.getHTML().replace(/(<([^>]+)>)/ig, ''));
                console.log(2233, pre, editor.selection.getHTML());
                editor.selection.remove();
                const pre = document.createElement('pre');
                editor.selection.insertNode(pre);

                pre.classList.add('language-sql');
                const code = document.createElement('code');
                code.classList.add('language-sql');
                code.appendChild(html);
                pre.appendChild(code);
                hljs.highlightBlock(pre);
                // Prism.highlightElement(pre);
                editor.selection.setCursorIn(pre.getElementsByTagName('code')[0]);
                // Jodit.modules.Dom.safeRemove(current);
                // editor.selection.setCursorIn(html.getElementsByTagName('span')[0]);
                return;
                const currentListItemElement = helpers.closest('pre', current, editor);
                removeStyles(currentListItemElement);
                // Jodit.modules.Dom
                debugger;
                console.log(11112121, currentListItemElement.innerHTML, currentListItemElement);
            },
        },
        /* {
            name: 'list-increase-indent',
            iconURL: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiB3aWR0aD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIyIDM0aDIwdi00aC0yMHY0em0tMTYtMTBsOCA4di0xNmwtOCA4em0wIDE4aDM2di00aC0zNnY0em0wLTM2djRoMzZ2LTRoLTM2em0xNiAxMmgyMHYtNGgtMjB2NHptMCA4aDIwdi00aC0yMHY0eiIvPjxwYXRoIGQ9Ik0wIDBoNDh2NDhoLTQ4eiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
            tooltip: 'Increase list indent',
            exec: function (editor) {
                const current = editor.selection.current(false);
                if (!current) {
                    console.log('No element selected');
                    return;
                }
                // Get currently selected list item (li)
                const currentListItemElement = helpers.closest('li', current, editor);
                if (!currentListItemElement) {
                    console.log('No current list item element');
                    return;
                }

                // Get currently selected list (ol/ul)
                const currentListElement = helpers.closest('ul|ol', currentListItemElement, editor);
                if (!currentListElement) {
                    console.log('No current list element');
                    return;
                }

                // Get previous list item to append item to sub list of that item.
                const previousListItemElement = currentListItemElement.previousElementSibling;
                if (!previousListItemElement) {
                    console.log('No previous sibling');
                    return;
                }
                // Store snapshot to restore after having moved element
                const snapshot = editor.selection.save();
                // Check if previous list item already contains a list
                let childListElement = previousListItemElement.querySelector('ol,ul');
                // Create new list if previous item does not include any list
                childListElement = childListElement || editor.create.inside.element(currentListElement.nodeName);
                childListElement.appendChild(currentListItemElement);
                previousListItemElement.appendChild(childListElement);
                editor.selection.restore(snapshot);
            }
        },
        {
            name: 'list-decrease-indent',
            icon: 'source',
            tooltip: 'Decrease list indent',
            exec: function (editor) {
                const current = editor.selection.current(false);
                if (!current) {
                    console.log('No element selected');
                    return;
                }
                // Get currently selected list item (li)
                const currentListItemElement = helpers.closest('li', current, editor);
                if (!currentListItemElement) {
                    console.log('No current list element');
                    return;
                }
                // Get currently selected list (ul/ol)
                const currentListElement = helpers.closest('ol|ul', current, editor);
                // Get parent list item of selected list (li)
                // Return if not nested.
                const parentListItemElement = helpers.closest('li', currentListElement, editor);
                if (!parentListItemElement) {
                    console.log('Not nested');
                    return;
                }
                // Get parent list
                const parentListElement = helpers.closest('ol|ul', parentListItemElement, editor);
                if (!parentListElement) {
                    console.log('Not nested');
                    return;
                }
                // Store snapshot to restore after having moved element
                const snapshot = editor.selection.save();

                // Add all next siblings of current list item to current list item sub-list.
                const currentListItemNextSiblings = helpers.nextSiblings(currentListItemElement);
                if (currentListItemNextSiblings.length) {
                    // Check if list item already contains a list
                    let childListElement = currentListItemElement.querySelector('ol,ul');
                    childListElement = childListElement || editor.create.inside.element(currentListElement.nodeName);
                    currentListItemElement.appendChild(childListElement);
                    for (const currentListItemNextSibling of currentListItemNextSiblings) {
                        childListElement.appendChild(currentListItemNextSibling);
                    }
                }

                // Insert current list item (li) into parent list at the correct position
                parentListElement.insertBefore(currentListItemElement, parentListItemElement.nextElementSibling);
                // Check if previous list is empty, remove if so
                if (!currentListElement.childNodes.length) {
                    parentListItemElement.removeChild(currentListElement);
                }
                editor.selection.restore(snapshot);
            }
        }*/
    ],
    events: {
        afterInit: editor => {
            // return editor.dummy = new Jodit.modules.Dummy(editor);
        },
    },
};

const toolbarClassName = 'NoteText__toolbar';

@inject(stores => (
    {
        theme:               stores.themeStore.getTheme,
        noteText:            stores.noteStore.getNoteText,
        selectedNote:        stores.noteStore.getSelectedNote,
        selectedCategory:    stores.categoryStore.getSelectedCategory,
        setSelectedNoteText: stores.noteStore.setSelectedNoteText,
    }
))
@observer
@Radium
class NoteEditor extends React.Component {
    static getDerivedStateFromProps(nextProps, prevState) {
        console.log(1121212, !!nextProps.selectedNote);
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

    /* componentDidUpdate = (prevProps, prevState, snapshot) => {
        console.log(111);
        setTimeout(() => Prism.highlightAll(), 0);
    }*/

    constructor(props) {
        super(props);
        const {noteText, selectedNote} = props;
        this.state = {currentNoteText: noteText, currentNote: selectedNote};
    }

    debounceChangeNoteText = debounce(this.props.setSelectedNoteText, 700);

    onChangeNote = data => {
        const {selectedNote, selectedCategory, setSelectedNoteText} = this.props;
        this.setState({
            currentNoteText: data,
            currentNote:     selectedNote,
        }, () => {
            if (!this.props.selectedNote.text || !isEqual(this.props.selectedNote.text, data)) {
                setSelectedNoteText(selectedNote, selectedCategory, data);
            }
        });
    };

    onChange = data => {
        const {selectedNote, selectedCategory, setSelectedNoteText} = this.props;
        if (selectedNote.text !== data) setSelectedNoteText(selectedNote, selectedCategory, data);
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
                    <div className="NoteEditor__container">
                        <JoditEditor
                            value={currentNoteText}
                            config={config}
                            // tabIndex={1} // tabIndex of textarea
                            onBlur={this.onChangeNote} // preferred to use
                            // only this option to update the content for performance reasons
                            onChange={newContent => {
                            }}
                        />
                    </div>
                ) : <span/>}
            </ScrollableColumn>
        );
    }
}

export default NoteEditor;
