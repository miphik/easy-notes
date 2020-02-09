/* eslint-disable max-len */
// @flow

import memoizeOne from 'memoize-one';
import type {ThemeType} from 'stores/ThemeStore';

const IFRAME_EDITOR_STYLES = memoizeOne((theme: ThemeType) =>`
.jodit_resizer,
table td {
  border: 1px solid white;
}
table {
  border-style: solid;
  border-collapse: collapse;
  border-color: white;
}
pre {
  white-space: inherit;
}
iframe {
  flex: 1;
  height: 100%;
}
html, body {
  height: 100%;
}
html {
  color: ${theme.color.buttonActive};
  overflow-y: auto !important;
}
a {
  color:lightblue;
}    
.jodit_container {
  font-size: 1em !important;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100% !important;
  background: transparent !important;
  border: none !important;
}
.jodit_container .jodit_toolbar {
  font-size: 1em;
}
.jodit_container .jodit_wysiwyg,
.jodit_container .jodit_workplace {
  flex-direction: column;
  flex: 1;
  display: inline-block;
  min-height: 100% !important;
  background: transparent !important;
  border: none !important;
}
.jodit_container .jodit_toolbar .jodit_toolbar_btn {
  min-width: 2.29em;
  height: 2.29em;
  line-height: 2.29em;
}
.jodit_container .jodit_workplace,
.jodit_container .jodit_toolbar,
.jodit_container .jodit_statusbar,
.jodit_dark_theme .jodit_toolbar,
.jodit_container .jodit_toolbar > li.jodit_toolbar_btn.jodit_toolbar_btn-separator,
.jodit_container .jodit_toolbar > li.jodit_toolbar_btn.jodit_toolbar_btn-break {
  border-color: transparent;
}
.jodit_container .jodit_toolbar .jodit_toolbar .jodit_toolbar {
  font-size: 1.2em !important;
}
.jodit_container .jodit_dark_theme .jodit_tabs .jodit_tabs_buttons > a.active {
  background-color: transparent !important;
  border: none;
}
.jodit_container .jodit_toolbar,
.jodit_container .jodit_statusbar {
  padding: 0.5em !important;
}
.jodit_container .jodit_toolbar_list > .jodit_toolbar li.jodit_toolbar_btn > a {
  padding: 0.5em 1em;
}
.jodit_container .jodit_icon {
  width: 1em;
  height: 1em;
  font-size: 1.1em;
}
.jodit_container .jodit_toolbar .jodit_toolbar_btn.jodit_with_dropdownlist {
  padding: 0 0.5em;
}
.jodit_container .jodit_form label {
  margin: 1em 0;
}
.jodit_container .jodit_disabled,
.jodit_container .jodit_dark_theme .jodit_toolbar_list > .jodit_toolbar {
  font-size: 1em;
}
.jodit_container .jodit_button {
  padding: 0 1.5em !important;
  border-radius: 0.3em !important;
  font-size: 1em !important;
  text-align: center;
  margin: 0;
}
.jodit_container .jodit_form {
  color: inherit !important;
}
.jodit_container .jodit_tabs_buttons {
  margin: 1.2em 0 !important;
}
.jodit_container .jodit_toolbar_container {
  position: sticky;
  z-index: 3;
  top: 0;
  left: auto;
}
.jodit_container .jodit_container .jodit_dark_theme .jodit_tabs .jodit_tabs_buttons > a.active,
.jodit_container .jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn > a:hover {
  background-color: transparent !important;
}
.jodit_container .jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn.jodit_toolbar_btn-break {
  margin: 0.8em 0 !important;
}

.jodit_dark_theme .jodit_tabs .jodit_tabs_buttons > a.active {
  background-color: transparent !important;
}

.jodit_toolbar_btn .jodit_toolbar_popup {
  font-size: 1em !important;
}

.jodit_toolbar_popup > div {
  width: 13em !important;
}

.jodit_toolbar_popup-inline > div > .jodit_toolbar {
  border-radius: 0.2em !important;
}

.jodit_toolbar_popup {
  border-radius: 0.2em !important;
  font-size: 0.8em !important;
}
`);

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
            color: `${theme.color.buttonActive} !important`,
            backgroundColor: `${theme.color.second} !important`,
            border: `1px solid ${theme.color.gray}`,
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
            color: `${theme.color.buttonActive} !important`,
            border: `1px solid ${theme.color.gray} !important`,
        },
        backgroundTransparent: {
            backgroundColor: `${theme.color.selected} !important`,
        },
        joditTabBtn: {
            border: 'none',
            margin: '1.2em 0 !important',
            backgroundColor: `${theme.color.selected} !important`,
        },
        joditIconA: {
            fill: `${theme.color.button} !important`,
            color: theme.color.button,
        },
        joditInserterAfter: {
            color: theme.color.buttonActive,
            backgroundColor: theme.color.buttonActive,
        },
        joditToolbarHover: {
            color: theme.color.buttonActive,
            backgroundColor: 'inherit',
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
            borderColor: 'transparent',
            backgroundColor: `${theme.color.second} !important`,
        },
        joditToolbar3: {
            border: `1px solid ${theme.color.gray}`,
        },
        joditTooltipCheckbox: {
            color: `${theme.color.buttonActive} !important`,
        },
        joditTooltip: {
            padding: '0.3em 0.5em !important',
            borderRadius: '0.2em !important',
            backgroundColor: `${theme.color.second} !important`,
            fontSize: '0.8em !important',
            border: `1px solid ${theme.color.gray}`,
            color: `${theme.color.buttonActive} !important`,
            textAlign: 'center',
        },
        joditToolbarSeparator: {
            borderRightColor: theme.color.selected,
        },
        joditToolbarTopSeparator: {
            borderTopColor: theme.color.selected,
        },
        ace_gutter: {
            zIndex: 1,
        },
        iframe: {
            color: `${theme.color.buttonActive} !important`,
            backgroundColor: 'transparent !important',
            height: '100%',
            flex: 1,
        },
        joditPre: {
            border: `1px solid ${theme.color.selected}`,
            background: 'transparent',
            boxShadow: '1px 1px 0.5em rgba(0, 0, 0, 0.4) inset',
        },
        joditlanguageButton: {
            display: 'flex !important',
            justifyContent: 'flex-start !important',
        },
    }
));

const getTextStyles = memoizeOne((style: STYLES) => ({
    '.jodit_wysiwyg_iframe': style.iframe,
    'iframe.jodit_wysiwyg_iframe html': style.iframe,
    '.ace_gutter': style.ace_gutter,
    '.jodit_toolbar_popup label': style.joditTooltipCheckbox,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn.jodit_toolbar_btn-separator': style.joditToolbarSeparator,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn.jodit_toolbar_btn-break': style.joditToolbarTopSeparator,
    '.jodit_form_inserter .jodit_form-table-creator-box .jodit_form-container>div.hovered:after': style.joditInserterAfter,
    '.jodit_dark_theme .jodit_tabs .jodit_tabs_buttons>a': style.joditTabBtn,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn>a': style.joditToolbarBtn,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover>a': style.joditToolbarHover,
    '.jodit_toolbar .jodit_toolbar .jodit_toolbar': style.joditToolbar3,
    '.jodit_toolbar_popup-inline>div>.jodit_toolbar': style.joditToolbar3,
    '.jodit_toolbar > li:not(.jodit_disabled):hover>a svg': style.joditTooltipHover2,
    '.jodit_tooltip': style.joditTooltip,
    '.jodit_toolbar': style.joditToolbar,
    '.jodit_container pre': style.joditPre,
    '.language-button': style.joditlanguageButton,
    '.jodit_toolbar_container > .jodit_toolbar': style.joditToolbar,
    '.jodit_popup_triangle': style.joditPopupTriangle,
    '.jodit_button': style.joditBtn,
    '.jodit_statusbar': style.joditToolbar,
    '.jodit_toolbar >.jodit_toolbar_btn.jodit_active, .jodit_toolbar > .jodit_toolbar_btn:not(.jodit_toolbar-input):active': style.backgroundTransparent,
    '.jodit_active': style.backgroundTransparent,
    '.jodit_toolbar_popup': style.joditToolbarPopup,
    '.jodit_colorpicker a svg': style.joditColorpicker,
    '.jodit_colorpicker a:hover svg': style.joditColorpickerHover,
    'h1, h2, h3, h4, h5, h6': style.headers,
    '.jodit_disabled, .jodit_dark_theme .jodit_toolbar_list > .jodit_toolbar': style.joditDisabled,
    'h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover': style.joditToolbarHover,
    '.jodit_toolbar > .jodit_toolbar_btn:not(.jodit_toolbar-input):hover': style.joditTooltipHover,
    '.jodit_placeholder': style.joditInserterAfter,
    '.jodit_wysiwyg': style.joditInserterAfter,
    '.jodit_icon, .jodit_toolbar .jodit_toolbar_btn > a': style.joditIconA,
    '.jodit_toolbar > li.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_with_dropdownlist-trigger': style.joditToolbarTrigger,
}));

export {getTextStyles, STYLES, IFRAME_EDITOR_STYLES};
