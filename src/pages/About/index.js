import PropTypes from 'prop-types';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import './styles.styl';

export default class About extends React.PureComponent {
    static propTypes = {
        active: PropTypes.bool,
    };

    static defaultProps = {
        active: false,
    };

    render() {
        // const {} = this.props;
        return (
            <div>ABOUT</div>
        );
    }
}
