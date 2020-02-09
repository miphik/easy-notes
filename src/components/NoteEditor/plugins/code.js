import Jodit from 'jodit';

Jodit.defaultOptions.controls.info = {
    command:  'formatBlock2',
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
        console.log(222,control.command );
        editor.execCommand(
            control.command,
            false,
            control.args ? control.args[0] : undefined,
        );
    },

    data: {
        currentValue: 'left',
    },

    list: {
        p:          'Normal',
        h1:         'Heading 1',
        h2:         'Heading 2',
        h3:         'Heading 3',
        h4:         'Heading 4',
        blockquote: 'Quote',
    },

    isActiveChild: (editor, control) => {
        const current = editor.selection.current();

        if (current) {
            const currentBox = Jodit.modules.Dom.closest(
                current,
                node => Jodit.modules.Dom.isBlock(node, editor.editorWindow),
                editor.editor,
            );

            return (
                currentBox
                && currentBox !== editor.editor
                && control.args !== undefined
                && currentBox.nodeName.toLowerCase() === control.args[0]
            );
        }

        return false;
    },

    isActive: (editor, control) => {
        const current = editor.selection.current();

        if (current) {
            const currentBpx = Jodit.modules.Dom.closest(
                current,
                node => Jodit.modules.Dom.isBlock(node, editor.editorWindow),
                editor.editor,
            );

            return (
                currentBpx
                && currentBpx !== editor.editor
                && control.list !== undefined
                && !Jodit.modules.Dom.isTag(currentBpx, 'p')
                && ((control.list)[
                    currentBpx.nodeName.toLowerCase()
                ]) !== undefined
            );
        }

        return false;
    },

    template: (editor, key, value) => `<${key} class="jodit_list_element"><span>${editor.i18n(
        value,
    )}</span></${key}></li>`,

    tooltip: '12121212',
};

Jodit.plugins.add('formatBlock2', (editor) => {
    console.log(1111, 'formatBlock2');
    editor.registerCommand(
        'formatBlock2',
        (command, second, third) => {
            editor.selection.focus();
            let work = false;

            editor.selection.eachSelection(current => {
                const selectionInfo = editor.selection.save();
                let currentBox = current
                    ? (Jodit.modules.Dom.up(
                        current,
                        node => Jodit.modules.Dom.isBlock(node, editor.editorWindow),
                        editor.editor,
                    ))
                    : false;

                if ((!currentBox || Jodit.modules.Dom.isTag(currentBox, 'li')) && current) {
                    currentBox = Jodit.modules.Dom.wrapInline(
                        current,
                        editor.options.enter,
                        editor,
                    );
                }

                if (!currentBox) {
                    editor.selection.restore(selectionInfo);
                    return;
                }

                if (!currentBox.tagName.match(/TD|TH|TBODY|TABLE|THEAD/i)) {
                    if (
                        third === editor.options.enterBlock.toLowerCase()
                        && Jodit.modules.Dom.isTag(currentBox.parentNode, 'li')
                    ) {
                        Jodit.modules.Dom.unwrap(currentBox);
                    } else {
                        Jodit.modules.Dom.replace(
                            currentBox,
                            third,
                            editor.create.inside,
                            true,
                            false,
                        );
                    }
                } else if (!editor.selection.isCollapsed()) {
                    editor.selection.applyCSS({}, third);
                } else {
                    Jodit.modules.Dom.wrapInline(current, third, editor);
                }

                work = true;
                editor.selection.restore(selectionInfo);
            });

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
