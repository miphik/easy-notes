// @flow
import * as React from 'react';

type PropsType = {
    title: string | object,
    rowTitleClassName: string,
    rowLabelClassName: string,
};

// @DropTarget('category_drop', chessSquareTarget, collect)
export default class CategoryItem extends React.Component<PropsType> {
    render() {
        const {
            rowLabelClassName, rowTitleClassName, title,
        } = this.props;
        console.log(1111222, this.props);
        return (
            <div className={rowLabelClassName} style={false ? {color: 'green'} : {}}>
                <span className={rowTitleClassName}>
                    {title}
                </span>
            </div>
        );
    }
}
