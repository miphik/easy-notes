import {Form, Radio} from 'antd';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {emptyFunc} from 'utils/General';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ToogleListField extends PureComponent {
    renderOptions = () => {
        const {options, extractValue, extractTitle} = this.props;
        return options.map(option => (
            <RadioButton key={extractValue(option)} value={extractValue(option)} title={extractTitle(option)}>
                {extractTitle(option)}
            </RadioButton>
        ));
    };

    render() {
        const {
            value, onChange, required, label, disabled, size, error, extra, name, children, mapValue, resetField,
        } = this.props;
        return (
            <Form.Item
                className="ToogleListField__label"
                label={label}
                required={required}
                validateStatus={error ? 'error' : undefined}
                help={error || undefined}
                extra={extra}
            >
                <RadioGroup
                    {...{
                        disabled,
                        size,
                        value:    mapValue(value),
                        onChange: val => onChange(name, val, {resetField}),
                    }}
                >
                    {this.renderOptions()}
                </RadioGroup>
                {children}
            </Form.Item>
        );
    }
}

ToogleListField.propTypes = {
    name:         PropTypes.string.isRequired,
    onBlur:       PropTypes.func.isRequired,
    onFocus:      PropTypes.func.isRequired,
    options:      PropTypes.array.isRequired,
    resetField:   PropTypes.string,
    type:         PropTypes.string,
    error:        PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:        PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required:     PropTypes.bool,
    label:        PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:        PropTypes.any,
    onChange:     PropTypes.func,
    disabled:     PropTypes.bool,
    size:         PropTypes.string,
    extractValue: PropTypes.func,
    extractTitle: PropTypes.func,
    children:     PropTypes.node,
    mapValue:     PropTypes.func,
};

ToogleListField.defaultProps = {
    type:         'text',
    error:        undefined,
    resetField:   undefined,
    extra:        undefined,
    required:     false,
    label:        undefined,
    value:        '',
    onChange:     emptyFunc,
    disabled:     false,
    size:         '',
    extractValue: item => item.value,
    extractTitle: item => item.label,
    mapValue:     value => `${value}`,
    children:     null,
};

export default ToogleListField;
