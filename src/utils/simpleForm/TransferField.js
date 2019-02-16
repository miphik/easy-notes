import {Form, Input, Transfer} from 'antd';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {emptyFunc} from 'utils/General';

const FormItem = Form.Item;
const {TextArea} = Input;

class TransferField extends PureComponent {
    render() {
        const {
            value, onChange, label, required, error, extra, type, name, onBlur, onFocus, children, validateEveryChange,
            inputRef, dataSource, filterOption, showSearch,
            ...rest
        } = this.props;
        const Component = type === 'textarea' ? TextArea : Input;

        return (
            <FormItem
                className="TransferField__label"
                label={label}
                required={required}
                validateStatus={error ? 'error' : undefined}
                help={error || undefined}
                extra={extra}
            >
                <Transfer
                    dataSource={dataSource}
                    showSearch={showSearch}
                    filterOption={filterOption}
                    targetKeys={value}
                    onChange={val => {
                        console.log(22222, val);
                        onChange(name, val);}}
                    // onSearch={this.handleSearch}
                    rowKey={record => record.uuid}
                    render={item => item.title}
                />
            </FormItem>
        );
    }
}

TransferField.defaultProps = {
    type:                'text',
    error:               undefined,
    extra:               undefined,
    required:            false,
    validateEveryChange: false,
    label:               undefined,
    value:               [],
    onChange:            emptyFunc,
    children:            null,
    inputRef:            null,
};

TransferField.propTypes = {
    name:                PropTypes.string.isRequired,
    onBlur:              PropTypes.func.isRequired,
    onFocus:             PropTypes.func.isRequired,
    type:                PropTypes.string,
    error:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required:            PropTypes.bool,
    validateEveryChange: PropTypes.bool,
    label:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:               PropTypes.array,
    onChange:            PropTypes.func,
    children:            PropTypes.node,
    inputRef:            PropTypes.object,
};

export default TransferField;
