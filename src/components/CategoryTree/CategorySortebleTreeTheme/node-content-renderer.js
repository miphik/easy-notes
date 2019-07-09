import {Icon} from 'antd';
import CategoryItem from 'components/CategoryTree/CategoryItem';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React, {Component} from 'react';
import styles from './node-content-renderer.scss';

function isDescendant(older, younger) {
    return (
        !!older.children
        && typeof older.children !== 'function'
        && older.children.some(
            child => child === younger || isDescendant(child, younger),
        )
    );
}

// eslint-disable-next-line react/prefer-stateless-function
@Radium
class FileThemeNodeContentRenderer extends Component {
    render() {
        const {
            scaffoldBlockPxWidth,
            toggleChildrenVisibility,
            connectDragPreview,
            connectDragSource,
            isDragging,
            canDrop,
            canDrag,
            node,
            title,
            draggedNode,
            path,
            treeIndex,
            isSearchMatch,
            isSearchFocus,
            icons,
            buttons,
            className,
            style,
            didDrop,
            lowerSiblingCounts,
            listIndex,
            swapFrom,
            swapLength,
            swapDepth,
            theme,
            onSelectNode,
            updateCategoryName,
            categoryIsEditing,
            selectedNode,
            changeNoteCategory,
            treeId, // Not needed, but preserved for other renderers
            isOver, // Not needed, but preserved for other renderers
            parentNode, // Needed for dndManager
            rowDirection,
            ...otherProps
        } = this.props;
        const nodeTitle = title || node.title;
        const isNodeSelected = selectedNode && node.uuid === selectedNode.uuid;

        const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
        const isLandingPadActive = !didDrop && isDragging;

        // Construct the scaffold representing the structure of the tree
        const scaffold = [
            <div
                key={0}
                style={{
                    height:          '100%',
                    position:        'relative',
                    display:         'inline-block',
                    flex:            '0 0 auto',
                    width:           '0.25em',
                    backgroundColor: isNodeSelected ? theme.color.marker : 'inherit',
                }}
            />,
        ];
        lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
            scaffold.push(
                <div
                    key={`pre_${1 + i}`}
                    style={{width: scaffoldBlockPxWidth}}
                    className={styles.lineBlock}
                />,
            );

            if (treeIndex !== listIndex && i === swapDepth) {
                // This row has been shifted, and is at the depth of
                // the line pointing to the new destination
                let highlightLineClass = '';

                if (listIndex === swapFrom + swapLength - 1) {
                    // This block is on the bottom (target) line
                    // This block points at the target block (where the row will go when released)
                    highlightLineClass = styles.highlightBottomLeftCorner;
                } else if (treeIndex === swapFrom) {
                    // This block is on the top (source) line
                    highlightLineClass = styles.highlightTopLeftCorner;
                } else {
                    // This block is between the bottom and top
                    highlightLineClass = styles.highlightLineVertical;
                }

                scaffold.push(
                    <div
                        key={`highlight_${1 + i}`}
                        style={{
                            width: '0.6em',
                            left:  scaffoldBlockPxWidth * i,
                        }}
                        className={`${styles.absoluteLineBlock} ${highlightLineClass}`}
                    />,
                );
            }
        });

        const nodeContent = (
            <div style={{height: '100%'}} {...otherProps}>
                {toggleChildrenVisibility
                && node.children
                && node.children.length > 0 && (
                    <div
                        className={
                            node.expanded ? styles.collapseButton : styles.expandButton
                        }
                        style={{
                            left: (
                                lowerSiblingCounts.length - 0.7
                            ) * scaffoldBlockPxWidth,
                            fontSize: '0.9em',
                            ':hover': {
                                filter: `drop-shadow(0 0 0px ${theme.color.white})
                                drop-shadow(0 0 1px ${theme.color.white})
                                drop-shadow(0 0 0 ${theme.color.white})`,
                            },
                        }}
                    >

                        <Icon
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleChildrenVisibility({
                                    node,
                                    path,
                                    treeIndex,
                                });
                            }}
                            type={node.expanded ? 'down' : 'right'}
                        />
                    </div>
                )}
                {/* <button
                        type="button"
                        aria-label={node.expanded ? 'Collapse' : 'Expand'}
                        className={
                            node.expanded ? styles.collapseButton : styles.expandButton
                        }
                        style={{
                            left: (
                                lowerSiblingCounts.length - 0.7
                            ) * scaffoldBlockPxWidth,
                        }}
                        onClick={() => toggleChildrenVisibility({
                            node,
                            path,
                            treeIndex,
                        })
                        }
                    />*/}
                <CategoryItem
                    onSelectCategory={onSelectNode}
                    buttons={buttons}
                    canDrag={canDrag}
                    canDrop={canDrop}
                    theme={theme}
                    connectDragPreview={connectDragPreview}
                    icons={icons}
                    isDraggedDescendant={isDraggedDescendant}
                    isLandingPadActive={isLandingPadActive}
                    isSearchFocus={isSearchFocus}
                    isSearchMatch={isSearchMatch}
                    scaffold={scaffold}
                    category={node}
                    isNodeSelected={isNodeSelected}
                    isNodeSelectable
                    updateCategoryName={updateCategoryName}
                    categoryIsEditing={categoryIsEditing}
                    changeNoteCategory={changeNoteCategory}
                    title={typeof nodeTitle === 'function'
                        ? nodeTitle({
                            node,
                            path,
                            treeIndex,
                        })
                        : nodeTitle}
                    rowLabelClassName={styles.rowLabel}
                    rowTitleClassName={styles.rowTitle}
                />

            </div>
        );

        return canDrag
            ? connectDragSource(nodeContent, {dropEffect: 'copy'})
            : nodeContent;
    }
}

FileThemeNodeContentRenderer.defaultProps = {
    buttons:                  [],
    canDrag:                  false,
    canDrop:                  false,
    className:                '',
    draggedNode:              null,
    icons:                    [],
    isSearchFocus:            false,
    isSearchMatch:            false,
    parentNode:               null,
    style:                    {},
    swapDepth:                null,
    swapFrom:                 null,
    swapLength:               null,
    title:                    null,
    toggleChildrenVisibility: null,
};

FileThemeNodeContentRenderer.propTypes = {
    buttons:            PropTypes.arrayOf(PropTypes.node),
    canDrag:            PropTypes.bool,
    className:          PropTypes.string,
    icons:              PropTypes.arrayOf(PropTypes.node),
    isSearchFocus:      PropTypes.bool,
    isSearchMatch:      PropTypes.bool,
    listIndex:          PropTypes.number.isRequired,
    lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
    node:               PropTypes.shape({}).isRequired,
    path:               PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ).isRequired,
    scaffoldBlockPxWidth:     PropTypes.number.isRequired,
    style:                    PropTypes.shape({}),
    swapDepth:                PropTypes.number,
    swapFrom:                 PropTypes.number,
    swapLength:               PropTypes.number,
    title:                    PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    toggleChildrenVisibility: PropTypes.func,
    treeIndex:                PropTypes.number.isRequired,
    treeId:                   PropTypes.string.isRequired,
    rowDirection:             PropTypes.string.isRequired,

    // Drag and drop API functions
    // Drag source
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource:  PropTypes.func.isRequired,
    didDrop:            PropTypes.bool.isRequired,
    draggedNode:        PropTypes.shape({}),
    isDragging:         PropTypes.bool.isRequired,
    parentNode:         PropTypes.shape({}), // Needed for dndManager
    // Drop target
    canDrop:            PropTypes.bool,
    isOver:             PropTypes.bool.isRequired,
};

export default FileThemeNodeContentRenderer;
