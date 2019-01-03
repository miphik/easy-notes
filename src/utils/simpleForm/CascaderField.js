import {Cascader, Form} from 'antd';
import {emptyFunc} from 'utils/General';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

const FormItem = Form.Item;
const STYLES = {
    cascader: {width: '100%'},
};

class CascaderField extends PureComponent {
    onChange = val => {
        const {
            name, onChange, asString, joinString,
        } = this.props;
        let value = val;
        if (asString) value = joinString(value);
        return onChange(name, value, {validateEveryChange: true});
    };

    render() {
        const {
            filedNames, options, value, onChange, label, required, error, extra, name, onFocus, onBlur,
            asString, joinString, splitString, children, ...rest
        } = this.props;

        return (
            <FormItem
                className="CascaderField__label"
                label={label}
                required={required}
                validateStatus={error ? 'error' : undefined}
                help={error || undefined}
                extra={extra}
            >
                <Cascader
                    {...rest}
                    onChange={this.onChange}
                    onBlur={emptyFunc}
                    onFocus={() => onFocus(name)}
                    fieldNames={filedNames}
                    options={options}
                    value={asString ? splitString(value) : value}
                    style={STYLES.cascader}
                    prefix={null}
                />
                {children}
            </FormItem>
        );
    }
}

CascaderField.defaultProps = {
    error:       undefined,
    extra:       undefined,
    required:    false,
    asString:    false,
    label:       undefined,
    children:    null,
    value:       [],
    onChange:    emptyFunc,
    joinString:  value => value.join('/'),
    splitString: value => value.split('/'),
    options:     [],
    filedNames:  {
        label:    'label',
        value:    'value',
        children: 'children',
    },
};

CascaderField.propTypes = {
    name:        PropTypes.string.isRequired,
    onFocus:     PropTypes.func.isRequired,
    onBlur:      PropTypes.func.isRequired,
    error:       PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:       PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required:    PropTypes.bool,
    asString:    PropTypes.bool,
    label:       PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children:    PropTypes.node,
    // eslint-disable-next-line react/forbid-prop-types
    value:       PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    onChange:    PropTypes.func,
    joinString:  PropTypes.func,
    splitString: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    options:     PropTypes.array,
    filedNames:  PropTypes.shape({
        label:    PropTypes.string.isRequired,
        value:    PropTypes.string.isRequired,
        children: PropTypes.string.isRequired,
    }),
};

export default CascaderField;
