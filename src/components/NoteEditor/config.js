import buttons from 'components/NoteEditor/buttons';
import clearCode from 'components/NoteEditor/plugins/clearCode';
import listIncreaseIndent from 'components/NoteEditor/plugins/listIncreaseIndent';
import listDecreaseIndent from 'components/NoteEditor/plugins/listDecreaseIndent';
import getIcon from 'components/NoteEditor/plugins/getIcon';
import {CODE_CONTROL_NAME} from 'components/NoteEditor/plugins/codeBlock';
import {INVERT_CONTROL_NAME} from 'components/NoteEditor/plugins/invertColors';
import {REMOVE_BACKGROUND_CONTROL_NAME} from 'components/NoteEditor/plugins/removeBackground';

export default {
    showPlaceholder: false,
    // askBeforePasteHTML: false,
    // autofocus: true,
    theme:           'dark',
    link:            {
        followOnDblClick: false,
    },
    toolbarStickyOffset:  0,
    useSearch:            true,
    showCharsCounter:     false,
    showWordsCounter:     false,
    // iframeStyle: IFRAME_EDITOR_STYLES(theme),
    // askBeforePasteHTML:   false,
    // iframe: true,
    defaultActionOnPaste: 'insert_as_html',
    showXPathInStatusbar: false,
    disablePlugins:       'cleanHTML',
    enter:                'div',
    cleanHTML:            {
        timeout:             null,
        cleanOnPaste:        false,
        removeEmptyElements: false,
        fillEmptyParagraph:  false,
        replaceNBSP:         false,
    },
    readonly:     false, // all options from https://xdsoft.net/jodit/doc/
    buttonsSM:    buttons,
    buttonsMD:    buttons,
    buttonsXS:    buttons,
    buttons,
    // popup:     { a: Jodit.Array(Jodit.defaultOptions.popup.a.filter(b => b.icon !== 'pencil')) },
    extraButtons: [
        CODE_CONTROL_NAME,
        clearCode,
        listDecreaseIndent,
        listIncreaseIndent,
        INVERT_CONTROL_NAME,
        REMOVE_BACKGROUND_CONTROL_NAME,
    ],
    events: {
        getIcon,
    },
};
