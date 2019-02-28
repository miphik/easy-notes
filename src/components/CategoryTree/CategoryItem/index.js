// @flow
import * as React from 'react';
import type {CategoryType} from 'types/NoteType';

type PropsType = {
    title: string | object,
    rowTitleClassName: string,
    rowLabelClassName: string,
    category: CategoryType,
    changeNoteCategory: (noteUUID: string, categoryUUID: string) => void,
};

// @DropTarget('category_drop', chessSquareTarget, collect)
export default class CategoryItem extends React.Component<PropsType> {
    state = {
        isOver: false,
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
        const noteUUID = event.dataTransfer.getData('Text');
        if (!noteUUID) return true;
        event.stopPropagation();
        event.preventDefault();
        const {changeNoteCategory, category} = this.props;
        this.onDragLeave();
        changeNoteCategory(noteUUID, category.uuid);
        return false;
    };

    render() {
        const {isOver} = this.state;
        const {
            rowLabelClassName, rowTitleClassName, title,
        } = this.props;
        return (
            <div
                onDragLeave={this.onDragLeave}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                className={rowLabelClassName}
                style={isOver ? {color: 'green', backgroundColor: 'gray'} : {backgroundColor: 'gray'}}
            >
                <span className={rowTitleClassName}>
                    {title}
1
                </span>
            </div>
        );
    }
}
