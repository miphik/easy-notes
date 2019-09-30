/* eslint-disable react/no-array-index-key */
import React from 'react';
import {getVisibleSelectionRect} from 'draft-js';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
} from 'draft-js-buttons';

export default class Toolbar extends React.Component {
    static defaultProps = {
        children: externalProps => (
            // may be use React.Fragment instead of div to improve perfomance after React 16
            <div>
                <ItalicButton {...externalProps} />
                <BoldButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
            </div>
        ),
    };

    state = {
        isVisible: false,
        position:  undefined,

        /**
         * If this is set, the toolbar will render this instead of the children
         * prop and will also be shown when the editor loses focus.
         * @type {Component}
         */
        overrideContent: undefined,
    };

    UNSAFE_componentWillMount() {
        this.props.store.subscribeToItem('selection', this.onSelectionChanged);
    }

    componentWillUnmount() {
        this.props.store.unsubscribeFromItem('selection', this.onSelectionChanged);
    }

    /**
     * This can be called by a child in order to render custom content instead
     * of the children prop. It's the responsibility of the callee to call
     * this function again with `undefined` in order to reset `overrideContent`.
     * @param {Component} overrideContent
     */
    onOverrideContent = overrideContent => {
        this.setState({overrideContent});
    };

    onSelectionChanged = () => {
        // need to wait a tick for window.getSelection() to be accurate
        // when focusing editor with already present selection
        setTimeout(() => {
            if (!this.toolbar) return;

            // The editor root should be two levels above the node from
            // `getEditorRef`. In case this changes in the future, we
            // attempt to find the node dynamically by traversing upwards.
            const editorRef = this.props.store.getItem('getEditorRef')();
            if (!editorRef) return;

            // This keeps backwards compatibility with React 15
            let editorRoot = editorRef.refs && editorRef.refs.editor
                ? editorRef.refs.editor
                : editorRef.editor;
            while (editorRoot.className.indexOf('DraftEditor-root') === -1) {
                editorRoot = editorRoot.parentNode;
            }
            const editorRootRect = editorRoot.getBoundingClientRect();

            const selectionRect = getVisibleSelectionRect(window);
            if (!selectionRect || !window.getSelection().toString().trim()) {
                return;
            }
            // The toolbar shouldn't be positioned directly on top of the selected text,
            // but rather with a small offset so the caret doesn't overlap with the text.
            const extraTopOffset = -84;
            const optionalParams = this.props.offset + this.toolbar.offsetWidth / 2 + 12;

            let optionalParams1 = selectionRect.left + selectionRect.width / 2 - this.toolbar.offsetWidth / 2 - this.props.offset;
            let optionalParams2 = optionalParams1 + this.props.offset + this.toolbar.offsetWidth + 16;
            console.log(1111, optionalParams2, document.body.clientWidth);
            let left = optionalParams > (selectionRect.left + selectionRect.width / 2) ? 12 : optionalParams1;
            const position = {
                top: selectionRect.top < selectionRect.top * 2 ? (selectionRect.top
                    + extraTopOffset)
                    : (selectionRect.top + extraTopOffset),
            };
            if (optionalParams2 > document.body.clientWidth) {
                position.right = 0;
            } else {
                position.left = left;
            }
            this.setState({position});
        });
    };

    getStyle() {
        const {store} = this.props;
        const {overrideContent, position} = this.state;
        const selection = store
            .getItem('getEditorState')()
            .getSelection();
        console.log(2232323, selection);
        // overrideContent could for example contain a text input, hence we always show overrideContent
        // TODO: Test readonly mode and possibly set isVisible to false if the editor is readonly
        const isVisible = (!selection.isCollapsed() && selection.getHasFocus()) || overrideContent;
        const style = {...position};

        if (isVisible) {
            style.visibility = 'visible';
            style.transform = 'translate(0%) scale(1)';
            style.transition = 'transform 0.15s cubic-bezier(.3,1.2,.2,1)';
        } else {
            style.transform = 'translate(0%) scale(1)';
            style.visibility = 'visible';
        }

        return style;
    }

    handleToolbarRef = node => {
        this.toolbar = node;
    };

    render() {
        const {theme, store} = this.props;
        const {overrideContent: OverrideContent} = this.state;
        const childrenProps = {
            theme:             {
                active: 'DraftJs__buttons_active',
                button: 'DraftJs__buttons_button',
                buttonWrapper: 'DraftJs__buttons_buttonWrapper',
            },
            getEditorState:    store.getItem('getEditorState'),
            setEditorState:    store.getItem('setEditorState'),
            onOverrideContent: this.onOverrideContent,
        };

        return (
            <div
                className={theme.STYLES().toolbar}
                style={{...theme.STYLES().toolbar, ...this.getStyle()}}
                ref={this.handleToolbarRef}
            >
                <div style={theme.STYLES().toolbar[':before']}/>
                {OverrideContent ? (
                    <OverrideContent {...childrenProps} />
                    ) : (
                        this.props.children(childrenProps)
                    )}
                <div style={theme.STYLES().toolbar[':after']}/>
            </div>
        );
    }
}
