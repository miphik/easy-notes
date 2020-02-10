import Jodit from 'jodit';
import hljs from "highlight.js";
import pretty from 'code-prettify';

Jodit.defaultOptions.controls.info = {
    command: 'formatBlock2',
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
        console.log(222, control.command, control.args);
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
                && currentBox.classList.contains('language-' + control.args[1])
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
            console.log(1111, classExists);
            return classExists;
        }

        return false;
    },

    template: (editor, key, value) => value,

    tooltip: '12121212',
};

Jodit.plugins.add('formatBlock2', (editor) => {
    console.log(1111, 'formatBlock2');
    editor.registerCommand(
        'formatBlock2',
        (command, second, third) => {
            editor.selection.focus();
            let work = true;
            const selectionInfo = editor.selection.save();

            let html = editor.selection.getHTML().replace(/(<([^>]+)>)/ig, '');
            const txt = document.createElement("textarea");
            txt.innerHTML = html;

            const textNode = document.createTextNode(txt.value);

            editor.selection.remove();
            const pre = document.createElement('pre');
            editor.selection.insertNode(pre);
            pre.classList.add('language-' + third);
            const code = document.createElement('code');
            code.classList.add('language-' + third);
            code.appendChild(textNode);
            pre.appendChild(code);
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
