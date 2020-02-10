import {Jodit} from 'jodit';
import {closest, removeTags} from 'components/NoteEditor/plugins/helpers';

export default {
    name:    'clearCodeBlock',
    icon:    'clearCodeBlockIcon',
    tooltip: 'Clear code block',
    exec:    editor => {
        editor.selection.focus();
        const selectionInfo = editor.selection.save();
        let parentElement = editor.selection.current(false);
        if (parentElement.parentElement) {
            parentElement = closest('pre', parentElement, editor);
        }
        if (parentElement && !parentElement.innerHTML && !editor.selection.getHTML() && parentElement.parentElement) {
            parentElement = parentElement.parentElement;
        }
        if (!parentElement && editor.selection.getHTML()) return false;
        const tempHtml = removeTags((parentElement && parentElement.innerHTML) || editor.selection.getHTML());
        if (parentElement && parentElement.innerHTML) {
            Jodit.modules.Dom.safeRemove(parentElement);
        } else {
            editor.selection.remove();
        }
        const div = document.createElement('div');
        editor.selection.insertNode(div);
        div.innerHTML = tempHtml;

        // editor.selection.remove();
        editor.selection.restore(selectionInfo);
        editor.setEditorValue();
        return false;
    },
};
