import {Form, Switch} from 'antd';
import TypeUtils from 'app/js/utils/TypeUtils';
import {emptyFunc} from 'utils/General';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

const FormItem = Form.Item;
const STYLES = {
    container: {cursor: 'pointer'},
    extra:     {top: -30},
};

class SwitchField extends PureComponent {
    render() {
        const {
            value, onChange, label, required, error, extra, disabled, name, ...rest
        } = this.props;
        const onWrapperClick = disabled ? emptyFunc : () => onChange(name, !TypeUtils.isTrue(value));
        return (
            <div
                style={{cursor: disabled ? 'not-allowed' : 'pointer'}}
                className="SwitchField"
                onClick={onWrapperClick}
                role="button"
                tabIndex={0}
                onKeyDown={onWrapperClick}
            >
                <FormItem
                    className="SwitchField__label"
                    label={label}
                    required={required}
                    validateStatus={error ? 'error' : undefined}
                    help={error || undefined}
                >
                    <Switch
                        {...rest}
                        disabled={disabled}
                        checked={TypeUtils.isTrue(value)}
                        onChange={val => onChange(name, val)}
                    />
                </FormItem>
                <sup style={STYLES.extra}>{extra}</sup>

            </div>
        );
    }
}

SwitchField.defaultProps = {
    type:     'text',
    error:    undefined,
    extra:    undefined,
    required: false,
    disabled: false,
    label:    undefined,
    value:    '',
    onChange: emptyFunc,
};

SwitchField.propTypes = {
    name:     PropTypes.string.isRequired,
    type:     PropTypes.string,
    error:    PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:    PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    label:    PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:    PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    onChange: PropTypes.func,
};

export default SwitchField;
