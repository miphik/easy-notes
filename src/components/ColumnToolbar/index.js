// @flow
import CButton from 'components/CButton';
import Popconfirmer from 'components/Popconfirmer';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import {CONFIRM_BUTTON_TEXT} from 'src/constants/text';
import type {ThemeType} from 'stores/ThemeStore';
import styles from './styles.styl';

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        confirmButton: {display: 'flex', justifyContent: 'center'},
        buttonGroup:   {
            flex: 1,
        },
        buttonContainer: {
            margin: theme.scaleFactor * 8,
        },
        removeButton: {
            color:    theme.color.button,
            ':hover': {
                color: theme.color.dangerButton,
            },
        },
        addButton: {
            color:    theme.color.button,
            ':hover': {
                color: theme.color.buttonActive,
            },
        },
    }
));

type PropsType = {
    theme: ThemeType,
    showAddButton?: boolean,
    selectedItem: Object,
    deleteConfirmText: string,
    createNewItem: () => void,
    updateItem: () => void,
    deleteItem: () => void,
};

export default class ColumnToolbar extends React.PureComponent<PropsType> {
    static defaultProps = {
        showAddButton: true,
    };

    render() {
        const {
            theme, selectedItem, deleteConfirmText, createNewItem, updateItem, deleteItem, showAddButton,
        } = this.props;
        const style = STYLES(theme);

        return (
            <div className={styles.button_container} style={style.buttonContainer}>
                <div className={styles.button_filler}/>
                {showAddButton ? <CButton
                    className={styles.add_button}
                    ghost
                    icon="plus"
                    onClick={createNewItem}
                    style={style.addButton}
                /> : null}
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
                                        icon="check"
                                        type="danger"
                                        onClick={deleteItem}
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
