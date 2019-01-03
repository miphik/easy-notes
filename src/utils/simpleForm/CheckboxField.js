import {Checkbox, Form} from 'antd';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {emptyFunc} from 'utils/General';

class CheckboxField extends PureComponent {
    render() {
        const {
            value, onChange, required, label, disabled, error, extra, name,
        } = this.props;
        return (
            <Form.Item
                {...{
                    required,
                    extra,
                    help:           error || undefined,
                    validateStatus: error ? 'error' : undefined,
                }}
            >
                <Checkbox
                    checked={value || false}
                    disabled={disabled}
                    onChange={e => onChange(name, e.target.checked)}
                >
                    {label}
                </Checkbox>
            </Form.Item>
        );
    }
}

CheckboxField.propTypes = {
    name:     PropTypes.string.isRequired,
    onBlur:   PropTypes.func.isRequired,
    onFocus:  PropTypes.func.isRequired,
    type:     PropTypes.string,
    error:    PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:    PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required: PropTypes.bool,
    label:    PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:    PropTypes.any,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
};

CheckboxField.defaultProps = {
    type:     'text',
    error:    undefined,
    extra:    undefined,
    required: false,
    disabled: false,
    label:    undefined,
    value:    '',
    onChange: emptyFunc,
};

export default CheckboxField;
