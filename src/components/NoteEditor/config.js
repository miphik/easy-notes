import buttons from 'components/NoteEditor/buttons';
import clearCode from 'components/NoteEditor/plugins/clearCode';
import listIncreaseIndent from 'components/NoteEditor/plugins/listIncreaseIndent';
import listDecreaseIndent from 'components/NoteEditor/plugins/listDecreaseIndent';
import getIcon from 'components/NoteEditor/plugins/getIcon';

export default {
    showPlaceholder: false,
    // askBeforePasteHTML: false,
    // autofocus: true,
    theme:           'dark',
    link:            {
        followOnDblClick: false,
    },
    toolbarStickyOffset:  0,
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
        'info',
        clearCode,
        listDecreaseIndent,
        listIncreaseIndent,
    ],
    events: {
        getIcon,
    },
};
