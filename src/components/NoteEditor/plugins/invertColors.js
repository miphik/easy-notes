import Jodit from 'jodit';
import {invertColors, removeBackgroundColors, removeTags} from 'components/NoteEditor/plugins/helpers';

export const INVERT_CONTROL_NAME = 'invertColors';

Jodit.defaultOptions.controls[INVERT_CONTROL_NAME] = {
    command:  INVERT_CONTROL_NAME,
    icon:     'invertColorsIcon',

    exec: (editor, event, control) => {
        editor.selection.focus();
        const selectionInfo = editor.selection.save();

        editor.selection.eachSelection(current => {
            invertColors(current);
        });
        editor.selection.restore(selectionInfo);
        editor.setEditorValue();
        return false;
    },

    data: {
        currentValue: 'left',
    },

    template: (editor, key, value) => value,

    tooltip: 'Highlight code block',
};
