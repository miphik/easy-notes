// @flow
import {Button, Modal, TreeSelect} from 'antd';
import CustomForm from 'components/Form/CustomForm';
import FormField from 'components/Form/FormField';
import simpleForm from 'components/Form/simpleForm';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import type {CategoryType} from 'types/NoteType';
import {emptyFunc} from 'utils/General';
import InputField from 'utils/simpleForm/InputField';
import SelectField from 'utils/simpleForm/SelectField';
import TransferField from 'utils/simpleForm/TransferField';
import TreeSelectField from 'utils/simpleForm/TreeSelectField';
import {required} from 'utils/simpleForm/validators';
import './styles.styl';

const MESSAGES = {
    buttonCancel:        <Fm id="CategoryForm.button_cancel" defaultMessage="Cancel"/>,
    buttonCreate:        <Fm id="CategoryForm.button_create" defaultMessage="Create"/>,
    buttonUpdate:        <Fm id="CategoryForm.button_update" defaultMessage="Update"/>,
    createCategoryTitle: <Fm id="CategoryForm.render.create_category_title" defaultMessage="Create new category"/>,
    updateCategoryTitle: <Fm id="CategoryForm.render.update_category_title" defaultMessage="Update category"/>,
};

const FILTER_CATEGORY = (inputValue, treeNode) => {
    return treeNode.props.title.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
};
const getCategoryKey = (category: CategoryType) => category.uuid;
const getCategoryTitle = (category: CategoryType) => category.title;

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
        const {
            initialValues, isVisible, isUpdating, isNew, categories,
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
                        name="parent"
                        label="Parent"
                        treeData={categories}
                        disabled={!isNew}
                        placeholder="Parent"
                        showCheckedStrategy={TreeSelect.SHOW_ALL}
                        // extractValue={getCategoryKey}
                        // extractTitle={getCategoryTitle}
                        filterTreeNode={FILTER_CATEGORY}
                        treeDefaultExpandedKeys={initialValues.parent ? [initialValues.parent] : []}
                        allowClear
                        showSearch
                        Component={TreeSelectField}
                    />
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
