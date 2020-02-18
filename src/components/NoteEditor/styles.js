/* eslint-disable max-len */
// @flow

import memoizeOne from 'memoize-one';
import type {ThemeType} from 'stores/ThemeStore';
import Color from 'color';

const IFRAME_EDITOR_STYLES = memoizeOne((theme: ThemeType) => `
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

const STYLES = memoizeOne((theme: ThemeType, editorIsActive: boolean = false) => {
    const opacity = 0.8;
    const backgroundOpacity = editorIsActive ? 1 : opacity;

    const buttonColor = theme.color.button;
    const buttonActiveColor = theme.color.buttonActive;
    const grayColor = theme.color.gray;
    const secondColor = theme.color.second;
    const selectedColor = theme.color.selected;
    return (
        {
            headers: {
                color: 'inherit',
            },
            joditHeaders: {
                color: buttonColor,
            },
            joditWorkplaceHeaders: {
                color: buttonActiveColor,
            },
            joditPopupTriangle: {
                backgroundColor: `${buttonColor} !important`,
            },
            toolbar: {
                color: grayColor,
            },
            joditBtn: {
                color: `${buttonActiveColor} !important`,
                backgroundColor: `${secondColor} !important`,
                border: `1px solid ${grayColor}`,
            },
            joditDisabled: {
                backgroundColor: `${secondColor} !important`,
            },
            joditColorpickerHover: {
                fill: `${buttonActiveColor} !important`,
            },
            joditColorpicker: {
                fill: `${buttonColor} !important`,
            },
            joditToolbarBtn: {
                color: buttonColor,
            },
            joditToolbarPopup: {
                backgroundColor: `${secondColor} !important`,
                color: `${buttonActiveColor} !important`,
                border: `1px solid ${grayColor} !important`,
            },
            backgroundTransparent: {
                backgroundColor: `${selectedColor} !important`,
            },
            joditTabBtn: {
                border: 'none',
                margin: '1.2em 0 !important',
                backgroundColor: `${selectedColor} !important`,
            },
            joditIconA: {
                fill: `${buttonColor} !important`,
                color: buttonColor,
            },
            joditInserterAfter: {
                color: buttonActiveColor,
                backgroundColor: buttonActiveColor,
            },
            joditToolbarHover: {
                color: buttonActiveColor,
                backgroundColor: 'transparent !important',
            },
            joditToolbarTrigger: {
                borderTopColor: buttonActiveColor,
            },
            joditTooltipHover2: {
                fill: `${buttonActiveColor} !important`,
            },
            joditTooltipHover: {
                // backgroundColor: `${secondColor} !important`,
            },
            joditToolbar: {
                borderColor: 'transparent',
                backgroundColor: `${secondColor} !important`,
            },
            joditToolbar3: {
                border: `1px solid ${grayColor}`,
            },
            joditTooltipCheckbox: {
                color: `${buttonActiveColor} !important`,
            },
            joditTooltip: {
                padding: '0.3em 0.5em !important',
                borderRadius: '0.2em !important',
                backgroundColor: `${secondColor} !important`,
                fontSize: '0.8em !important',
                border: `1px solid ${grayColor}`,
                color: `${buttonActiveColor} !important`,
                textAlign: 'center',
            },
            joditToolbarSeparator: {
                borderRightColor: selectedColor,
            },
            joditToolbarTopSeparator: {
                borderTopColor: selectedColor,
            },
            ace_gutter: {
                zIndex: 1,
            },
            iframe: {
                color: `${buttonActiveColor} !important`,
                backgroundColor: 'transparent !important',
                height: '100%',
                flex: 1,
            },
            joditPre: {
                border: `1px solid ${selectedColor}`,
                background: 'transparent',
                boxShadow: '1px 1px 0.5em rgba(0, 0, 0, 0.4) inset',
                margin: '1em',
            },
            joditlanguageButton: {
                display: 'flex !important',
                justifyContent: 'flex-start !important',
            },
            joditSearchBoxCounts: {
                borderLeft: `solid 1px ${selectedColor}`,
                width: '35%',
            },
            joditSearchBox: {
                backgroundColor: theme.color.first,
                border: `solid 1px ${selectedColor}`,
                boxShadow: 'box-shadow: -5px 5px 5em 5px rgba(0, 0, 0, 0.4)',
                right: '1em',
                position: 'fixed',
                top: '3em',
                zIndex: 111,
            },
            joditSearchBoxInputPlaceholder: {
                color: buttonColor,
            },
            joditSearchBoxButton: {
                cursor: 'pointer',
                padding: '1px 3px',
                border: 'none !important',
            },
            joditSearchBoxButtonSvg: {
                fill: buttonColor,
                marginTop: '3px',
                pointerEvents: 'none',
            },
            joditSearchBoxButtonHover: {
                fill: buttonActiveColor,
                backgroundColor: 'transparent',
            },
            joditContainer: {
                opacity: backgroundOpacity,
            },
        }
    );
});

const getTextStyles = memoizeOne((style: STYLES) => ({
    '.jodit_search .jodit_search_box .jodit_search_buttons button': style.joditSearchBoxButton,
    '.jodit_search .jodit_search_box .jodit_search_buttons button svg': style.joditSearchBoxButtonSvg,
    '.jodit_search .jodit_search_box .jodit_search_buttons button:hover': style.joditSearchBoxButtonHover,
    '.jodit_search .jodit_search_box .jodit_search_buttons button:hover svg': style.joditSearchBoxButtonHover,
    '.jodit_search .jodit_search_box .jodit_search_counts': style.joditSearchBoxCounts,
    '.jodit_search .jodit_search_box input::placeholder': style.joditSearchBoxInputPlaceholder,
    '.jodit_search .jodit_search_box': style.joditSearchBox,
    '.ace_gutter': style.ace_gutter,
    '.jodit_active': style.backgroundTransparent,
    '.jodit_button': style.joditBtn,
    '.jodit_colorpicker a svg': style.joditColorpicker,
    '.jodit_colorpicker a:hover svg': style.joditColorpickerHover,
    '.jodit_container pre': style.joditPre,
    '.jodit_dark_theme .jodit_tabs .jodit_tabs_buttons>a': style.joditTabBtn,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn.jodit_toolbar_btn-break': style.joditToolbarTopSeparator,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn.jodit_toolbar_btn-separator': style.joditToolbarSeparator,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover>a h1': style.joditToolbarHover,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover>a h2': style.joditToolbarHover,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover>a h3': style.joditToolbarHover,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover>a h4': style.joditToolbarHover,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover>a h5': style.joditToolbarHover,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover>a h6': style.joditToolbarHover,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover>a': style.joditToolbarHover,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn>a': style.joditToolbarBtn,
    '.jodit_disabled, .jodit_dark_theme .jodit_toolbar_list > .jodit_toolbar': style.joditDisabled,
    '.jodit_form_inserter .jodit_form-table-creator-box .jodit_form-container>div.hovered:after': style.joditInserterAfter,
    '.jodit_icon, .jodit_toolbar .jodit_toolbar_btn > a': style.joditIconA,
    '.jodit_placeholder': style.joditInserterAfter,
    '.jodit_popup_triangle': style.joditPopupTriangle,
    '.jodit_statusbar': style.joditToolbar,
    '.jodit_toolbar .jodit_toolbar .jodit_toolbar': style.joditToolbar3,
    '.jodit_toolbar>.jodit_toolbar_btn:not(.jodit_toolbar-input):hover': style.joditToolbarHover,
    '.jodit_toolbar > .jodit_toolbar_btn:not(.jodit_toolbar-input):hover': style.joditTooltipHover,
    '.jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn.active, .jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn.jodit_active, .jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:active, .jodit_dark_theme .jodit_toolbar li.jodit_toolbar_btn:hover': style.joditTooltipHover,
    '.jodit_toolbar > li.jodit_toolbar_btn.jodit_with_dropdownlist.jodit_with_dropdownlist-trigger': style.joditToolbarTrigger,
    '.jodit_toolbar > li:not(.jodit_disabled):hover>a svg': style.joditTooltipHover2,
    '.jodit_toolbar >.jodit_toolbar_btn.jodit_active, .jodit_toolbar > .jodit_toolbar_btn:not(.jodit_toolbar-input):active': style.backgroundTransparent,
    '.jodit_toolbar': style.joditToolbar,
    '.jodit_toolbar_container > .jodit_toolbar': style.joditToolbar,
    '.jodit_toolbar_popup label': style.joditTooltipCheckbox,
    '.jodit_toolbar_popup': style.joditToolbarPopup,
    '.jodit_toolbar_popup-inline>div>.jodit_toolbar': style.joditToolbar3,
    '.jodit_tooltip': style.joditTooltip,
    '.jodit_wysiwyg': style.joditInserterAfter,
    '.jodit_wysiwyg_iframe': style.iframe,
    '.language-button': style.joditlanguageButton,
    'h1, h2, h3, h4, h5, h6': style.headers,
    '.jodit_toolbar h1, .jodit_toolbar h2, .jodit_toolbar h3, .jodit_toolbar h4, .jodit_toolbar h5, .jodit_toolbar h6': style.joditHeaders,
    // '.jodit_workplace h1, .jodit_workplace h2, .jodit_workplace h3, .jodit_workplace h4, .jodit_workplace h5, .jodit_workplace h6': style.joditWorkplaceHeaders,
    'iframe.jodit_wysiwyg_iframe html': style.iframe,
    '.jodit_container': style.joditContainer,
    // 'h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover': style.joditToolbarHover,
}));

export {getTextStyles, STYLES, IFRAME_EDITOR_STYLES};
