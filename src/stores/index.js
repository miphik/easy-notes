// @flow
import breadcrumbsStore from 'stores/BreadcrumbsStore';
import categoryStore from 'stores/CategoryStore';
import noteStore from 'stores/NoteStore';
import themeStore from 'stores/ThemeStore';
import remoteAuthStore from 'stores/RemoteAuthStore';

export default {
    breadcrumbsStore,
    themeStore,
    remoteAuthStore,
    categoryStore,
    noteStore,
};

/*
export type StoresType = {
    remoteAuthStore: {
        remoteStoreAuth: () => {},
        isAuth: boolean,
        isInited: boolean,
    }
};
*/
