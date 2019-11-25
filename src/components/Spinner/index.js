import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {inject} from 'mobx-react';
import Color from 'color';
import styles from './style.styl';

@inject(stores => (
    {
        theme: stores.themeStore.getTheme,
    }
))
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
            size, fullSize, show, style, theme,
        } = this.props;
        let wrapSizeClass = '';
        let sizeClass = '';
        // eslint-disable-next-line default-case
        switch (size) {
            case 'small':
                wrapSizeClass = 'Spinner__wrap_small';
                sizeClass = 'Spinner__small_item';
                break;
            case 'middle':
                wrapSizeClass = 'Spinner__wrap_middle';
                sizeClass = 'Spinner__middle_item';
                break;
        }
        const wrapFullClass = fullSize ? 'Spinner__wrap_full' : '';
        const wrapShowClass = show ? 'Spinner__wrap_show' : 'Spinner__wrap_hide';
        const backgroundColor = theme.isBlack
            ? Color(theme.color.second).lighten(0.6).alpha(0.6)
            : Color(theme.color.second).darken(0.6).alpha(0.6);
        return (
            <div
                style={{...style, backgroundColor: wrapFullClass ? backgroundColor : 'transparent'}}
                className={`${styles.Spinner__wrap} ${styles[wrapFullClass]} ${styles[wrapSizeClass]} ${this.isShowed
                    ? styles[wrapShowClass] : ''}`}
            >
                <div
                    style={{borderTopColor: theme.color.white}}
                    className={`${styles.Spinner__container_item1} ${sizeClass ? styles[`${sizeClass}1`] : ''}`}
                />
                <div
                    style={{borderTopColor: theme.color.white}}
                    className={`${styles.Spinner__container_item2} ${sizeClass ? styles[`${sizeClass}2`] : ''}`}
                />
                <div
                    style={{borderTopColor: theme.color.white}}
                    className={`${styles.Spinner__container_item3} ${sizeClass ? styles[`${sizeClass}3`] : ''}`}
                />
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
