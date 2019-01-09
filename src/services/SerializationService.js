import {load} from 'protobufjs';

let NoteMessage = null;
let NoteFullMessage = null;
let NotesListMessage = null;

class SerializationService {
    static init = accomplish => {
        load('proto/note.proto', (err, root) => {
            if (err) throw err;

            NoteMessage = root.lookupType('easy_note.Note');
            NoteFullMessage = root.lookupType('easy_note.NoteFull');
            NotesListMessage = root.lookupType('easy_note.NotesList');
            /* const message = AwesomeMessage.create({awesomeField: 'hello'});
            console.log(`message = ${JSON.stringify(message)}`);

            const buffer = AwesomeMessage.encode(message).finish();
            console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

            const decoded = AwesomeMessage.decode(buffer);
            console.log(`decoded = ${JSON.stringify(decoded)}`);*/
            accomplish();
        });
    };

    static convertNotesListToString = notes => {
        const notesList = NotesListMessage.create({notes: notes.map(note => NoteMessage.create(note))});
        const buffer = NotesListMessage.encode(notesList).finish();
        return buffer.toString();
    };

    static convertStringToNotesList = data => NotesListMessage.decode(Buffer.from(data));
}

export default SerializationService;
