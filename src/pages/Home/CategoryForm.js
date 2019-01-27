// @flow
import {Button, Modal} from 'antd';
import CustomForm from 'components/Form/CustomForm';
import FormField from 'components/Form/FormField';
import simpleForm from 'components/Form/simpleForm';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {emptyFunc} from 'utils/General';
import InputField from 'utils/simpleForm/InputField';
import {required} from 'utils/simpleForm/validators';
import './styles.styl';

const MESSAGES = {
    buttonCancel:        <Fm id="CategoryForm.button_cancel" defaultMessage="Cancel"/>,
    buttonCreate:        <Fm id="CategoryForm.button_create" defaultMessage="Create"/>,
    buttonUpdate:        <Fm id="CategoryForm.button_update" defaultMessage="Update"/>,
    createCategoryTitle: <Fm id="CategoryForm.render.create_category_title" defaultMessage="Create new category"/>,
    updateCategoryTitle: <Fm id="CategoryForm.render.update_category_title" defaultMessage="Update category"/>,
};

@simpleForm('CategoryForm')
class CategoryForm extends React.PureComponent {
    static propTypes = {
        isVisible:     PropTypes.bool,
        isUpdating:    PropTypes.bool,
        onClose:       PropTypes.func,
        isNew:         PropTypes.bool,
        formValues:    PropTypes.object.isRequired,
        resetForm:     PropTypes.func.isRequired,
        onSubmit:      PropTypes.func.isRequired,
        onSubmitForm:  PropTypes.func.isRequired,
        // eslint-disable-next-line
        initialValues: PropTypes.object,
    };

    static defaultProps = {
        isVisible:     false,
        isUpdating:    false,
        isNew:         true,
        onClose:       emptyFunc,
        initialValues: {},
    };

    // eslint-disable-next-line
    onFormSubmit = this.props.onSubmitForm(values => {
        const {resetForm, onSubmit} = this.props;
        if (onSubmit(values)) resetForm();
    });

    onClose = () => {
        // eslint-disable-next-line react/prop-types
        const {onClose, resetForm} = this.props;
        resetForm();
        onClose();
    };

    render() {
        /*
            required string uuid = 1;
    required string parent_uuid = 2;
    required string updated_at = 6;
    required string created_at = 7;
    required bool is_deleted = 8;
        * */
        const {
            formValues, isVisible, isUpdating, isNew,
        } = this.props;
        return (
            <Modal
                title={isNew ? MESSAGES.createCategoryTitle : MESSAGES.updateCategoryTitle}
                footer={(
                    <React.Fragment>
                        <Button disabled={isUpdating} key="close" onClick={this.onClose}>
                            {MESSAGES.buttonCancel}
                        </Button>
                        <Button
                            type="primary"
                            onClick={this.onFormSubmit}
                            loading={isUpdating}
                            icon="save"
                        >
                            {isNew ? MESSAGES.buttonCreate : MESSAGES.buttonUpdate}
                        </Button>
                    </React.Fragment>
                )}
                visible={isVisible}
                onCancel={this.onClose}
            >
                <CustomForm layout="vertical" onSubmit={this.onFormSubmit} className="CategoryForm">
                    <FormField
                        name="title"
                        label="Title"
                        validators={required}
                        required
                        autoFocus
                        placeholder="Title"
                        Component={InputField}
                    />
                    <FormField
                        name="description"
                        label="Description"
                        placeholder="Description"
                        type="textarea"
                        Component={InputField}
                    />
                </CustomForm>
            </Modal>
        );
    }
}

export default CategoryForm;
