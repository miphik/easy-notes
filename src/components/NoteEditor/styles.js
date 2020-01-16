/* eslint-disable max-len */
// @flow

import memoizeOne from 'memoize-one';
import type {ThemeType} from 'stores/ThemeStore';

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        headers: {
            color: theme.color.button,
        },
        joditPopupTriangle: {
            backgroundColor: `${theme.color.button} !important`,
        },
        toolbar: {
            color: theme.color.gray,
        },
        joditBtn: {
            color:           `${theme.color.buttonActive} !important`,
            backgroundColor: `${theme.color.second} !important`,
            border:          `1px solid ${theme.color.gray}`,
        },
        joditDisabled: {
            backgroundColor: `${theme.color.second} !important`,
        },
        joditColorpickerHover: {
            fill: `${theme.color.buttonActive} !important`,
        },
        joditColorpicker: {
            fill: `${theme.color.button} !important`,
        },
        joditToolbarBtn: {
            color: theme.color.button,
        },
        joditToolbarPopup: {
            backgroundColor: `${theme.color.second} !important`,
            color:           `${theme.color.buttonActive} !important`,
            border:          `1px solid ${theme.color.gray} !important`,
        },
        joditTabBtn: {
            backgroundColor: `${theme.color.selected} !important`,
        },
        joditIconA: {
            fill:  `${theme.color.button} !important`,
            color: theme.color.button,
        },
        joditInserterAfter: {
            color:           theme.color.buttonActive,
            backgroundColor: theme.color.buttonActive,
        },
        joditToolbarHover: {
            color: theme.color.buttonActive,
        },
        joditToolbarTrigger: {
            borderTopColor: theme.color.buttonActive,
        },
        joditTooltipHover2: {
            fill: `${theme.color.buttonActive} !important`,
        },
        joditTooltipHover: {
            backgroundColor: `${theme.color.second} !important`,
        },
        joditToolbar: {
            backgroundColor: `${theme.color.second} !important`,
        },
        joditToolbar3: {
            border: `1px solid ${theme.color.gray}`,
        },
        joditTooltip: {
            padding:         '0.3em 0.5em !important',
            borderRadius:    '0.2em !important',
            backgroundColor: `${theme.color.second} !important`,
            fontSize:        '0.8em !important',
            border:          `1px solid ${theme.color.gray}`,
            color:           `${theme.color.buttonActive} !important`,
            textAlign:       'center',
        },
    }
));

const getTextStyles = memoizeOne((style: STYLES) => ({
    '.jodit_form_inserter .jodit_form-table-creator-box .jodit_form-container>div.hovered:after':                            style.joditInserterAfter,
    '.jodit_dark_theme .jodit_tabs .jodit_tabs_buttons>a':                                                                   style.joditTabBtn,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn>a':                                                               style.joditToolbarBtn,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover>a':                                                         style.joditToolbarHover,
    '.jodit_toolbar .jodit_toolbar .jodit_toolbar':                                                                          style.joditToolbar3,
    '.jodit_toolbar > li:not(.jodit_disabled):hover>a svg':                                                                  style.joditTooltipHover2,
    '.jodit_tooltip':                                                                                                        style.joditTooltip,
    '.jodit_toolbar':                                                                                                        style.joditToolbar,
    '.jodit_popup_triangle':                                                                                                 style.joditPopupTriangle,
    '.jodit_button':                                                                                                         style.joditBtn,
    '.jodit_statusbar':                                                                                                      style.joditToolbar,
    '.jodit_toolbar >.jodit_toolbar_btn.jodit_active, .jodit_toolbar > .jodit_toolbar_btn:not(.jodit_toolbar-input):active': style.joditTabBtn,
    '.jodit_active':                                                                                                         style.joditTabBtn,
    '.jodit_toolbar_popup':                                                                                                  style.joditToolbarPopup,
    '.jodit_colorpicker a svg':                                                                                              style.joditColorpicker,
    '.jodit_colorpicker a:hover svg':                                                                                        style.joditColorpickerHover,
    'h1, h2, h3, h4, h5, h6':                                                                                                style.headers,
    '.jodit_disabled, .jodit_dark_theme .jodit_toolbar_list > .jodit_toolbar':                                               style.joditDisabled,
    'h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover':                                                            style.joditToolbarHover,
    '.jodit_toolbar > .jodit_toolbar_btn:not(.jodit_toolbar-input):hover':                                                   style.joditTooltipHover,
    '.jodit_placeholder':                                                                                                    style.joditInserterAfter,
    '.jodit_wysiwyg':                                                                                                        style.joditInserterAfter,
    '.jodit_icon, .jodit_toolbar .jodit_toolbar_btn > a':                                                                    style.joditIconA,
    '.jodit_toolbar > li.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_with_dropdownlist-trigger':                         style.joditToolbarTrigger,
}));

export {getTextStyles, STYLES};
