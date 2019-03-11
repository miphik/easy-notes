// @flow
import FileExplorerTheme from 'components/CategoryTree/CategorySortebleTreeTheme';
import CategoryItem from 'components/CategoryTree/CategoryItem';
import ColumnToolbar from 'components/ColumnToolbar';
import Spinner from 'components/Spinner';
import memoizeOne from 'memoize-one';
import {inject, observer} from 'mobx-react';
import moment from 'moment';
import Radium from 'radium';
import * as React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import SortableTree from 'react-sortable-tree';
import {formatMessageIntl} from 'services/LocaleService';
import {showNotification} from 'services/NotificationService';
import {ROOT_CATEGORY_NAME} from 'src/constants/general';
import {REMOVED_CATEGORY, WITHOUT_CATEGORY} from 'stores/NoteStore';
import type {ThemeType} from 'stores/ThemeStore';
import type {CategoryType} from 'types/NoteType';
import {emptyFunc} from 'utils/General';
import styles from './styles.styl';

const MESSAGES = {
    newCategoryName:             <Fm id="CategoryItem.render.new_category_name" defaultMessage="New category"/>,
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

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        confirmButton:   {display: 'flex', justifyContent: 'center'},
        buttonGroup:     {
            flex: 1
        },
        buttonContainer: {
            margin: theme.scaleFactor * 8,
        },
        removeButton:    {
            color:    theme.color.button,
            ':hover': {
                color: theme.color.dangerButton,
            }
        },
        addButton:       {
            color:    theme.color.button,
            ':hover': {
                color: theme.color.buttonActive,
            }
        },
        resizerStyle:    {
            backgroundColor: theme.color.black,
            opacity:         0.4
        }
    }
));

type PropsType = {
    categories: Array<CategoryType>,
    categoriesIsLoading: boolean,
    theme: ThemeType,
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
        theme:                stores.themeStore.getTheme,
    }
))
@observer
@Radium
export default class CategoryTree extends React.Component<PropsType> {
    state = {
        categoryIsEdit: false,
    };

    onAddNewCategory = () => {
        const {createUpdateCategory, syncCategories, selectedCategory} = this.props;
        this.setState({
            categoryIsEdit: true,
        });
        createUpdateCategory({title: formatMessageIntl(MESSAGES.newCategoryName)}, emptyFunc, () => {
            syncCategories();
        });
    };

    onEditCategory = () => this.setState({
        categoryIsEdit: true,
    });

    closeCategoryModal = () => this.setState({categoryIsEdit: false});

    updateCategoryName = (categoryName: string) => {
        if (categoryName === null) {
            this.closeCategoryModal();
            return true;
        }
        const {createUpdateCategory, syncCategories, selectedCategory} = this.props;
        const cat = {...selectedCategory};
        cat.title = categoryName;
        createUpdateCategory(cat, emptyFunc, () => {
            syncCategories();
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
        this.closeCategoryModal();
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
        const {categoriesAsTree, selectedCategory, categoriesIsLoading, theme} = this.props;
        const {categoryIsEdit} = this.state;
        let formInitialValues = {};
        if (selectedCategory) {
            formInitialValues.parent = selectedCategory.uuid;
        } else if (selectedCategory) {
            formInitialValues = {...selectedCategory};
            formInitialValues.parent = selectedCategory.parentUUID[0] === ROOT_CATEGORY_NAME
                ? formatMessageIntl(MESSAGES.rootCategoryWhenEdit) : selectedCategory.parentUUID[0];
        }
        const style = STYLES(theme);

        return (
            <div>
                <ColumnToolbar
                    theme={theme}
                    selectedItem={selectedCategory}
                    deleteConfirmText={MESSAGES.deleteCategoryConfirm}
                    createNewItem={this.onAddNewCategory}
                    updateItem={this.onEditCategory}
                    deleteItem={this.onRemoveCategory}
                />
                <div onClick={this.onSelectCategory}>
                    <CategoryItem
                        category={EMPTY_CATEGORY}
                        isNodeSelected={selectedCategory && selectedCategory.uuid === WITHOUT_CATEGORY}
                        title={MESSAGES.withoutCategory}
                        rowLabelClassName={styles.rowLabel}
                        rowTitleClassName={styles.rowTitle}
                    />
                </div>
                {/*<div
                    style={
                        selectedCategory && selectedCategory.uuid === WITHOUT_CATEGORY
                            ? {color: 'red'} : {}
                    }
                    onClick={this.onSelectCategory}
                >
                    {MESSAGES.withoutCategory}
                </div>*/}
                <div
                    style={
                        selectedCategory && selectedCategory.uuid === REMOVED_CATEGORY
                            ? {color: 'red'} : {}
                    }
                    onClick={this.onSelectRemovedCategory}
                >
                    {MESSAGES.removedCategory}
                </div>
                <div style={{height: 400}} onClick={categoryIsEdit ? emptyFunc : this.onClearSelectNode}>
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
                                    categoryIsEditing:  categoryIsEdit,
                                    onSelectNode:       this.onSelectCategory,
                                    updateCategoryName: this.updateCategoryName,
                                    selectedNode:       selectedCategory,
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
                {/*<CategoryForm
                    isNew={categoryModalIsForNew}
                    onSubmit={this.onSubmitCategoryForm}
                    isVisible={categoryIsEdit}
                    onClose={this.closeCategoryModal}
                    categories={categoriesAsTree}
                    initialValues={formInitialValues}
                />*/}
            </div>
        );
    }
}
