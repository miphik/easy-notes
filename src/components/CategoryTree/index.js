// @flow
import {Button, Popconfirm} from 'antd';
import CategoryForm from 'components/CategoryTree/CategoryForm';
import FileExplorerTheme from 'components/CategoryTree/CategorySortebleTreeTheme';
import {inject, observer} from 'mobx-react';
import moment from 'moment';
import * as React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import SortableTree from 'react-sortable-tree';
import {formatMessageIntl} from 'services/LocaleService';
import {showNotification} from 'services/NotificationService';
import {ROOT_CATEGORY_NAME} from 'src/constants/general';
import type {CategoryType} from 'types/NoteType';
import {emptyFunc} from 'utils/General';

const MESSAGES = {
    rootCategoryWhenEdit:        <Fm id="CategoryTree.render.root_category_when_edit" defaultMessage="ROOT"/>,
    addNewCategory:              <Fm id="CategoryTree.render.button_add_new_category" defaultMessage="Add category"/>,
    updateCategory:              <Fm id="CategoryTree.render.button_update_category" defaultMessage="Update category"/>,
    removeCategory:              <Fm id="CategoryTree.render.button_remove_category" defaultMessage="Remove category"/>,
    categoryCreatedSuccessfully: <Fm
                                     id="CategoryTree.render.category_created_successfully"
                                     defaultMessage="New category successfully created"
                                 />,
    categoryUpdatedSuccessfully: <Fm
                                     id="CategoryTree.render.category_updated_successfully"
                                     defaultMessage="Category successfully updated"
                                 />,
    deleteCategoryConfirm:       <Fm
                                     id="CategoryTree.render.delete_category_confirm"
                                     defaultMessage="Are you sure about deleting this category?"
                                 />,
    deleteCategorySuccess:       <Fm
                                     id="CategoryTree.render.delete_category_success"
                                     defaultMessage="Category was successfully removed"
                                 />,
};

type Props = {
    categories: Array<CategoryType>,
    bar?: string,
};

@inject(stores => (
    {
        createUpdateCategory: stores.categoryStore.createUpdateCategory,
        syncCategories:       stores.categoryStore.syncCategories,
        categoriesAsTree:     stores.categoryStore.categoryItemsAsTree,
        categories:           stores.categoryStore.categoryItems,
        changeExpandedNodes:  stores.categoryStore.changeExpandedNodes,
        changeCategoryTree:   stores.categoryStore.changeCategoryTree,
        removeCategory:       stores.categoryStore.removeCategory,
    }
))
@observer
export default class CategoryTree extends React.Component<Props> {
    state = {
        categoryModalIsOpen:   false,
        categoryModalIsForNew: false,
        selectedNode:          null,
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
        const {createUpdateCategory, syncCategories, changeExpandedNodes} = this.props;
        createUpdateCategory(values, emptyFunc, () => {
            if (update) this.onSelectNode(values);
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
        });
        return true;
    };

    onRemoveCategory = () => {
        const {removeCategory, syncCategories} = this.props;
        const {selectedNode} = this.state;
        removeCategory(selectedNode.uuid, emptyFunc, () => {
            this.onClearSelectNode();
            syncCategories();
            showNotification(
                formatMessageIntl(MESSAGES.deleteCategorySuccess),
                '',
                {
                    type:     'success',
                    duration: 7,
                },
            );
        });
    };

    onClearSelectNode = () => this.setState({selectedNode: null});
    onSelectNode = (node, path) => this.setState({selectedNode: node});
    onVisibilityToggle = ({expanded, node}) => this.props.changeExpandedNodes(expanded, node.uuid);
    onMoveNode = ({treeData, nextParentNode, node}) => {
        const {changeCategoryTree, changeExpandedNodes, syncCategories} = this.props;
        node.updatedAt = moment().format();
        if (nextParentNode) {
            changeExpandedNodes(true, nextParentNode.uuid);
            nextParentNode.updatedAt = moment().format();
        }
        changeCategoryTree(treeData, emptyFunc, syncCategories);
    };

    render() {
        const {categoriesAsTree} = this.props;
        const {categoryModalIsForNew, categoryModalIsOpen, selectedNode} = this.state;
        let formInitialValues = {};
        if (categoryModalIsForNew && selectedNode) {
            formInitialValues.parent = selectedNode.uuid;
        } else if (selectedNode) {
            formInitialValues = {...selectedNode};
            formInitialValues.parent = selectedNode.parentUUID[0] === ROOT_CATEGORY_NAME
                ? formatMessageIntl(MESSAGES.rootCategoryWhenEdit) : selectedNode.parentUUID[0];
        }
        return (
            <div>
                <div>HOME</div>
                <Button onClick={this.openCategoryModalForNew}>
                    {MESSAGES.addNewCategory}
                </Button>
                {selectedNode ? <div>
                    <Button onClick={this.openCategoryModal}>
                        {MESSAGES.updateCategory}
                    </Button>
                    <Popconfirm
                        placement="rightTop"
                        title={MESSAGES.deleteCategoryConfirm}
                        onConfirm={this.onRemoveCategory}
                    >
                        <Button
                            type="danger"
                            ghost
                        >
                            {MESSAGES.removeCategory}
                        </Button>
                    </Popconfirm>
                </div> : null}
                pane 1 size: 33%
                <div style={{height: 400}} onClick={this.onClearSelectNode}>
                    <SortableTree
                        treeData={categoriesAsTree}
                        onVisibilityToggle={this.onVisibilityToggle}
                        onMoveNode={this.onMoveNode}
                        onChange={emptyFunc}
                        /* onChange={treeData => {
                            console.log(2112213, treeData);
                            this.setState({treeData});
                        }} */
                        theme={FileExplorerTheme}
                        getNodeKey={({node}) => node.uuid}
                        generateNodeProps={({node, path}) => (
                            {
                                onSelectNode: this.onSelectNode,
                                selectedNode,
                            }
                        )}
                    />
                </div>
                <br/>
                {/*{categories.map((category: CategoryType) => (
                    <div key={category.uuid}>
                        {category.title}
&nbsp;
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
                ))}*/}
                <CategoryForm
                    isNew={categoryModalIsForNew}
                    onSubmit={this.onSubmitCategoryForm}
                    isVisible={categoryModalIsOpen}
                    onClose={this.closeCategoryModal}
                    categories={categoriesAsTree}
                    initialValues={formInitialValues}
                />
            </div>
        );
    }
}
