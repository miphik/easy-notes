import {Button, message, notification} from 'antd';
import React from 'react';
import DesktopNotificationService from 'services/DesktopNotificationService';
import {formatMessageIntl} from 'services/LocaleService';

export const showLittleNotification = (text, type = 'success') => {
    message[type](formatMessageIntl(text));
};

export const showNotification = (title, text, additionalParams = {}) => {
    const {
        onClickButton, renderButton, type = 'info', duration = 7, placement = 'bottomRight',
    } = additionalParams;
    const key = `open${Date.now()}`;
    const onClick = () => {
        if (onClickButton) onClickButton();
        notification.close(key);
    };

    const config = {
        message:     title,
        description: text,
        placement,
        duration,
        key,
    };

    const desktopNotify = !DesktopNotificationService.isWindowActive()
        && DesktopNotificationService.show({
            onClick,
            title,
            message:  text,
            duration: 7000,
        });

    if (renderButton) {
        config.btn = (
            <Button
                type="primary"
                ghost
                size="small"
                onClick={() => {
                    onClick();
                    if (desktopNotify && desktopNotify.close) desktopNotify.close();
                }}
            >
                Go to message
            </Button>
        );
    }
    notification[type](config);
};

export const openNotificationWithIcon = (type, data, duration = 3) => {
    const title = data.title ? data.title : data;
    const description = data.description ? data.description : null;
    const show = notification[type];
    if (show) {
        show({
            message: title,
            description,
            duration,
        });
    }
};
