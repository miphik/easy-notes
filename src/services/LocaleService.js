import {isValidElement} from 'react';

export const RU = 'ru';
export const EN = 'en';

let intl = null;

export const setIntl = currentIntl => (intl = currentIntl);

export const formatMessageIntl = message => {
    if (!message || !intl) {
        return '';
    }
    const isObject = typeof message === 'object';
    if (isObject) {
        if (isValidElement(message)) {
            return intl.formatMessage({...message.props}, message.props.values || {});
        }
        return intl.formatMessage(message);
    }

    return message;
};
