import {Layout, Select} from 'antd';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {onlyUpdateForKeys} from 'recompose';

const {Option} = Select;

@injectIntl
class Header extends Component {
    static propTypes = {
        changeLocale: PropTypes.func.isRequired,
        locale:       PropTypes.string.isRequired,
        profile:      PropTypes.shape(),
    };

    static defaultProps = {
        profile: {
            firstName: '',
            lastName:  '',
        },
    };

    render() {
        const {
            locale,
            changeLocale,
            profile: {firstName = '', lastName = ''},
        } = this.props;
        const {profile} = this.props;
        const languages = [];

        return (
            <Layout.Header className="msp-header">
                <div
                    style={{
                        justifyContent: 'space-between',
                        alignItems:     'center',
                    }}
                    className="flex-horizontal msp-header-inner"
                >
                    <Select
                        className="margin-right-24 msp-lang-select"
                        onChange={() => {
                        }}
                        value="en"
                    >
                        <Option value="en">
                            Language
                        </Option>
                    </Select>
                </div>
            </Layout.Header>
        );
    }
}

export default onlyUpdateForKeys(['locale', 'profile'])(Header);
