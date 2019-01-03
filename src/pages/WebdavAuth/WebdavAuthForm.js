import {Button, Icon,} from 'antd';
import CustomForm from 'components/Form/CustomForm';
import FormField from 'components/Form/FormField';
import simpleForm from 'components/Form/simpleForm';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {YANDEX_WEBDAV_URL} from 'src/constants/general';
import InputField from 'utils/simpleForm/InputField';
import ToogleListField from 'utils/simpleForm/ToogleListField';
import {required} from 'utils/simpleForm/validators';
import './styles.styl';

const WEBDAV_CUSTOM_TYPE = 'custom';
const WEBDAV_YANDEX_TYPE = 'yandex';
const WEBDAV_TYPES = [
    {
        label: <Fm id="WEBDAV_TYPES.custom" defaultMessage="Custom url"/>,
        value: WEBDAV_CUSTOM_TYPE,
    },
    {
        label: <Fm id="WEBDAV_TYPES.yandex" defaultMessage="Yandex Disk"/>,
        value: WEBDAV_YANDEX_TYPE,
        url: YANDEX_WEBDAV_URL,
    },
];

@simpleForm('WebdavAuthForm')
class WebdavAuthForm extends React.PureComponent {

    constructor(props) {
        super(props);
        this.urlInputRef = React.createRef();
    }

    state = {
        webdavType: WEBDAV_CUSTOM_TYPE,
    };

    static propTypes = {
        active: PropTypes.bool,
    };

    static defaultProps = {
        active: false,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const {formValues, changeField} = nextProps;
        const {webdavType} = prevState;
        if (formValues.type && formValues.type !== webdavType) {
            if (formValues.type && formValues.type !== WEBDAV_CUSTOM_TYPE) {
                const webdavType = WEBDAV_TYPES.find(item => item.value === formValues.type);
                if (webdavType && webdavType.url) changeField('url', webdavType.url);
            } else {
                changeField('url', '');
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.formValues.type !== this.props.formValues.type) {
            if (this.props.formValues.type === WEBDAV_CUSTOM_TYPE) {
                this.urlInputRef.current.focus();
            }
            this.setState({webdavType: this.props.formValues.type});
        }
    }

    onFormSubmit = this.props.onSubmitForm(values => {
        const {resetForm, onSubmit} = this.props;
        if (onSubmit(values)) resetForm();
    });

    render() {
        const {formValues} = this.props;
        const type = formValues.type || WEBDAV_CUSTOM_TYPE;
        return (
            <CustomForm layout="vertical" onSubmit={this.onFormSubmit} className="WebdavAuthForm">
                <FormField
                    size="small"
                    defaultValue={WEBDAV_CUSTOM_TYPE}
                    name="type"
                    options={WEBDAV_TYPES}
                    Component={ToogleListField}
                />
                <FormField
                    name="url"
                    label="Url"
                    validators={required}
                    required
                    autoFocus
                    inputRef={this.urlInputRef}
                    disabled={type !== WEBDAV_CUSTOM_TYPE}
                    placeholder="Url"
                    prefix={<Icon type="cloud-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    Component={InputField}
                />
                <FormField
                    name="username"
                    label="Username"
                    validators={required}
                    required
                    placeholder="Username"
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    Component={InputField}
                />
                <FormField
                    name="password"
                    label="Password"
                    validators={required}
                    required
                    type="password"
                    placeholder="Password"
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    Component={InputField}
                />
                <Button className="WebdavAuthForm__submit" type="primary" onClick={this.onFormSubmit}>
                    Log in
                </Button>
            </CustomForm>
        );
    }
}

export default WebdavAuthForm;
