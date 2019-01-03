import {Form} from 'antd';
import {emptyFunc} from 'utils/General';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import MonacoEditor from 'react-monaco-editor';

const FormItem = Form.Item;

class CodeField extends PureComponent {
    render() {
        const {
            value, onChange, label, required, error, extra, name, onBlur, onFocus, children, validateEveryChange,
            ...rest
        } = this.props;

        return (
            <FormItem
                className="InputField__label"
                label={label}
                required={required}
                validateStatus={error ? 'error' : undefined}
                help={error || undefined}
                extra={extra}
            >

                <MonacoEditor
                    options={{
                        fontSize:            11,
                        selectOnLineNumbers: true,
                        minimap:             {enabled: false},
                        scrollbar:           {
                            verticalHasArrows:       true,
                            horizontalHasArrows:     true,
                            arrowSize:               8,
                            horizontalScrollbarSize: 7,
                            verticalScrollbarSize:   7,
                            verticalSliderSize:      7,
                            horizontalSliderSize:    7,
                        },
                    }}
                    highlightActiveLine
                    showGutter
                    {...rest}
                    value={typeof value === 'string' ? value : undefined}
                    /* editorWillMount={monaco => {
                        monaco.languages.registerCompletionItemProvider('javascript', {
                            provideCompletionItems: function(model, position) {
                                // find out if we are completing a property in the 'dependencies' object.
                                var textUntilPosition = model.getValueInRange({startLineNumber: 1, startColumn: 1,
                                endLineNumber: position.lineNumber, endColumn: position.column});
                                    return [
                                        {
                                            label: 'income',
                                            kind: monaco.languages.CompletionItemKind.Interface,
                                            documentation: "The Lodash library exported as Node.js modules.",
                                            insertText: 'income'
                                        },
                                        {
                                            label: '"express"',
                                            kind: monaco.languages.CompletionItemKind.Function,
                                            documentation: "Fast, unopinionated, minimalist web framework",
                                            insertText: '"express": "*"'
                                        },
                                        {
                                            label: '"mkdirp"',
                                            kind: monaco.languages.CompletionItemKind.Function,
                                            documentation: "Recursively mkdir, like <code>mkdir -p</code>",
                                            insertText: '"mkdirp": "*"'
                                        }
                                    ];
                            }
                        });
                    }}*/
                    onBlur={() => onBlur(name)}
                    onFocus={() => onFocus(name)}
                    onChange={val => onChange(name, val, {validateEveryChange})}
                />

                {children}
            </FormItem>
        );
    }
}

CodeField.defaultProps = {
    error:               undefined,
    extra:               undefined,
    required:            false,
    validateEveryChange: false,
    label:               undefined,
    value:               '',
    onChange:            emptyFunc,
    children:            null,
};

CodeField.propTypes = {
    name:                PropTypes.string.isRequired,
    onBlur:              PropTypes.func.isRequired,
    onFocus:             PropTypes.func.isRequired,
    error:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required:            PropTypes.bool,
    validateEveryChange: PropTypes.bool,
    label:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:               PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    onChange:            PropTypes.func,
    children:            PropTypes.node,
};

export default CodeField;
