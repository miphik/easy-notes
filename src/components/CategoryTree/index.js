// @flow
import {Button, Popconfirm} from 'antd';
import CategoryForm from 'components/CategoryTree/CategoryForm';
import FileExplorerTheme from 'components/CategoryTree/CategorySortebleTreeTheme';
import Spinner from 'components/Spinner';
import {inject, observer} from 'mobx-react';
import moment from 'moment';
import * as React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import SortableTree from 'react-sortable-tree';
import {formatMessageIntl} from 'services/LocaleService';
import {showNotification} from 'services/NotificationService';
import {ROOT_CATEGORY_NAME} from 'src/constants/general';
import {REMOVED_CATEGORY, WITHOUT_CATEGORY} from 'stores/NoteStore';
import type {CategoryType} from 'types/NoteType';
import {emptyFunc} from 'utils/General';

const MESSAGES = {
    withoutCategory:             <Fm id="CategoryTree.render.without_category" defaultMessage="Uncategorized"/>,
    removedCategory:             <Fm id="CategoryTree.render.removed_category" defaultMessage="Removed"/>,
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
const EMPTY_CATEGORY = {uuid: WITHOUT_CATEGORY, parentUUID: [ROOT_CATEGORY_NAME]};
const DELETED_CATEGORY = {uuid: REMOVED_CATEGORY, parentUUID: [ROOT_CATEGORY_NAME]};

type PropsType = {
    categories: Array<CategoryType>,
    categoriesIsLoading: boolean,
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
        setSelectedCategory:  stores.categoryStore.setSelectedCategory,
        selectedCategory:     stores.categoryStore.getSelectedCategory,
        categoriesIsLoading:  stores.categoryStore.getCategoriesIsLoading,
        setNoteCategory:      stores.noteStore.setNoteCategory,
    }
))
@observer
export default class CategoryTree extends React.Component<PropsType> {
    state = {
        categoryModalIsOpen:   false,
        categoryModalIsForNew: false,
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
            if (update) this.onSelectCategory(values);
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
        const {removeCategory, syncCategories, selectedCategory} = this.props;
        removeCategory(selectedCategory.uuid, emptyFunc, () => {
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

    onClearSelectNode = () => this.props.setSelectedCategory(null);
    onSelectCategory = (node, path) => {
        if (!node.parentUUID) this.props.setSelectedCategory(EMPTY_CATEGORY);
        else this.props.setSelectedCategory(node);
    };
    onSelectRemovedCategory = () => {
        this.props.setSelectedCategory(DELETED_CATEGORY);
    };
    onVisibilityToggle = ({expanded, node}) => this.props.changeExpandedNodes(expanded, node.uuid);
    onMoveNode = ({treeData, nextParentNode, node, treeIndex, prevTreeIndex, ...rest}) => {
        const {changeCategoryTree, changeExpandedNodes, syncCategories} = this.props;
        node.updatedAt = moment().format();
        if (nextParentNode) {
            changeExpandedNodes(true, nextParentNode.uuid);
            nextParentNode.updatedAt = moment().format();
        }
        changeCategoryTree(treeData, emptyFunc, syncCategories);
    };

    render() {
        const {categoriesAsTree, selectedCategory, categoriesIsLoading} = this.props;
        const {categoryModalIsForNew, categoryModalIsOpen} = this.state;
        let formInitialValues = {};
        if (categoryModalIsForNew && selectedCategory) {
            formInitialValues.parent = selectedCategory.uuid;
        } else if (selectedCategory) {
            formInitialValues = {...selectedCategory};
            formInitialValues.parent = selectedCategory.parentUUID[0] === ROOT_CATEGORY_NAME
                ? formatMessageIntl(MESSAGES.rootCategoryWhenEdit) : selectedCategory.parentUUID[0];
        }
        return (
            <div>
                <div>HOME</div>
                <Button onClick={this.openCategoryModalForNew}>
                    {MESSAGES.addNewCategory}
                </Button>
                {selectedCategory ? <div>
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
                <div
                    style={
                        selectedCategory && selectedCategory.uuid === WITHOUT_CATEGORY
                            ? {color: 'red'} : {}
                    }
                    onClick={this.onSelectCategory}
                >
                    {MESSAGES.withoutCategory}
                </div>
                <div
                    style={
                        selectedCategory && selectedCategory.uuid === REMOVED_CATEGORY
                            ? {color: 'red'} : {}
                    }
                    onClick={this.onSelectRemovedCategory}
                >
                    {MESSAGES.removedCategory}
                </div>
                <div style={{height: 400}} onClick={this.onClearSelectNode}>
                    <Spinner show={categoriesIsLoading} size="small"/>
                    {!categoriesIsLoading ? (
                        <SortableTree
                            // dndType="category_drop"
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
                                    onSelectNode: this.onSelectCategory,
                                    selectedNode: selectedCategory,
                                    changeNoteCategory: this.props.setNoteCategory,
                                }
                            )}
                        />
                    ) : null}
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
