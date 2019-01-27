import {Button, Icon} from 'antd';
import CustomForm from 'components/Form/CustomForm';
import FormField from 'components/Form/FormField';
import simpleForm from 'components/Form/simpleForm';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {formatMessageIntl} from 'services/LocaleService';
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
        url:   YANDEX_WEBDAV_URL,
    },
];
const MESSAGES = {
    urlLabel:            <Fm id="WebdavAuthForm.url_label" defaultMessage="Url"/>,
    urlPlaceholder:      <Fm id="WebdavAuthForm.url_placeholder" defaultMessage="Url"/>,
    usernameLabel:       <Fm id="WebdavAuthForm.username_placeholder" defaultMessage="Username"/>,
    usernamePlaceholder: <Fm id="WebdavAuthForm.username_placeholder" defaultMessage="Username"/>,
    passwordLabel:       <Fm id="WebdavAuthForm.password_placeholder" defaultMessage="Password"/>,
    passwordPlaceholder: <Fm id="WebdavAuthForm.password_placeholder" defaultMessage="Password"/>,
    loginButton:         <Fm id="WebdavAuthForm.logn_button" defaultMessage="Log in"/>,
};

@simpleForm('WebdavAuthForm')
class WebdavAuthForm extends React.PureComponent {
    state = {
        webdavType: WEBDAV_CUSTOM_TYPE,
    };

    static propTypes = {
        formValues:   PropTypes.object.isRequired,
        resetForm:    PropTypes.func.isRequired,
        onSubmit:     PropTypes.func.isRequired,
        onSubmitForm: PropTypes.func.isRequired,
    };

    static defaultProps = {};

    // eslint-disable-next-line
    constructor(props) {
        super(props);
        this.urlInputRef = React.createRef();
    }

    // eslint-disable-next-line
    static getDerivedStateFromProps(nextProps, prevState) {
        const {formValues, changeField} = nextProps;
        const {webdavType} = prevState;
        if (formValues.type && formValues.type !== webdavType) {
            if (formValues.type && formValues.type !== WEBDAV_CUSTOM_TYPE) {
                // eslint-disable-next-line
                const webdavTypeFound = WEBDAV_TYPES.find(item => item.value === formValues.type);
                if (webdavTypeFound && webdavTypeFound.url) changeField('url', webdavTypeFound.url);
            } else {
                changeField('url', '');
            }
        }
        return null;
    }

    // eslint-disable-next-line
    componentDidUpdate(prevProps, prevState) {
        const {formValues} = this.props;
        if (prevProps.formValues.type !== formValues.type) {
            if (formValues.type === WEBDAV_CUSTOM_TYPE) {
                this.urlInputRef.current.focus();
            }
            // eslint-disable-next-line
            this.setState({webdavType: formValues.type});
        }
    }

    // eslint-disable-next-line
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
                    label={MESSAGES.urlLabel}
                    validators={required}
                    required
                    autoFocus
                    inputRef={this.urlInputRef}
                    disabled={type !== WEBDAV_CUSTOM_TYPE}
                    placeholder={formatMessageIntl(MESSAGES.urlPlaceholder)}
                    prefix={<Icon type="cloud-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    Component={InputField}
                />
                <FormField
                    name="username"
                    label={MESSAGES.usernameLabel}
                    validators={required}
                    required
                    placeholder={formatMessageIntl(MESSAGES.usernamePlaceholder)}
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    Component={InputField}
                />
                <FormField
                    name="password"
                    label={MESSAGES.passwordLabel}
                    validators={required}
                    required
                    type="password"
                    placeholder={formatMessageIntl(MESSAGES.passwordPlaceholder)}
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    Component={InputField}
                />
                <Button className="WebdavAuthForm__submit" type="primary" onClick={this.onFormSubmit}>
                    {MESSAGES.loginButton}
                </Button>
            </CustomForm>
        );
    }
}

export default WebdavAuthForm;
