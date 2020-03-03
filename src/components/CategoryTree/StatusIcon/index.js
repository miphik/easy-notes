// @flow
import {Icon, Tooltip} from 'antd';
import memoizeOne from 'memoize-one';
import {inject, observer} from 'mobx-react';
import Radium from 'radium';
import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {WEBDAV_AUTH_PATH} from 'src/constants/routes';
import type {ThemeType} from 'stores/ThemeStore';
import {
    DisconnectOutlined, WarningOutlined, SyncOutlined, ShareAltOutlined
} from '@ant-design/icons';

const STYLES = memoizeOne((theme: ThemeType, areErrors: boolean) => (
    {
        container: {
            color: theme.color.textMain,
            padding: '0.5em',
            display: 'flex',
            justifyContent: 'flex-end',
        },
        button: {
            border: 'none',
            color: areErrors ? theme.color.dangerButton : theme.color.button,
            padding: '0.25em',
            fontSize: '1.6em',
            display: 'flex',
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
        syncErrors: stores.categoryStore.getSyncErrors,
        categoriesAreSyncing: stores.categoryStore.areCategoriesSyncing,
        remoteStoreIsAuth: stores.remoteAuthStore.isAuth,
        theme: stores.themeStore.getTheme,
        remoteStoreIsError: stores.remoteAuthStore.error,
    }
))
@observer
@Radium
export default class StatusIcon extends React.Component<PropsType> {

    render() {
        const {theme, categoriesAreSyncing, remoteStoreIsAuth, syncErrors, remoteStoreIsError} = this.props;
        const style = STYLES(theme, !!syncErrors || !!remoteStoreIsError);

        let icon = <DisconnectOutlined />;
        if (!!syncErrors || !!remoteStoreIsError) {
            icon = <WarningOutlined />;
        } else if (categoriesAreSyncing) {
            icon = <SyncOutlined spin/>;
        } else if (remoteStoreIsAuth) {
            icon = <ShareAltOutlined />;
        }
        icon = (
            <span style={style.button}>
                {icon}
            </span>
        );

        if (syncErrors) console.error('SYNC ERROR', syncErrors);
        if (remoteStoreIsError) console.error('REMOTE STORE ERROR', remoteStoreIsError);
        return (
            <div style={style.container}>
                <NavLink to={WEBDAV_AUTH_PATH}>
                    {syncErrors || remoteStoreIsError ? (
                        <Tooltip
                            placement="top"
                            title={remoteStoreIsError || (syncErrors && syncErrors.message) || syncErrors.toString}
                        >
                            {icon}
                        </Tooltip>
                    ) : icon}
                </NavLink>
            </div>
        );
    }
}
