import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {emptyFunc} from 'utils/General';
import {FormContext, getArrayValue} from './simpleForm';

class FormField extends PureComponent {
    static propTypes = {
        defaultValue:  PropTypes.any,
        name:          PropTypes.string.isRequired,
        setValidators: PropTypes.func,
        Component:     PropTypes.func.isRequired,
        validators:    PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.func), PropTypes.func]),
    };

    static defaultProps = {
        defaultValue:  undefined,
        validators:    [],
        setValidators: emptyFunc,
    };

    constructor(props) {
        super(props);
        const {name} = props;
        if (!name || name === '') throw new Error('FormField must have name props');
    }

    setValidators = setValidators => {
        const {name, validators} = this.props;
        setValidators(name, validators);
    };

    render() {
        const {
            Component, validators, setValidators: setV, defaultValue, name, ...rest
        } = this.props;

        return (
            <div>
                <FormContext.Consumer>
                    {context => {
                        const {
                            onBlur, onFocus, onChange, values, errors, asyncErrors, setValidators,
                        } = context;
                        this.setValidators(setValidators);
                        let value = getArrayValue(name, values);
                        // We need it because when we import old data and format doesn't equal the new one
                        let isTypeEquals = true;
                        if (defaultValue) {
                            if (Array.isArray(value) !== Array.isArray(defaultValue)
                                || typeof defaultValue !== typeof value) {
                                isTypeEquals = false;
                            }
                        }
                        if (value === undefined || !isTypeEquals) {
                            value = defaultValue;
                        }
                        if (Array.isArray(value)) value = [...value];

                        return (
                            <Component
                                {...rest}
                                name={name}
                                error={getArrayValue(name, errors, true) || getArrayValue(name, asyncErrors, true)}
                                value={value}
                                onChange={onChange}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        );
                    }}
                </FormContext.Consumer>
            </div>
        );
    }
}

export default FormField;
