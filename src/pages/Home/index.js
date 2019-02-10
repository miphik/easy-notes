// @flow
import {Button, Icon, Popconfirm} from 'antd';
import {inject, observer} from 'mobx-react';
/* eslint-disable import/no-extraneous-dependencies */
import CategoryForm from 'pages/Home/CategoryForm';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import {NavLink} from 'react-router-dom';
import SplitPane from 'react-split-pane';
import {formatMessageIntl} from 'services/LocaleService';
import {showNotification} from 'services/NotificationService';
import {WEBDAV_AUTH_PATH} from 'src/constants/routes';
import type {CategoryType} from 'types/NoteType';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'components/SortebleTree';
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
        treeData:              [{title: 'Chicken', children: [{title: 'Egg'}]}],
        selectedNode:          null,
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

    onSelectNode = (node, path) => console.log(1111, node, path);

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
                <SplitPane
                    split="vertical"
                    minSize={150}
                    maxSize={500}
                    step={50}
                    defaultSize={180}
                >
                    <div>
                        <div>HOME</div>
                        <Button onClick={this.openCategoryModalForNew}>
                            {MESSAGES.addNewCategory}
                        </Button>
                        pane 1 size: 33%
                        <div style={{height: 400}}>
                            <SortableTree
                                treeData={categories}
                                onChange={treeData => this.setState({treeData})}
                                theme={FileExplorerTheme}
                                getNodeKey={({node}) => node.uuid}
                                generateNodeProps={({node, path}) => {
                                    return (
                                        {
                                            onSelectNode: this.onSelectNode,
                                        }
                                    )
                                }}
                            />
                        </div>
                        <br/>
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
                    <SplitPane
                        split="vertical"
                        minSize={150}
                        maxSize={500}
                        step={50}
                        defaultSize={250}
                    >
                        <div>
                            <Button>
                                <NavLink to={WEBDAV_AUTH_PATH}>WEBDAV</NavLink>
                            </Button>
                            pane 2 size: 50% (of remaining space)
                        </div>
                        <div>
                            <div>
                                AUTH: {remoteStoreIsAuth ? <Icon type="check"/> : <Icon type="cross"/>}
                            </div>
                            pane 3
                        </div>
                    </SplitPane>
                </SplitPane>
                <CategoryForm
                    isNew={categoryModalIsForNew}
                    onSubmit={this.onSubmitCategoryForm}
                    isVisible={categoryModalIsOpen}
                    onClose={this.closeCategoryModal}
                />
            </div>
        );
    }
}
