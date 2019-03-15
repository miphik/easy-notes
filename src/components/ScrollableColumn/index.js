/* eslint-disable react/default-props-match-prop-types */
import Color from 'color';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';
import * as React from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import styles from './styles.styl';

const COLUMN_PROPS = {
    renderScrollbar:   PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    autoHideScrollbar: PropTypes.bool,
    showScrollShadow:  PropTypes.bool,
    scaleFactor:       PropTypes.number,
    autoHideTimeout:   PropTypes.number,
    width:             PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    shadowColor:       PropTypes.string,
    scrollColor:       PropTypes.string,
};

const renderProps = prop => {
    if (typeof prop === 'function') {
        return prop();
    }
    if (typeof prop === 'object') {
        return prop;
    }
    return null;
};

const STYLES = memoizeOne((shadowColor, scrollColor, scaleFactor) => (
    {
        scrollTop: {
            background: `linear-gradient(to bottom, ${shadowColor} 0%, ${Color(shadowColor).alpha(0.1)} 100%)`,
        },
        scrollBottom: {
            background: `linear-gradient(to bottom, ${Color(shadowColor).alpha(0.1)} 0%, ${shadowColor} 100%)`,
        },
        scroll: {
            backgroundColor: scrollColor,
        },
        scrollTrack: {
            position:     'absolute',
            width:        4 * scaleFactor,
            transition:   'opacity 200ms ease 0s',
            right:        2,
            bottom:       2,
            top:          2,
            borderRadius: 3,
        },
    }
));

export default class ScrollableColumn extends React.Component {
    shadowTop = null;

    shadowBottom = null;

    static propTypes = {
        ...COLUMN_PROPS,
        footer:          PropTypes.node,
        toolbar:         PropTypes.node,
        contentAbsolute: PropTypes.node,
    };

    static defaultProps = {
        autoHideScrollbar: false,
        scaleFactor:       1,
        autoHideTimeout:   500,
        width:             300,
        renderScrollbar:   null,
        footer:            null,
        toolbar:           null,
        contentAbsolute:   null,
        shadowColor:       'white',
        scrollColor:       'black',
    };

    handleUpdate = values => {
        const {scrollTop, scrollHeight, clientHeight} = values;
        const shadowTopOpacity = (
            1 / 20
        ) * Math.min(scrollTop, 20);
        const bottomScrollTop = scrollHeight - clientHeight;
        const shadowBottomOpacity = (
            1 / 20
        )
            * (
                bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20)
            );
        this.shadowTop.style.opacity = shadowTopOpacity;
        if (shadowTopOpacity === 0) this.shadowTop.style.height = '0';
        else this.shadowTop.style.height = '';
        this.shadowBottom.style.opacity = shadowBottomOpacity;
        if (shadowBottomOpacity === 0) this.shadowBottom.style.height = '0';
        else this.shadowBottom.style.height = '';
    };

    renderWithScrollbar = content => {
        const {
            autoHideScrollbar, autoHideTimeout, showScrollShadow, shadowColor, scrollColor, scaleFactor,
        } = this.props;
        const style = STYLES(shadowColor, scrollColor, scaleFactor);
        return (
            <div className={styles.scroll_container}>
                <Scrollbars
                    onUpdate={showScrollShadow ? this.handleUpdate : undefined}
                    autoHideTimeout={autoHideTimeout}
                    renderThumbHorizontal={props => <div {...props} className={styles.scrollbar} style={style.scroll}/>}
                    renderThumbVertical={props => <div {...props} className={styles.scrollbar} style={style.scroll}/>}
                    renderTrackVertical={props => <div {...props} style={style.scrollTrack}/>}
                    renderTrackHorizontal={props => <div {...props} style={style.scrollTrack}/>}
                    autoHide={autoHideScrollbar}
                >
                    {content}
                </Scrollbars>
                {showScrollShadow
                && (
                    <div
                        className={styles.scroll_top}
                        style={style.scrollTop}
                        ref={ref => this.shadowTop = ref}
                    />
                )}
                {showScrollShadow
                && (
                    <div
                        className={styles.scroll_bottom}
                        style={style.scrollBottom}
                        ref={ref => this.shadowBottom = ref}
                    />
                )}
            </div>
        );
    };

    render() {
        const {
            children, toolbar, footer, width, renderScrollbar, contentAbsolute,
        } = this.props;

        return (
            <div className={styles.container} style={{width}}>
                {!!toolbar && (
                    <div className={styles.column_toolbar}>
                        {toolbar}
                    </div>
                )}

                <div className={styles.column_content}>
                    {renderScrollbar ? renderProps(children) : this.renderWithScrollbar(children)}
                    {!!contentAbsolute && (
                        <div className={styles.column_content_absolute}>
                            {contentAbsolute}
                        </div>
                    )}
                </div>

                {!!footer && (
                    <div className={styles.column_footer}>
                        {footer}
                    </div>
                )}
            </div>
        );
    }
}
