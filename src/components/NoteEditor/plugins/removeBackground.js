import Jodit from 'jodit';
import {removeBackgroundColors} from 'components/NoteEditor/plugins/helpers';

export const REMOVE_BACKGROUND_CONTROL_NAME = 'removeBackground';

Jodit.defaultOptions.controls[REMOVE_BACKGROUND_CONTROL_NAME] = {
    command:  REMOVE_BACKGROUND_CONTROL_NAME,
    icon:     'removeBackgroundIcon',

    exec: (editor, event, control) => {
        editor.selection.focus();
        const selectionInfo = editor.selection.save();

        editor.selection.eachSelection(current => {
            removeBackgroundColors(current.parentElement || current);
        });
        editor.selection.restore(selectionInfo);
        editor.setEditorValue();
        return false;
    },

    data: {
        currentValue: 'left',
    },

    template: (editor, key, value) => value,

    tooltip: 'Remove background colors',
};
