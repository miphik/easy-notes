import {
    Button, Form, Icon, Input, Radio,
} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import './styles.styl';
import {YANDEX_WEBDAV_URL} from '../../constants/general';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const WEBDAV_CUSTOM_TYPE = 'custom';
const WEBDAV_YANDEX_TYPE = 'yandex';
const WEBDAV_TYPES = [
    {
        title: <Fm id="WEBDAV_TYPES.custom" defaultMessage="Custom url"/>,
        value: WEBDAV_CUSTOM_TYPE,
    },
    {
        title: <Fm id="WEBDAV_TYPES.yandex" defaultMessage="Yandex Disk"/>,
        value: WEBDAV_YANDEX_TYPE,
        url:   YANDEX_WEBDAV_URL,
    },
];

class WebdavAuthForm extends React.PureComponent {
    static propTypes = {
        active: PropTypes.bool,
    };

    static defaultProps = {
        active: false,
    };

    onFormValuesChange = (props, values) => {
        console.log(2113221321, props, values);
        const {form} = this.props;
        const {setFieldsValue} = form;
    };

    render() {
        const {form} = this.props;
        const {getFieldDecorator, getFieldValue} = form;
        const typeValue = getFieldValue('type');
        console.log(111111, form, typeValue);
        return (
            <Form onSubmit={this.handleSubmit} className="WebdavAuthForm">
                <FormItem>
                    {getFieldDecorator('type', {
                        initialValue:   WEBDAV_CUSTOM_TYPE,
                        onValuesChange: this.onFormValuesChange,
                        rules:          [{required: true, message: 'Please input the Url!'}],
                    })(
                        <RadioGroup size="small">
                            {WEBDAV_TYPES.map(type => (
                                <RadioButton
                                    value={type.value}
                                    key={type.value}
                                >
                                    {type.title}
                                </RadioButton>
                            ))}
                        </RadioGroup>,
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('url', {
                        rules: [{required: true, message: 'Please input the Url!'}],
                    })(
                        <Input
                            disabled={typeValue !== WEBDAV_CUSTOM_TYPE}
                            className="WebdavAuthForm__input_url"
                            prefix={<Icon type="cloud-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="Url"
                        />,
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('user', {
                        rules: [{required: true, message: 'Please input the Username!'}],
                    })(
                        <Input
                            className="WebdavAuthForm__input_path"
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="Username"
                        />,
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('pass', {
                        rules: [{required: true, message: 'Please input your Password!'}],
                    })(
                        <Input
                            className="WebdavAuthForm__input_password"
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </FormItem>
                <Button className="WebdavAuthForm__submit" type="primary" htmlType="submit">
                    Log in
                </Button>
            </Form>
        );
    }
}

export default Form.create({
    onFieldsChange(props, values) {
        props.typeValue.type = values.type;
    },
    mapPropsToFields(props) {
        console.log(props);
    },
})(WebdavAuthForm);
