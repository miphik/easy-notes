// @flow
import {Input} from 'antd';
import * as React from 'react';
import type {CategoryType} from 'types/NoteType';

type PropsType = {
    title: string | object,
    rowTitleClassName: string,
    rowLabelClassName: string,
    categoryIsEditing: boolean,
    isNodeSelected: boolean,
    category: CategoryType,
    changeNoteCategory: (noteUUID: string, categoryUUIDs: Array<string>) => void,
    updateCategoryName: (categoryName: string) => void,
};

export default class CategoryItem extends React.Component<PropsType> {
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

    render() {
        const {isOver, categoryName} = this.state;
        const {
            rowLabelClassName, rowTitleClassName, title, categoryIsEditing,
            isNodeSelected, category,
        } = this.props;
        const style = {};
        if (isNodeSelected) style.color = 'red';
        if (isOver) style.color = 'green';

        return (
            <React.Fragment>
                {categoryIsEditing && isNodeSelected ? (
                    <div>
                        <Input
                            autoFocus
                            onKeyDown={this.handleKeyPress}
                            onChange={this.onChangeCategoryName}
                            value={categoryName || category.title}
                            defaultValue={category.title}
                        />
                    </div>
                ) : (
                    <div
                        onDragLeave={this.onDragLeave}
                        onDragOver={this.onDragOver}
                        onDrop={this.onDrop}
                        className={rowLabelClassName}
                        style={style}
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
