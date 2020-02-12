/* eslint-disable flowtype/no-weak-types,max-classes-per-file */

// @flow

export class RangeType {
    startContainer: number[];

    startOffset: number;

    endContainer: number[];

    endOffset: number;
}

export class SnapshotType {
    html: string;

    range: RangeType;

    constructor(
        html: string,
        range: RangeType,
    ) {
        this.html = html;
        this.range = range;
    }
}

export class Command {
    observer: Object;

    oldValue: SnapshotType;

    newValue: SnapshotType;

    undo() {
        this.observer.snapshot.restore(this.oldValue);
    }

    redo() {
        this.observer.snapshot.restore(this.newValue);
    }

    constructor(
        oldValue: SnapshotType,
        newValue: SnapshotType,
        observer: Object,
    ) {
        this.observer = observer;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}
