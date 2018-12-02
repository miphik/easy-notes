import {Button} from 'antd';
import PropTypes from 'prop-types';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {NavLink} from 'react-router-dom';
import {WEBDAV_AUTH_PATH} from 'src/constants/routes';
import './styles.styl';

export default class Home extends React.PureComponent {
    static propTypes = {
        active: PropTypes.bool,
    };

    static defaultProps = {
        active: false,
    };

    render() {
        // const {} = this.props;
        return (
            <div>
                <div>HOME</div>
                <Button>

                    <NavLink to={WEBDAV_AUTH_PATH}>WEBDAV</NavLink>
                </Button>
            </div>
        );
    }
}
