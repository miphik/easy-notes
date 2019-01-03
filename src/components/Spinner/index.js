import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import './style.styl';

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
        const wrapFullClass = fullSize ? 'Spinner__wrap-full' : '';
        const wrapSizeClass = size ? `Spinner__wrap-${size}` : '';
        const wrapShowClass = show ? 'Spinner__wrap_show' : 'Spinner__wrap_hide';
        return (
            <div
                style={style}
                className={`Spinner__wrap ${wrapFullClass} ${wrapSizeClass} ${this.isShowed ? wrapShowClass : ''}`}
            >
                <div className={`Spinner ${size ? `Spinner__${size}` : ''}`}/>
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
