import {Form} from 'antd';
import JsonView from 'app/js/components/JsonView';
import {emptyFunc} from 'utils/General';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

const FormItem = Form.Item;
const styles = {
    disableWall: {
        position:        'absolute',
        zIndex:          10,
        width:           '100%',
        display:         'flex',
        height:          '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
};

class JsonField extends PureComponent {
    render() {
        const {
            value, onChange, label, required, error, extra, name, onBlur, disabled, children, validateEveryChange,
            enableClipboard,
            ...rest
        } = this.props;

        return (
            <FormItem
                className="JsonField__label"
                label={label}
                required={required}
                validateStatus={error ? 'error' : undefined}
                help={error || undefined}
                extra={extra}

            >
                {disabled && <span style={styles.disableWall}/>}

                <JsonView
                    displayDataTypes={false}
                    displayObjectSize={false}
                    name={null}
                    enableClipboard={enableClipboard}
                    iconStyle="square"
                    {...rest}
                    onAdd={disabled ? undefined : ({updated_src}) => onChange(name, updated_src, {validateEveryChange})}
                    onDelete={disabled ? undefined : ({updated_src}) => onChange(
                        name,
                        updated_src,
                        validateEveryChange,
                    )}
                    onEdit={disabled ? undefined : ({updated_src}) => onChange(
                        name,
                        updated_src,
                        {validateEveryChange},
                    )}
                    src={value}
                />
                {children}
            </FormItem>
        );
    }
}

JsonField.defaultProps = {
    error:               undefined,
    extra:               undefined,
    required:            false,
    disabled:            false,
    validateEveryChange: false,
    label:               undefined,
    value:               undefined,
    onChange:            emptyFunc,
    children:            null,
    enableClipboard:     false,
};

JsonField.propTypes = {
    name:                PropTypes.string.isRequired,
    onBlur:              PropTypes.func.isRequired,
    onFocus:             PropTypes.func.isRequired,
    error:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required:            PropTypes.bool,
    disabled:            PropTypes.bool,
    validateEveryChange: PropTypes.bool,
    label:               PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:               PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onChange:            PropTypes.func,
    children:            PropTypes.node,
    enableClipboard:     PropTypes.bool,
};

export default JsonField;
