import {Form} from 'antd';
import SegmentedCheckbox from 'app/js/components/SegmentedCheckbox';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {emptyFunc} from 'utils/General';

class SegmentedCheckboxField extends PureComponent {
    render() {
        const {
            value, onChange, required, error, extra, name, ...rest
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
                <SegmentedCheckbox
                    {...rest}
                    value={value}
                    onChange={val => onChange(name, val)}
                />
            </Form.Item>
        );
    }
}

SegmentedCheckboxField.propTypes = {
    name:     PropTypes.string.isRequired,
    onBlur:   PropTypes.func.isRequired,
    onFocus:  PropTypes.func.isRequired,
    type:     PropTypes.string,
    error:    PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:    PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required: PropTypes.bool,
    label:    PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:    PropTypes.array,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
};

SegmentedCheckboxField.defaultProps = {
    type:     'text',
    error:    undefined,
    extra:    undefined,
    required: false,
    disabled: false,
    label:    undefined,
    value:    [],
    onChange: emptyFunc,
};

export default SegmentedCheckboxField;
