// @flow
// Can override the following:
//
// style: PropTypes.shape({}),
// innerStyle: PropTypes.shape({}),
// reactVirtualizedListProps: PropTypes.shape({}),
// scaffoldBlockPxWidth: PropTypes.number,
// slideRegionSize: PropTypes.number,
// rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
// treeNodeRenderer: PropTypes.func,
// nodeContentRenderer: PropTypes.func,
// placeholderRenderer: PropTypes.func,

import type {ThemeType} from 'stores/ThemeStore';
import nodeContentRenderer from './node-content-renderer';
import treeNodeRenderer from './tree-node-renderer';

type RowHeightType = { treeIndex: number, node: Object, path: Array<number> | Array<string> };

const theme = (theme: ThemeType) => ({
    nodeContentRenderer,
    treeNodeRenderer,
    scaffoldBlockPxWidth: theme.measure.scaffoldCategoryBlockPxWidth,
    rowHeight:            theme.measure.rowCategoryHeight,
    /* rowHeight:            (options: RowHeightType) => {
        console.log(113213, options);
        return 32;
    },*/
    slideRegionSize:      theme.scaleFactor * 50,
});
export default theme;
