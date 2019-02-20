import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import * as React from 'react';
import type {CategoryType, NoteType} from 'types/NoteType';

type Props = {
    notes: Array<NoteType>,
    selectedCategory: CategoryType,
    bar?: string,
};

@inject(stores => (
    {
        notes: stores.noteStore.getNoteItemsByCategory,
        selectedCategory:     stores.categoryStore.getSelectedCategory,
    }
))
@observer
export default class NoteList extends React.Component {

    static defaultProps = {
        name: '',
    };

    render() {
        const {notes, selectedCategory} = this.props;
        return (
            <div>NoteList {selectedCategory ? notes.length : 'Select any category'}</div>
        );
    }
}
