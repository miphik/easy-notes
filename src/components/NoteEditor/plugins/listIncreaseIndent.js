import {closest} from 'components/NoteEditor/plugins/helpers';

export default {
    name:    'list-increase-indent',
    icon:    'increaseIndentIcon',
    tooltip: 'Increase list indent',
    exec:    editor => {
        const current = editor.selection.current(false);
        if (!current) {
            console.log('No element selected');
            return;
        }
        // Get currently selected list item (li)
        const currentListItemElement = closest('li', current, editor);
        if (!currentListItemElement) {
            console.log('No current list item element');
            return;
        }

        // Get currently selected list (ol/ul)
        const currentListElement = closest('ul|ol', currentListItemElement, editor);
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
    },
};
