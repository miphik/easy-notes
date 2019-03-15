import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import styles from './style.styl';

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
        switch (size) {
            case 'small':
                wrapSizeClass = styles.wrap_small;
                sizeClass = styles.small;
                break;
            case 'middle':
                wrapSizeClass = styles.wrap_middle;
                sizeClass = styles.middle;
                break;
        }
        const wrapFullClass = fullSize ? styles.wrap_full : '';
        const wrapShowClass = show ? styles.wrap_show : styles.wrap_hide;
        return (
            <div
                style={style}
                className={`${styles.wrap} ${wrapFullClass} ${wrapSizeClass} ${this.isShowed ? wrapShowClass : ''}`}
            >
                <div className={`${styles.container} ${sizeClass}`}/>
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
