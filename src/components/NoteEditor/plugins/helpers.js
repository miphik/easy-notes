const closest = (tags, el, editor) => {
    const condition = node => new RegExp(`^(${tags})$`, 'i').test(node.nodeName);
    let closest = el;
    do {
        if (condition(closest)) {
            return closest;
        }
        closest = closest.parentElement;
    } while (closest && closest !== editor.editor);
    return null;
};

const nextSiblings = el => {
    const siblings = [];
    let current = el;
    while (current.nextElementSibling) {
        current = current.nextElementSibling;
        siblings.push(current);
    }
    return siblings;
};

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

const removeTags = html => {
    html = html.replace(/<br>/g, '$br$');
    html = html.replace(/(?:\r\n|\r|\n)/g, '$br$');
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    html = tmp.textContent || tmp.innerText;
    html = html.replace(/\$br\$/g, '<br>');
    html = html.replace(/(<br>\s*){2,}/m, '<br>');
    console.log(111, html);
    return html;
};

/* Jodit.plugins.add('codeBlock', tasklist);
Jodit.modules.Dummy = function (editor) {
    this.insertDummyImage = function (w, h, textcolor, bgcolor) {
        /!* const t = editor.getInstance('Dialog');
        const html = editor.create.fromHTML('<div><span>Click me to add text to editor </span></div>');

        html.querySelector('span').onclick = function () {
            editor.selection.insertHTML('Add this text on click');
        };
        t.setTitle(editor.i18n('Liste des mots à utiliser')),
        t.setContent(html),
        t.setSize(500, 900),
        t.open();*!/
        console.log(2342342342);
        const html = editor.create.fromHTML(`
            <section class="tasks-checkbox">
                <div><input type="checkbox"/>&nbsp;<span></span></div>
            </section>
        `);
        editor.selection.insertHTML(html);
        editor.selection.setCursorIn(html.getElementsByTagName('span')[0]);
    };
};*/

export {closest, nextSiblings, removeStyles, removeTags};
