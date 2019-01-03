import {Form} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

export default class CustomForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        children: PropTypes.node.isRequired,
    };

    handleKeyPress = e => {
        const {onSubmit} = this.props;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    render() {
        const {onSubmit, children, ...rest} = this.props;
        return (
            <Form layout="vertical" onKeyPress={this.handleKeyPress} {...rest}>
                {children}
            </Form>
        );
    }
}
