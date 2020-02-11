import Jodit from 'jodit';
import hljs from 'highlight.js';
import {removeTags} from 'components/NoteEditor/plugins/helpers';

export const CODE_CONTROL_NAME = 'codeHighlight';

Jodit.defaultOptions.controls[CODE_CONTROL_NAME] = {
    command:  CODE_CONTROL_NAME,
    icon:     'codeHighlightIcon',
    getLabel: (editor, btn, button) => {
        const current = editor.selection.current();

        if (current && editor.options.textIcons) {
            const currentBox = Jodit.modules.Dom.closest(
                current,
                node => Jodit.modules.Dom.isBlock(node, editor.editorWindow),
                editor.editor,
            ) || editor.editor;
            const currentValue = currentBox.nodeName.toLowerCase();
            const {list} = btn;

            if (
                button
                && btn.data
                && btn.data.currentValue !== currentValue
                && btn.list
                && list[currentValue]
            ) {
                button.textBox.innerHTML = `<span>${editor.i18n(
                    list[currentValue],
                )}</span>`;

                (button.textBox.firstChild).classList.add(
                    'jodit_icon',
                );

                btn.data.currentValue = currentValue;
            }
        }

        return false;
    },

    exec: (editor, event, control) => {
        editor.execCommand(
            control.command,
            false,
            control.args ? control.args[1] : undefined,
        );
    },

    data: {
        currentValue: 'left',
    },

    list: [
        'arduino', 'bash', 'c-like', 'css', 'dart', 'd', 'dockerfile', 'go', 'gradle', 'http', 'java', 'javascript',
        'json', 'kotlin', 'pgsql', 'protobuf', 'python', 'sql',
    ],

    isActiveChild: (editor, control) => {
        const current = editor.selection.current();

        if (current) {
            const currentBox = Jodit.modules.Dom.closest(
                current,
                node => Jodit.modules.Dom.isBlock(node, editor.editorWindow),
                editor.editor,
            );
            if (!currentBox || currentBox === editor.editor) return false;

            return (
                control.args !== undefined
                && currentBox.nodeName.toLowerCase() === 'pre'
                && currentBox.classList.contains(`language-${control.args[1]}`)
            );
        }
        return false;
    },

    isActive: (editor, control) => {
        const current = editor.selection.current();

        if (current) {
            const currentBox = Jodit.modules.Dom.closest(
                current,
                node => Jodit.modules.Dom.isBlock(node, editor.editorWindow),
                editor.editor,
            );

            if (
                !currentBox
                || currentBox === editor.editor
                || control.list === undefined
                || currentBox.nodeName.toLowerCase() !== 'pre'
                || !currentBox.classList
            ) {
                return false;
            }

            let classExists = false;
            currentBox.classList.forEach(item => {
                if (item.startsWith('language-')) classExists = true;
            });
            return classExists;
        }

        return false;
    },

    template: (editor, key, value) => value,

    tooltip: 'Highlight code block',
};

Jodit.plugins.add(CODE_CONTROL_NAME, editor => {
    editor.registerCommand(
        CODE_CONTROL_NAME,
        (command, second, third) => {
            editor.selection.focus();
            const work = true;
            const selectionInfo = editor.selection.save();

            const tempHtml = removeTags(editor.selection.getHTML());
            editor.selection.remove();

            const txt = document.createElement('textarea');
            txt.innerHTML = tempHtml;

            const pre = document.createElement('pre');
            editor.selection.insertNode(pre);
            pre.classList.add(`language-${third}`);
            const code = document.createElement('code');
            code.classList.add(`language-${third}`);
            pre.appendChild(code);
            code.innerHTML = txt.value;
            hljs.highlightBlock(pre);
            editor.selection.setCursorIn(pre.getElementsByTagName('code')[0]);
            /* currentBox = Jodit.modules.Dom.replace(
                currentBox,
                'code',
                editor.create.inside,
                true,
                false,
            );
            Jodit.modules.Dom.wrapInline(
                currentBox,
                'pre',
                editor,
            );*/
            editor.selection.restore(selectionInfo);

            if (!work) {
                const br = editor.create.inside.element('br');
                const currentBox = editor.create.inside.element(third, br);
                editor.selection.insertNode(currentBox, false);
                editor.selection.setCursorIn(currentBox);
            }

            editor.setEditorValue();
            return false;
        },
    );
});
