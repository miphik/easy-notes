import {Form, Input} from 'antd';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {emptyFunc} from 'utils/General';

const FormItem = Form.Item;
const {TextArea} = Input;

class InputField extends PureComponent {
    render() {
        const {
            value, onChange, label, required, error, extra, type, name, onBlur, onFocus, children, validateEveryChange,
            inputRef,
            ...rest
        } = this.props;
        const Component = type === 'textarea' ? TextArea : Input;

        return (
            <FormItem
                className="InputField__label"
                label={label}
                required={required}
                validateStatus={error ? 'error' : undefined}
                help={error || undefined}
                extra={extra}
            >
                <Component
                    {...rest}
                    ref={inputRef}
                    value={value}
                    onChange={val => onChange(name, val, {validateEveryChange})}
                    onBlur={() => onBlur(name)}
                    onFocus={() => onFocus(name)}
                    type={type}
                />
                {children}
            </FormItem>
        );
    }
}

InputField.defaultProps = {
    type:                'text',
    error:               undefined,
    extra:               undefined,
    required:            false,
    validateEveryChange: false,
    label:               undefined,
    value:               '',
    onChange:            emptyFunc,
    children:            null,
    inputRef:            null,
};

InputField.propTypes = {
    name:                PropTypes.string.isRequired,
    onBlur:              PropTypes.func.isRequired,
    onFocus:             PropTypes.func.isRequired,
    type:                PropTypes.string,
    error:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required:            PropTypes.bool,
    validateEveryChange: PropTypes.bool,
    label:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:               PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    onChange:            PropTypes.func,
    children:            PropTypes.node,
    inputRef:            PropTypes.object,
};

export default InputField;
