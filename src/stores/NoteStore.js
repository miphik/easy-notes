// @flow
import {action, observable} from 'mobx';
import {loadLocalCategories, loadLocalNotes, syncRemoteAndLocalNotes} from 'services/SyncService';

class NoteStore {
    @observable notes = observable.array();

    @action
    setNotes = (notes: Array<NoteStore>) => {
        console.info('LOAD NOTES', notes);
        this.notes = observable.array(notes);
    };

    @action
    syncNotes = () => syncRemoteAndLocalNotes(this.setNotes);

    @action
    loadLocalNotes = () => loadLocalNotes(this.setNotes);

    get noteItems() {
        return this.notes.toJS();
    }
}

export default new NoteStore();
