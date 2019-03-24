// @flow
import {Icon} from 'antd';
import memoizeOne from 'memoize-one';
import {inject, observer} from 'mobx-react';
import Radium from 'radium';
import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {WEBDAV_AUTH_PATH} from 'src/constants/routes';
import type {ThemeType} from 'stores/ThemeStore';

const STYLES = memoizeOne((theme: ThemeType, areErrors: boolean) => (
    {
        container: {
            color:          theme.color.textMain,
            padding:        8 * theme.scaleFactor,
            display:        'flex',
            justifyContent: 'flex-end',
        },
        button:    {
            border:   'none',
            color:    areErrors ? theme.color.dangerButton : theme.color.button,
            padding:  4 * theme.scaleFactor,
            height:   28 * theme.scaleFactor,
            fontSize: 20 * theme.scaleFactor,
            display:  'flex',
            ':hover': {
                color: theme.color.buttonActive,
            }
        },
    }
));

type PropsType = {
    categoriesAreSyncing: boolean,
    remoteStoreIsAuth: boolean,
    theme: ThemeType,
    syncErrors: Array<Error>,
};

@inject(stores => (
    {
        syncErrors:           stores.categoryStore.getSyncErrors,
        categoriesAreSyncing: stores.categoryStore.areCategoriesSyncing,
        remoteStoreIsAuth:    stores.remoteAuthStore.isAuth,
        theme:                stores.themeStore.getTheme,
    }
))
@observer
@Radium
export default class StatusIcon extends React.Component<PropsType> {

    render() {
        const {theme, categoriesAreSyncing, remoteStoreIsAuth, syncErrors} = this.props;
        const style = STYLES(theme, !!syncErrors);

        let icon = null;
        if (categoriesAreSyncing || !!syncErrors) {
            icon = <Icon type="disconnect"/>;
        } else if (categoriesAreSyncing) {
            icon = <Icon type="sync" spin/>;
        } else if (remoteStoreIsAuth) {
            icon = <Icon type="cloud"/>;
        }

        return (
            <div style={style.container}>
                <NavLink to={WEBDAV_AUTH_PATH}>
                    <span style={style.button}>
                        {icon}
                    </span>
                </NavLink>
            </div>
        );
    }
}
