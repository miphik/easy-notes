// @flow
import {Input} from 'antd';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import type {ThemeType} from 'stores/ThemeStore';
import type {CategoryType} from 'types/NoteType';

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        input:  {
            background: 'transparent',
            color:      'white',
            border:     'none',
            outline:    'none',
            boxShadow:  'none',
            marginLeft: -11,
        },
        item: {
            display:    'flex',
            alignItems: 'center',
        },
        overItem: {

        },
        selectedItem: {
            backgroundColor: 'blue',
        },
    }
));

type PropsType = {
    title: string | object,
    rowTitleClassName: string,
    rowLabelClassName: string,
    isNodeSelectable?: boolean,
    categoryIsEditing: boolean,
    isNodeSelected: boolean,
    category: CategoryType,
    changeNoteCategory: (noteUUID: string, categoryUUIDs: Array<string>) => void,
    updateCategoryName: (categoryName: string) => void,
    theme: ThemeType,
};

export default class CategoryItem extends React.Component<PropsType> {
    static defaultProps = {
        isNodeSelectable: true,
    };

    state = {
        isOver:       false,
        categoryName: null,
    };

    onDragLeave = () => this.setState({isOver: false});

    onDragOver = event => {
        if (event.dataTransfer.items.length !== 2 || event.dataTransfer.items[1].type !== 'category') return true;
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        this.setState({isOver: true});
        return false;
    };

    onDrop = event => {
        const text = event.dataTransfer.getData('Text');
        if (!text) return true;
        const {noteUUID, categoryUUIDs} = JSON.parse(text);
        if (!noteUUID) return true;
        event.stopPropagation();
        event.preventDefault();
        const {changeNoteCategory, category} = this.props;
        this.onDragLeave();
        if (categoryUUIDs.indexOf(category.uuid) !== -1) return true;
        changeNoteCategory(noteUUID, category.uuid);
        return false;
    };

    onChangeCategoryName = event => this.setState({categoryName: event.currentTarget.value});

    handleKeyPress = event => {
        const isEscape = event.key === 'Escape';
        if (event.key === 'Enter' || isEscape) {
            const {categoryIsEditing, isNodeSelected, updateCategoryName} = this.props;
            const {categoryName} = this.state;
            if (categoryIsEditing
                && isNodeSelected
                && (
                    categoryName || categoryName === null || isEscape
                )) {
                this.setState({categoryName: null});
                event.preventDefault();
                updateCategoryName(isEscape ? null : categoryName);
            }
        }
    };

    editCancel = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({categoryName: null});
        const {updateCategoryName} = this.props;
        updateCategoryName(null);
    };

    render() {
        const {isOver, categoryName} = this.state;
        const {
            rowLabelClassName, rowTitleClassName, title, categoryIsEditing,
            isNodeSelected, category, theme, isNodeSelectable,
        } = this.props;
        const style = STYLES(theme);
        let styleItem = style.item;
        if (isNodeSelected && isNodeSelectable) styleItem = {...styleItem, ...style.selectedItem};
        if (isOver) styleItem = {...styleItem, ...style.overItem};

        return (
            <React.Fragment>
                {categoryIsEditing && isNodeSelected ? (
                    <div>
                        <Input
                            autoFocus
                            onKeyDown={this.handleKeyPress}
                            onChange={this.onChangeCategoryName}
                            onBlur={this.editCancel}
                            value={categoryName || category.title}
                            defaultValue={category.title}
                            style={style.input}
                        />
                    </div>
                ) : (
                    <div
                        onDragLeave={this.onDragLeave}
                        onDragOver={this.onDragOver}
                        onDrop={this.onDrop}
                        className={rowLabelClassName}
                        style={styleItem}
                    >
                        <span className={rowTitleClassName}>
                            {title}
                        </span>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
