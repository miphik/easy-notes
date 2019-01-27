// @flow
import {Button, Icon, Popconfirm} from 'antd';
import {inject, observer} from 'mobx-react';
/* eslint-disable import/no-extraneous-dependencies */
import CategoryForm from 'pages/Home/CategoryForm';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {NavLink} from 'react-router-dom';
import {formatMessageIntl} from 'services/LocaleService';
import {showNotification} from 'services/NotificationService';
import {WEBDAV_AUTH_PATH} from 'src/constants/routes';
import type {CategoryType} from 'types/NoteType';
import './styles.styl';

const MESSAGES = {
    addNewCategory:              <Fm id="Home.render.button_add_new_category" defaultMessage="Add category"/>,
    categoryCreatedSuccessfully: <Fm id="Home.render.category_created_successfully"
                                     defaultMessage="New category successfully created"/>,
    categoryUpdatedSuccessfully: <Fm id="Home.render.category_updated_successfully"
                                     defaultMessage="Category successfully updated"/>,
    deleteCategoryConfirm:       <Fm
                                     id="Home.render.delete_category_confirm"
                                     defaultMessage="Are you sure about deleting this category?"
                                 />,
    deleteCategorySuccess:       <Fm
                                     id="Home.render.delete_category_success"
                                     defaultMessage="Category was successfully removed"
                                 />,
};

@inject(stores => (
    {
        remoteStoreIsAuth:    stores.remoteAuthStore.isAuth,
        createUpdateCategory: stores.categoryStore.createUpdateCategory,
        syncCategories:       stores.categoryStore.syncCategories,
        categories:           stores.categoryStore.categoryItems,
        removeCategory:       stores.categoryStore.removeCategory,
    }
))
@observer
export default class Home extends React.Component {
    state = {
        categoryModalIsOpen:   false,
        categoryModalIsForNew: false,
    };

    static propTypes = {
        remoteStoreIsAuth:    PropTypes.bool,
        createUpdateCategory: PropTypes.func,
        syncCategories:       PropTypes.func,
        removeCategory:       PropTypes.func,
        categories:           PropTypes.array,
    };

    static defaultProps = {
        remoteStoreIsAuth:    false,
        createUpdateCategory: () => {},
        syncCategories:       () => {},
        removeCategory:       () => {},
        categories:           [],
    };

    openCategoryModalForNew = () => this.setState({
        categoryModalIsOpen:   true,
        categoryModalIsForNew: true,
    });

    openCategoryModal = () => this.setState({
        categoryModalIsOpen:   true,
        categoryModalIsForNew: false,
    });

    closeCategoryModal = () => this.setState({categoryModalIsOpen: false});

    onSubmitCategoryForm = (values: CategoryType, update = !this.state.categoryModalIsForNew) => {
        const {createUpdateCategory, syncCategories} = this.props;
        createUpdateCategory(values);
        syncCategories();
        showNotification(
            formatMessageIntl(update ? MESSAGES.categoryUpdatedSuccessfully : MESSAGES.categoryCreatedSuccessfully),
            '',
            {
                type:     'success',
                duration: 7,
            },
        );
        this.closeCategoryModal();
        return true;
    };

    onRemoveCategory = (categoryUUID: string) => () => {
        const {removeCategory, remoteStoreIsAuth} = this.props;
        removeCategory(categoryUUID, remoteStoreIsAuth);
        showNotification(
            formatMessageIntl(MESSAGES.deleteCategorySuccess),
            '',
            {
                type:     'success',
                duration: 7,
            },
        );
    };

    render() {
        const {remoteStoreIsAuth, categories} = this.props;
        const {categoryModalIsForNew, categoryModalIsOpen} = this.state;
        //const wbIsAuth = RemoteStoreService.isAuth();
        /*if (wbIsAuth) RemoteStoreService.getNotesList(() => {}, data => {
            const notes = SerializationService.convertStringToNotesList(data);
            console.log(2222, notes);
        });*/
        /*const text = SerializationService.convertNotesListToString([{title: '435435435 drgdfgварекпарое'}]);
        console.log(1111, text);
        RemoteStorageService.saveNotesList(text, data => console.log(222, data), data => console.log(333, data));*/
        return (
            <div>
                <div>HOME</div>
                <Button>
                    <NavLink to={WEBDAV_AUTH_PATH}>WEBDAV</NavLink>
                </Button>
                <div>
                    AUTH: {remoteStoreIsAuth ? <Icon type="check"/> : <Icon type="cross"/>}
                </div>
                <br/>
                <br/>
                <Button onClick={this.openCategoryModalForNew}>
                    {MESSAGES.addNewCategory}
                </Button>
                <CategoryForm
                    isNew={categoryModalIsForNew}
                    onSubmit={this.onSubmitCategoryForm}
                    isVisible={categoryModalIsOpen}
                    onClose={this.closeCategoryModal}
                />
                {categories.map((category: CategoryType) => {
                    return (
                        <div key={category.uuid}>
                            {category.title}&nbsp;
                            <Popconfirm
                                title={MESSAGES.deleteCategoryConfirm}
                                onConfirm={this.onRemoveCategory(category.uuid)}
                            >
                                <Icon
                                    className="ant-btn-danger"
                                    type="delete"
                                />
                            </Popconfirm>
                        </div>
                    );
                })}
            </div>
        );
    }
}
