import React from 'react';
import PropTypes from 'prop-types';
import {Route, Switch, withRouter} from 'react-router-dom';

@withRouter
export default class Routes extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
    };

    render() {
        const {routes} = this.props;
        return (
            <Switch>
                {routes.map(route => <Route key={route.path} {...route} />)}
                <Route exact component={() => <div>NOT FOUND</div>} />
            </Switch>
        );
    }
}
