import {Form, Select} from 'antd';
import {emptyFunc} from 'utils/General';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

const FormItem = Form.Item;
const {Option} = Select;
const STYLES = {
    select: {width: '100%'},
};

class SelectField extends PureComponent {
    renderOptions = () => {
        const {options, extractValue, extractTitle} = this.props;
        return options.map(option => (
            <Option
                key={extractValue(option)}
                value={extractValue(option)}
                title={extractTitle(option)}
            >
                {extractTitle(option)}
            </Option>
        ));
    };

    render() {
        const {
            value, onChange, label, required, error, extra, name, onBlur, onFocus, antOptions,
            extractValue, extractTitle, children, mode, ...rest
        } = this.props;
        return (
            <FormItem
                className="SelectField__label"
                label={label}
                required={required}
                validateStatus={error ? 'error' : undefined}
                help={error || undefined}
                extra={extra}
            >
                <Select
                    {...rest}
                    mode={mode}
                    value={value}
                    style={STYLES.select}
                    onChange={val => onChange(name, val)}
                    onBlur={val => onBlur(name, val)}
                    onFocus={val => onFocus(name, val)}
                    prefix={null}
                >
                    {antOptions || this.renderOptions()}
                </Select>
                {children}
            </FormItem>
        );
    }
}

SelectField.defaultProps = {
    options:      [],
    antOptions:   null,
    error:        undefined,
    extra:        undefined,
    required:     false,
    label:        undefined,
    value:        undefined,
    mode:         'default',
    onChange:     emptyFunc,
    extractValue: item => item.value,
    extractTitle: item => item.title,
    children:     null,
};

SelectField.propTypes = {
    options: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                key:   PropTypes.string,
                title: PropTypes.string,
                value: PropTypes.string,
            }),
        ),
        PropTypes.arrayOf(PropTypes.string),
    ]),
    antOptions:   PropTypes.arrayOf(PropTypes.node),
    name:         PropTypes.string.isRequired,
    onBlur:       PropTypes.func.isRequired,
    onFocus:      PropTypes.func.isRequired,
    error:        PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:        PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required:     PropTypes.bool,
    label:        PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:        PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    mode:         PropTypes.oneOf(['default', 'multiple', 'tags', 'combobox']),
    onChange:     PropTypes.func,
    extractValue: PropTypes.func,
    extractTitle: PropTypes.func,
    children:     PropTypes.node,
};

export default SelectField;
