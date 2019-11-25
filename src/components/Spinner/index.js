import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

class Spinner extends PureComponent {
    isShowed = false;

    constructor(props) {
        super(props);
        if (props.show) this.isShowed = true;
    }

    componentWillReceiveProps(props) {
        if (props.show) this.isShowed = true;
    }

    render() {
        const {
            size, fullSize, show, style,
        } = this.props;
        let wrapSizeClass = '';
        let sizeClass = '';
        // eslint-disable-next-line default-case
        switch ('middle') {
            case 'small':
                wrapSizeClass = 'wrap_small';
                sizeClass = 'small';
                break;
            case 'middle':
                wrapSizeClass = 'wrap_middle';
                sizeClass = 'middle';
                break;
        }
        const wrapFullClass = fullSize ? 'wrap_full' : '';
        const wrapShowClass = show ? 'wrap_show' : 'wrap_hide';
        return (
            <div
                style={style}
                className={`Spinner wrap ${wrapFullClass} ${wrapSizeClass} ${this.isShowed ? wrapShowClass : ''}`}
            >
                <div className={`container ${sizeClass}`}/>
            </div>
        );
    }
}

Spinner.propTypes = {
    size:     PropTypes.oneOf(['middle', 'big', 'small']),
    fullSize: PropTypes.bool,
    show:     PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    style:    PropTypes.object,
};
Spinner.defaultProps = {
    size:     'middle',
    fullSize: false,
    show:     true,
    style:    {},
};

export default Spinner;
