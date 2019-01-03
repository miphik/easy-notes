import {AutoComplete, Form} from 'antd';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {emptyFunc} from 'utils/General';

const FormItem = Form.Item;
const {Option} = AutoComplete;
const STYLES = {
    select: {width: '100%'},
};

class AutocompleteField extends PureComponent {
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
            value, onChange, label, required, error, extra, name, onBlur, onFocus, ...rest
        } = this.props;
        return (
            <FormItem
                label={label}
                required={required}
                validateStatus={error ? 'error' : undefined}
                help={error || undefined}
                extra={extra}
            >
                <AutoComplete
                    {...rest}
                    value={value}
                    style={STYLES.select}
                    onChange={val => onChange(name, val)}
                    onBlur={val => onBlur(name, val)}
                    onFocus={val => onFocus(name, val)}
                    dropdownMatchSelectWidth={false}
                    prefix={null}
                >
                    {this.renderOptions()}
                </AutoComplete>
            </FormItem>
        );
    }
}

AutocompleteField.defaultProps = {
    options:      [],
    error:        undefined,
    extra:        undefined,
    required:     false,
    label:        undefined,
    value:        '',
    onChange:     emptyFunc,
    extractValue: item => item.value,
    extractTitle: item => item.title,
};

AutocompleteField.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            key:   PropTypes.string,
            title: PropTypes.string,
            value: PropTypes.string,
        }),
    ),
    name:         PropTypes.string.isRequired,
    onBlur:       PropTypes.func.isRequired,
    onFocus:      PropTypes.func.isRequired,
    error:        PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:        PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required:     PropTypes.bool,
    label:        PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:        PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    onChange:     PropTypes.func,
    extractValue: PropTypes.func,
    extractTitle: PropTypes.func,
};

export default AutocompleteField;
