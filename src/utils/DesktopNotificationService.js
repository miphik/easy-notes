import * as notifier from 'node-notifier';

class DesktopNotificationService {
    static tabActive = (
        () => {
            let stateKey;
            let eventKey;
            const keys = {
                hidden:       'visibilitychange',
                webkitHidden: 'webkitvisibilitychange',
                mozHidden:    'mozvisibilitychange',
                msHidden:     'msvisibilitychange',
            };
            for (stateKey in keys) {
                if (stateKey in document) {
                    eventKey = keys[stateKey];
                    break;
                }
            }
            return function (c) {
                if (c) document.addEventListener(eventKey, c);
                return !document[stateKey];
            };
        }
    )();

    static windowActive = true;

    static show({
        onClick, title, message, icon, duration = 5,
    }) {
        const messageObject = {
            timeout:            duration,
            requireInteraction: true,
            message,
            title,
            icon,
        };
        const notification = notifier.notify(messageObject);
        // setTimeout(() => notification.close(), duration);
        notifier.on('click', (notifierObject, options) => {
            if (onClick) onClick();
            window.focus();
        });
        return notification;
    }
}

DesktopNotificationService.isWindowActive = () => DesktopNotificationService.windowActive;

export default DesktopNotificationService;

window.addEventListener(
    'focus',
    event => (
        DesktopNotificationService.windowActive = true
    ),
    false,
);
window.addEventListener(
    'blur',
    event => (
        DesktopNotificationService.windowActive = false
    ),
    false,
);
