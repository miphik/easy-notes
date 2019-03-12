// @flow
import CButton from 'components/CButton';
import Popconfirmer from 'components/Popconfirmer';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import {CANCEL_CONFIRM_BUTTON_TEXT, CONFIRM_BUTTON_TEXT} from 'src/constants/text';
import type {ThemeType} from 'stores/ThemeStore';
import styles from './styles.styl';

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        confirmButton:   {display: 'flex', justifyContent: 'center'},
        buttonGroup:     {
            flex: 1,
        },
        buttonContainer: {
            margin: theme.scaleFactor * 8,
        },
        removeButton:    {
            color:    theme.color.button,
            ':hover': {
                color: theme.color.dangerButton,
            },
        },
        addButton:       {
            color:    theme.color.button,
            ':hover': {
                color: theme.color.buttonActive,
            },
        },
    }
));

type PropsType = {
    theme: ThemeType,
    addButtonIsDisabled?: boolean,
    showAddButton?: boolean,
    selectedItem: Object,
    deleteConfirmText: string,
    createNewItem: () => void,
    updateItem: () => void,
    deleteItem: () => void,
};

export default class ColumnToolbar extends React.PureComponent<PropsType> {
    state = {
        deleteConfirmIsOpen: false,
    };

    static defaultProps = {
        showAddButton:       true,
        addButtonIsDisabled: false,
    };

    toggleOpenDeleteConfirm = () => this.setState({deleteConfirmIsOpen: !this.state.deleteConfirmIsOpen});

    onClickConfirm = () => {
        const {deleteItem} = this.props;
        deleteItem();
        this.toggleOpenDeleteConfirm();
    };

    render() {
        const {
            theme, selectedItem, deleteConfirmText, createNewItem, updateItem, showAddButton, addButtonIsDisabled,
        } = this.props;
        const {deleteConfirmIsOpen} = this.state;
        const style = STYLES(theme);

        return (
            <div className={styles.button_container} style={style.buttonContainer}>
                <div className={styles.button_filler}/>
                {showAddButton ? (
                    <CButton
                        className={styles.add_button}
                        disabled={addButtonIsDisabled}
                        ghost
                        icon="plus"
                        onClick={createNewItem}
                        style={style.addButton}
                    />
                ) : null}
                <div
                    className={`${styles.button_group} ${selectedItem ? styles.button_group_show : ''}`}
                >
                    <CButton
                        className={styles.add_button}
                        ghost
                        icon="edit"
                        onClick={updateItem}
                        style={style.addButton}
                    />

                    <Popconfirmer
                        isOpen={deleteConfirmIsOpen}
                        onToggle={this.toggleOpenDeleteConfirm}
                        backgroundColor={theme.color.first}
                        textColor={theme.color.textMain}
                        scaleFactor={theme.scaleFactor}
                        content={(
                            <div>
                                {deleteConfirmText}
                                <div style={style.confirmButton}>
                                    <CButton
                                        className={styles.add_button}
                                        ghost
                                        icon="cross"
                                        onClick={this.toggleOpenDeleteConfirm}
                                        style={style.addButton}
                                    >
                                        {CANCEL_CONFIRM_BUTTON_TEXT}
                                    </CButton>
                                    <CButton
                                        className={styles.add_button}
                                        ghost
                                        icon="check"
                                        type="danger"
                                        onClick={this.onClickConfirm}
                                        style={style.removeButton}
                                    >
                                        {CONFIRM_BUTTON_TEXT}
                                    </CButton>
                                </div>
                            </div>
                        )}
                        trigger={(
                            <CButton
                                className={styles.add_button}
                                ghost
                                icon="delete"
                                type="danger"
                                style={style.removeButton}
                            />
                        )}
                    />
                </div>
            </div>
        );
    }
}
