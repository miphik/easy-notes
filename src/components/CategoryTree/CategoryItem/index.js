// @flow
import {Input} from 'antd';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import type {ThemeType} from 'stores/ThemeStore';
import type {CategoryType} from 'types/NoteType';
import styles from './styles.scss';

const STYLES = memoizeOne((theme: ThemeType) => (
    {
        input: {
            background: 'transparent',
            color:      'white',
            border:     'none',
            outline:    'none',
            boxShadow:  'none',
            marginLeft: -11,
        },
        item: {
            display:                'flex',
            cursor:                 'pointer',
            height:                 theme.measure.rowCategoryHeight,
            alignItems:             'center',
            border:                 '1px dashed transparent',
            borderTopLeftRadius:    8 * theme.scaleFactor,
            borderBottomLeftRadius: 8 * theme.scaleFactor,
            overflow:               'hidden',
        },
        overItem: {
            border: '1px dashed white',
        },
        selectedItem: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
    }
));

type PropsType = {
    title: string | Object,
    rowTitleClassName: string,
    rowLabelClassName: string,
    isNodeSelectable?: boolean,
    categoryIsEditing: boolean,
    isLandingPadActive?: boolean,
    isDraggedDescendant?: boolean,
    canDrop?: boolean,
    canDrag?: boolean,
    isSearchMatch?: boolean,
    isSearchFocus?: boolean,
    isNodeSelected: boolean,
    category: CategoryType,
    scaffold?: Array<React.Node>,
    icons?: Array<React.Node>,
    buttons?: Array<React.Node>,
    changeNoteCategory: (noteUUID: string, categoryUUIDs: Array<string>) => void,
    updateCategoryName: (categoryName: string) => void,
    onSelectCategory: (category: CategoryType) => void,
    connectDragPreview?: (node: React.Node) => React.Node,
    theme: ThemeType,
};

export default class CategoryItem extends React.Component<PropsType> {
    static defaultProps = {
        isNodeSelectable:    true,
        isDraggedDescendant: false,
        isSearchMatch:       false,
        isSearchFocus:       false,
        canDrop:             false,
        canDrag:             false,
        isLandingPadActive:  false,
        scaffold:            [],
        icons:               [],
        buttons:             [],
        connectDragPreview:  (node: React.Node) => node,
    };

    state = {
        isOver:       false,
        categoryName: null,
    };

    onDragLeave = () => this.setState({isOver: false});

    onDragOver = event => {
        event.stopPropagation();
        event.preventDefault();
        if (event.dataTransfer.items.length !== 2 || event.dataTransfer.items[1].type !== 'category') return true;
        event.dataTransfer.dropEffect = 'move';
        this.setState({isOver: true});
        return false;
    };

    onDrop = event => {
        event.stopPropagation();
        event.preventDefault();
        const text = event.dataTransfer.getData('Text');
        if (!text) return true;
        const {noteUUID, categoryUUIDs} = JSON.parse(text);
        if (!noteUUID) return true;
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
            rowLabelClassName, rowTitleClassName, title, categoryIsEditing, isSearchFocus,
            isNodeSelected, category, theme, isNodeSelectable, canDrop, isSearchMatch,
            onSelectCategory, canDrag, connectDragPreview, scaffold, isLandingPadActive,
            isDraggedDescendant, icons, buttons,
        } = this.props;
        const style = STYLES(theme);
        let styleItem = style.item;
        if (isNodeSelected && isNodeSelectable) styleItem = {...styleItem, ...style.selectedItem};
        if (isOver) styleItem = {...styleItem, ...style.overItem};

        return (
            <div
                onClick={event => {
                    if (!categoryIsEditing) {
                        event.stopPropagation();
                        onSelectCategory(category);
                    }
                }}
                style={styleItem}
                onDragLeave={this.onDragLeave}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                className={
                    styles.rowWrapper
                    + (
                        !canDrag ? ` ${styles.rowWrapperDragDisabled}` : ''
                    )

                }
            >
                {/* Set the row preview to be used during drag and drop */}
                {connectDragPreview(
                    <div style={{display: 'flex', flex: 1, height: '100%'}}>
                        {scaffold}
                        <div
                            className={
                                styles.row

                                + (
                                    isLandingPadActive && !canDrop
                                        ? ` ${styles.rowCancelPad}`
                                        : ''
                                )
                                + (
                                    isSearchMatch ? ` ${styles.rowSearchMatch}` : ''
                                )
                                + (
                                    isSearchFocus ? ` ${styles.rowSearchFocus}` : ''
                                )
                                + (
                                    isLandingPadActive ? ` ${styles.rowLandingPad}` : ''
                                )
                            }
                            style={{
                                opacity: isDraggedDescendant ? 0.5 : 1,
                                ...style,
                            }}
                        >
                            <div
                                className={
                                    styles.rowContents
                                    + (
                                        !canDrag ? ` ${styles.rowContentsDragDisabled}` : ''
                                    )
                                }
                            >
                                <div className={styles.rowToolbar}>
                                    {icons.map((icon: React.Node, index: number) => (
                                        <div
                                            key={index} // eslint-disable-line react/no-array-index-key
                                            className={styles.toolbarButton}
                                        >
                                            {icon}
                                        </div>
                                    ))}
                                </div>
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
                                    <div className={rowLabelClassName}>
                                        <span className={rowTitleClassName}>
                                            {title}
                                        </span>
                                    </div>
                                )}
                                <div className={styles.rowToolbar}>
                                    {buttons.map((btn: React.Node, index: number) => (
                                        <div
                                            key={index} // eslint-disable-line react/no-array-index-key
                                            className={styles.toolbarButton}
                                        >
                                            {btn}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>,
                )}
            </div>
        );
    }
}
