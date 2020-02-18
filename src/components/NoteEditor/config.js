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
    toolbarAdaptive: false,
    toolbarSticky: false,
    // useSearch:            false,
    showCharsCounter:     false,
    showWordsCounter:     false,
    // iframeStyle: IFRAME_EDITOR_STYLES(theme),
    askBeforePasteHTML:   false,
    // iframe: true,
    defaultActionOnPaste: 'insert_as_html',
    showXPathInStatusbar: false,
    disablePlugins:       'cleanHTML',
    enter:                'div',
    language:             'en',
    observer:             {
        timeout: 300,
    },
    spellcheck: true,
    colors:     {
        greyscale: ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'],
        palette:   ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#263238'],
        full:      [
            '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
            '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
            '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
            '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
            '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#733554',
            '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130',
        ],
    },
    colorPickerDefaultTab: 'text',
    cleanHTML:             {
        timeout:             null,
        cleanOnPaste:        false,
        removeEmptyElements: false,
        fillEmptyParagraph:  false,
        replaceNBSP:         false,
    },
    readonly:         false, // all options from https://xdsoft.net/jodit/doc/
    buttonsSM:        buttons,
    buttonsMD:        buttons,
    buttonsXS:        buttons,
    commandToHotkeys: {
        openreplacedialog: 'cmd+h',
    },
    buttons,
    // popup:     { a: Jodit.Array(Jodit.defaultOptions.popup.a.filter(b => b.icon !== 'pencil')) },
    extraButtons: [
        CODE_CONTROL_NAME,
        clearCode,
        INVERT_CONTROL_NAME,
        REMOVE_BACKGROUND_CONTROL_NAME,
        listDecreaseIndent,
        listIncreaseIndent,
        INVERT_CONTROL_NAME,
        REMOVE_BACKGROUND_CONTROL_NAME,
    ],
    events: {
        getIcon,
        afterInit: editor => {
            editor.registerCommand('list-increase-indent-hotkey', {
                hotkeys: ['ctrl+shift+i', 'cmd+shift+i', 'tab'],
                exec: () => listIncreaseIndent.exec(editor),
            });
            editor.registerCommand('list-decrease-indent-hotkey', {
                hotkeys: ['ctrl+shift+d', 'cmd+shift+d', 'shift+tab'],
                exec: () => listDecreaseIndent.exec(editor),
            });
            editor.registerCommand('list-decrease-indent-hotkey', {
                hotkeys: ['ctrl+f', 'cmd+f'],
                exec: () => search.exec(editor),
            });
        },
    },
};
/*
border: 1px solid #fff;
border-radius: 5px;
padding: 1px 5px;*/
