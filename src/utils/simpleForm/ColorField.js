import {Button, Form, Popover} from 'antd';
import {emptyFunc} from 'utils/General';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {SketchPicker} from 'react-color';
import {FormattedMessage as Fm} from 'react-intl';

const FormItem = Form.Item;
const colorToString = color => `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
const DEFAULT_EMPTY_TEXT = <Fm id="ColorField.defaultProps.emptyText" defaultMessage="EMPTY"/>;

const STYLES = {
    button: {
        marginLeft:   16,
        marginBottom: 1,
    },
    container: {
        display:    'flex',
        alignItems: 'center',
        flex:       1,
    },
    wrapper: {
        display:        'flex',
        justifyContent: 'center',
        alignItems:     'center',
    },
    backgroundPattern: {

        position:   'absolute',
        top:        0,
        right:      0,
        bottom:     0,
        left:       0,
        background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP'
                    + '3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center',
    },
    chooser: {
        position:     'absolute',
        cursor:       'pointer',
        top:          0,
        right:        0,
        bottom:       0,
        left:         0,
        borderRadius: 2,
        zIndex:       2,
        background:   'rgba(241, 112, 19, 0.31)',
        boxShadow:    'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.25) 0px 0px 4px inset',
    },
};

class ColorField extends PureComponent {
    render() {
        const {
            value, onChange, label, required, error, extra, width, height, emptyText, showCleanButton, name, onBlur,
            onFocus, children, ...rest
        } = this.props;

        return (
            <FormItem
                className="ColorField__label"
                label={label}
                required={required}
                validateStatus={error ? 'error' : undefined}
                help={error || undefined}
                extra={extra}
            >
                <div style={STYLES.container}>
                    <Popover
                        content={(
                            <SketchPicker
                                {...rest}
                                color={value || ''}
                                onBlur={val => onBlur(name, val)}
                                onFocus={val => onFocus(name, val)}
                                onChange={color => onChange(name, color === null ? null : colorToString(color))}
                            />
                        )}
                        trigger="click"
                    >
                        <div
                            style={{
                                ...STYLES.wrapper,
                                width,
                                height,
                            }}
                        >
                            <div
                                style={{
                                    ...STYLES.chooser,
                                    width,
                                    height,
                                    background: value || '',
                                }}
                            />
                            <div
                                style={{
                                    ...STYLES.backgroundPattern,
                                    width,
                                    height,
                                }}
                            />
                            <div>
                                {!value && emptyText}
                            </div>
                        </div>

                    </Popover>
                    {!!showCleanButton
                    && <Button style={STYLES.button} icon="close" onClick={() => onChange(name, null)}/>}
                    {children}
                </div>

            </FormItem>
        );
    }
}


ColorField.defaultProps = {
    showCleanButton: true,
    emptyText:       DEFAULT_EMPTY_TEXT,
    width:           100,
    height:          35,
    error:           undefined,
    extra:           undefined,
    required:        false,
    label:           undefined,
    value:           '',
    onChange:        emptyFunc,
    children:        null,
};

ColorField.propTypes = {
    name:            PropTypes.string.isRequired,
    onBlur:          PropTypes.func.isRequired,
    onFocus:         PropTypes.func.isRequired,
    showCleanButton: PropTypes.bool,
    emptyText:       PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    width:           PropTypes.number,
    height:          PropTypes.number,
    error:           PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    extra:           PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required:        PropTypes.bool,
    label:           PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value:           PropTypes.string,
    onChange:        PropTypes.func,
    children:        PropTypes.node,
};

export default ColorField;
