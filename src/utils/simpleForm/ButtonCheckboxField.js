import {Button, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {emptyFunc} from 'utils/General';

class ButtonCheckboxField extends PureComponent {
    render() {
        const {
            value, onChange, name, icon, tooltip, transformReceiveValue, transformChangeValue, onChangeValue, ...rest
        } = this.props;
        const element = (
            <Button
                shape="circle"
                icon={icon}
                type={transformReceiveValue(value) ? 'primary' : 'default'}
                onClick={() => {
                    if (onChangeValue) onChangeValue(transformChangeValue(value));
                    else onChange(name, transformChangeValue(value));
                }}
                {...rest}
            />
        );
        return (
            tooltip
                ? (
                    <Tooltip title={tooltip} placement="topRight">
                        {element}
                    </Tooltip>
                )
                : element
        );
    }
}

ButtonCheckboxField.propTypes = {
    icon:                  PropTypes.string.isRequired,
    name:                  PropTypes.string.isRequired,
    tooltip:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:                 PropTypes.any,
    onChange:              PropTypes.func,
    transformReceiveValue: PropTypes.func,
    transformChangeValue:  PropTypes.func,
    onChangeValue:         PropTypes.func,
    disabled:              PropTypes.bool,
};

ButtonCheckboxField.defaultProps = {
    disabled:              false,
    value:                 false,
    tooltip:               null,
    onChange:              emptyFunc,
    onChangeValue:         null,
    transformReceiveValue: value => value,
    transformChangeValue:  value => !value,
};

export default ButtonCheckboxField;
