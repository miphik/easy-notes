// import { Config } from '../Config';
import {Jodit} from 'jodit';


/* Config.prototype.controls.ul = {
    command: 'insertUnorderedList',
    controlName: 'ul',
    tags: ['ul'],
    tooltip: 'Insert Unordered List'
};
Config.prototype.controls.ol = {
    command: 'insertOrderedList',
    controlName: 'ol',
    tags: ['ol'],
    tooltip: 'Insert Ordered List'
};*/
let
    temp = 1;

const
    $$temp = () => {
        temp++;
        return temp;
    };
const $$ = (selector, root) => {
    let result;
    result = root.querySelectorAll(selector);

    return [].slice.call(result);
};
const insertParagraph = (editor, fake, wrapperTag, style) => {
    const p = editor.create.inside.element(wrapperTag);
    const helper_node = editor.create.inside.element('br');

    p.appendChild(helper_node);

    if (style && style.cssText) {
        p.setAttribute('style', style.cssText);
    }

    editor.selection.insertNode(p, false, false);
    editor.selection.setCursorBefore(helper_node);

    const range = editor.editorDocument.createRange();

    range.setStartBefore(p);
    range.collapse(true);

    editor.selection.selectRange(range);

    Jodit.modules.Dom.safeRemove(fake);

    // scrollIntoView(p, editor.editor, editor.editorDocument);

    editor.events && editor.events.fire('synchro'); // fire change

    return p;
};

/**
 * Process commands insertOrderedList and insertUnOrderedList
 */
export function tasklist(editor) {
    const {Dom} = Jodit.modules;
    editor.events.on('beforeEnter', event => {
        if (event.which !== 13) return true;
        const current = editor.selection.current();
        const currentBox = current
            ? (Dom.up(
                current,
                tag => tag && /^SECTION$/i.test(tag.nodeName),
                editor.editor,
            ))
            : false;
        const isLi = currentBox && currentBox.nodeName === 'SECTION';
        console.log(111111, current, currentBox, isLi);
        if (isLi) {
            const elementsByTagName = currentBox.getElementsByTagName('div');
            editor.selection.setCursorAfter(elementsByTagName[elementsByTagName.length - 1]);
                const html = editor.create.fromHTML('<div><input type="checkbox"/>&nbsp;<span></span></div>');
                editor.selection.insertNode(html, false, false);
                editor.selection.setCursorIn(html.getElementsByTagName('span')[0]);
                /*if (!$$('li', ul).length) {
                    Dom.safeRemove(ul);
                }*/
            editor.events && editor.events.fire('synchro'); // fire change
                return false;
        }
    });
    /* editor.events.on(
        'afterCommand',
        (command: string): false | void => {
            console.log(111);
            if (/insertcode/i.test(command)) {
                const ul = Jodit.modules.Dom.up(
                    editor.selection.current(),
                    tag => tag && /^UL|OL$/i.test(tag.nodeName),
                    editor.editor,
                );
                console.log(222, ul);

                if (ul && ul.parentNode && ul.parentNode.nodeName === 'P') {
                    const selection = editor.selection.save();
                    Jodit.modules.Dom.unwrap(ul.parentNode);
                    Array.from(ul.childNodes).forEach(li => {
                        if (
                            li.lastChild
                            && li.lastChild.nodeType === Node.ELEMENT_NODE
                            && li.lastChild.nodeName === 'BR'
                        ) {
                            Jodit.modules.Dom.safeRemove(li.lastChild);
                        }
                    });
                    editor.selection.restore(selection);
                }
                editor.setEditorValue();
            }
        },
    );*/
}
