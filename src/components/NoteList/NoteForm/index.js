// @flow
import {Button, Modal} from 'antd';
import CustomForm from 'components/Form/CustomForm';
import FormField from 'components/Form/FormField';
import simpleForm from 'components/Form/simpleForm';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import type {NoteType} from 'types/NoteType';
import {emptyFunc} from 'utils/General';
import InputField from 'utils/simpleForm/InputField';
import {required} from 'utils/simpleForm/validators';
import {SaveOutlined} from '@ant-design/icons';
import './styles.styl';

type PropsType = {
    isVisible?: boolean,
    isUpdating?: boolean,
    onClose?: () => void,
    isNew?: boolean,
    formValues: NoteType,
    initialValues?: NoteType,
    resetForm: () => void,
    onSubmit: () => void,
    onSubmitForm: () => void,
};

const MESSAGES = {
    buttonCancel:    <Fm id="NoteForm.button_cancel" defaultMessage="Cancel"/>,
    buttonCreate:    <Fm id="NoteForm.button_create" defaultMessage="Create"/>,
    buttonUpdate:    <Fm id="NoteForm.button_update" defaultMessage="Update"/>,
    createNoteTitle: <Fm id="NoteForm.render.create_note_title" defaultMessage="Create new note"/>,
    updateNoteTitle: <Fm id="NoteForm.render.update_note_title" defaultMessage="Update note"/>,
};

@simpleForm('NoteForm')
class NoteForm extends React.PureComponent<PropsType> {
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
            initialValues, isVisible, isUpdating, isNew,
        } = this.props;
        return (
            <Modal
                title={isNew ? MESSAGES.createNoteTitle : MESSAGES.updateNoteTitle}
                footer={(
                    <>
                        <Button disabled={isUpdating} key="close" onClick={this.onClose}>
                            {MESSAGES.buttonCancel}
                        </Button>
                        <Button
                            type="primary"
                            onClick={this.onFormSubmit}
                            loading={isUpdating}
                            icon={<SaveOutlined/>}
                        >
                            {isNew ? MESSAGES.buttonCreate : MESSAGES.buttonUpdate}
                        </Button>
                    </>
                )}
                visible={isVisible}
                onCancel={this.onClose}
            >
                <CustomForm layout="vertical" onSubmit={this.onFormSubmit} className="NoteForm">
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

export default NoteForm;
