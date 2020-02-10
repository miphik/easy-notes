import {closest, nextSiblings} from 'components/NoteEditor/plugins/helpers';

export default {
    name:    'list-decrease-indent',
    icon:    'decreaseIndentIcon',
    tooltip: 'Decrease list indent',
    exec:    editor => {
        const current = editor.selection.current(false);
        if (!current) {
            console.log('No element selected');
            return;
        }
        // Get currently selected list item (li)
        const currentListItemElement = closest('li', current, editor);
        if (!currentListItemElement) {
            console.log('No current list element');
            return;
        }
        // Get currently selected list (ul/ol)
        const currentListElement = closest('ol|ul', current, editor);
        // Get parent list item of selected list (li)
        // Return if not nested.
        const parentListItemElement = closest('li', currentListElement, editor);
        if (!parentListItemElement) {
            console.log('Not nested');
            return;
        }
        // Get parent list
        const parentListElement = closest('ol|ul', parentListItemElement, editor);
        if (!parentListElement) {
            console.log('Not nested');
            return;
        }
        // Store snapshot to restore after having moved element
        const snapshot = editor.selection.save();

        // Add all next siblings of current list item to current list item sub-list.
        const currentListItemNextSiblings = nextSiblings(currentListItemElement);
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
    },
};
