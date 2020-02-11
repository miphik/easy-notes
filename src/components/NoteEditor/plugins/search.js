/**
 * Search plugin. it is used for custom search in text
 * ![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)
 *
 * @example
 * ```typescript
 * var jodit = new Jodit('#editor', {
 *  useSearch: false
 * });
 * // or
 * var jodit = new Jodit('#editor', {
 *  disablePlugins: 'search'
 * });
 * ```
 */
import {Jodit, MODE_WYSIWYG, trim} from 'jodit';
import * as consts from '../constants';

class search {
    static getSomePartOfStringIndex(
        needle,
        haystack,
        start = true,
    ) {
        return this.findSomePartOfString(needle, haystack, start, true);
    }

    static findSomePartOfString(
        needle,
        haystack,
        start = true,
        getIndex = false,
    ) {
        needle = trim(needle.toLowerCase().replace(consts.SPACE_REG_EXP, ' '));
        haystack = haystack.toLowerCase();

        let i = start ? 0 : haystack.length - 1;
        let needleStart = start ? 0 : needle.length - 1;
        let tmpEqualLength = 0;
        let startAtIndex = null;

        const inc = start ? 1 : -1;
        const tmp = [];

        for (; haystack[i] !== undefined; i += inc) {
            const some = needle[needleStart] === haystack[i];
            if (
                some
                || (startAtIndex !== null
                && consts.SPACE_REG_EXP.test(haystack[i]))
            ) {
                if (startAtIndex === null || !start) {
                    startAtIndex = i;
                }

                tmp.push(haystack[i]);

                if (some) {
                    tmpEqualLength += 1;
                    needleStart += inc;
                }
            } else {
                startAtIndex = null;
                tmp.length = 0;
                tmpEqualLength = 0;
                needleStart = start ? 0 : needle.length - 1;
            }

            if (tmpEqualLength === needle.length) {
                return getIndex ? startAtIndex : true;
            }
        }

        if (getIndex) {
            return startAtIndex ?? false;
        }

        if (tmp.length) {
            return start ? tmp.join('') : tmp.reverse().join('');
        }

        return false;
    }

    template = `<div class="jodit_search">
			<div class="jodit_search_box">
				<div class="jodit_search_inputs">
					<input tabindex="0" class="jodit_search-query" placeholder="Search for" type="text"/>
					<input tabindex="0" class="jodit_search-replace" placeholder="Replace with" type="text"/>
				</div>
				<div class="jodit_search_counts">
					<span>0/0</span>
				</div>
				<div class="jodit_search_buttons">
					<button tabindex="0" type="button" class="jodit_search_buttons-next">${1}</button>
					<button tabindex="0" type="button" class="jodit_search_buttons-prev">${2}</button>
					<button tabindex="0" type="button" class="jodit_search_buttons-cancel">${3}</button>
					<button tabindex="0" type="button" class="jodit_search_buttons-replace">Replace</button>
				</div>
			</div>
		</div>`;

    isOpened = false;

    selInfo = null;

    current = false;

    eachMap = (
        node,
        callback,
        next,
    ) => {
        Jodit.modules.Dom.findWithCurrent(
            node,
            child => !!child && callback(child),
            this.jodit.editor,
            next ? 'nextSibling' : 'previousSibling',
            next ? 'firstChild' : 'lastChild',
        );
    };

    updateCounters = () => {
        if (!this.isOpened) {
            return;
        }

        this.counterBox.style.display = this.queryInput.value.length
            ? 'inline-block'
            : 'none';

        const {range} = this.jodit.selection;
        const counts = this.calcCounts(
            this.queryInput.value,
            range,
        );

        this.counterBox.textContent = counts.join('/');
    };

    boundAlreadyWas(current, bounds) {
        return bounds.some(bound => (
            bound.startContainer === current.startContainer
            && bound.endContainer === current.endContainer
            && bound.startOffset === current.startOffset
            && bound.endOffset === current.endOffset
        ), false);
    }

    tryScrollToElement(startContainer) {
        // find scrollable element
        let parentBox = Jodit.modules.Dom.closest(
            startContainer,
            Jodit.modules.Dom.isElement,
            this.jodit.editor,
        );

        if (!parentBox) {
            parentBox = Jodit.modules.Dom.prev(
                startContainer,
                Jodit.modules.Dom.isElement,
                this.jodit.editor,
            );
        }

        parentBox
        && parentBox !== this.jodit.editor
        && parentBox.scrollIntoView();
    }

    searchBox;

    queryInput;

    replaceInput;

    closeButton;

    nextButton;

    prevButton;

    replaceButton;

    counterBox;

    calcCounts = (
        query,
        current = false,
    ) => {
        const bounds = [];

        let currentIndex = 0;
        let count = 0;
        let bound;
        let start = this.jodit.editor.firstChild;

        while (start && query.length) {
            bound = this.find(
                start,
                query,
                true,
                0,
                bound || this.jodit.editorDocument.createRange(),
            );
            if (bound) {
                if (this.boundAlreadyWas(bound, bounds)) {
                    break;
                }
                bounds.push(bound);
                start = bound.startContainer;
                count += 1;
                if (current && this.boundAlreadyWas(current, [bound])) {
                    currentIndex = count;
                }
            } else {
                start = null;
            }
        }

        return [currentIndex, count];
    };

    findAndReplace = (start, query) => {
        const {range} = this.jodit.selection;
        const bound = this.find(
            start,
            query,
            true,
            0,
            range,
        );

        if (bound && bound.startContainer && bound.endContainer) {
            const rng = this.jodit.editorDocument.createRange();

            try {
                if (bound && bound.startContainer && bound.endContainer) {
                    rng.setStart(
                        bound.startContainer,
                        bound.startOffset,
                    );

                    rng.setEnd(bound.endContainer, bound.endOffset);
                    rng.deleteContents();

                    const textNode = this.jodit.create.inside.text(
                        this.replaceInput.value,
                    );

                    rng.insertNode(textNode);
                    this.jodit.selection.select(textNode);
                    this.tryScrollToElement(textNode);
                }
            } catch {
            }

            return true;
        }

        return false;
    };

    findAndSelect = (
        start,
        query,
        next,
    ) => {
        const {range} = this.jodit.selection;
        const bound = this.find(
            start,
            query,
            next,
            0,
            range,
        );

        if (bound && bound.startContainer && bound.endContainer) {
            const rng = this.jodit.editorDocument.createRange();

            try {
                rng.setStart(bound.startContainer, bound.startOffset);
                rng.setEnd(bound.endContainer, bound.endOffset);
                this.jodit.selection.selectRange(rng);
            } catch (e) {
            }

            this.tryScrollToElement(bound.startContainer);

            this.current = bound.startContainer;
            this.updateCounters();

            return true;
        }

        return false;
    };

    find = (
        start,
        query,
        next,
        deep,
        range,
    ): false | ISelectionRange => {
        if (start && query.length) {
            let sentence: string = '';
            let bound: ISelectionRange = {
                startContainer: null,
                startOffset:    null,
                endContainer:   null,
                endOffset:      null,
            };

            this.eachMap(
                start,
                elm => {
                    if (
                        Jodit.modules.Dom.isText(elm)
                        && elm.nodeValue !== null
                        && elm.nodeValue.length
                    ) {
                        let value = elm.nodeValue;

                        if (!next && elm === range.startContainer) {
                            value = !deep
                                ? value.substr(0, range.startOffset)
                                : value.substr(range.endOffset);
                        } else if (next && elm === range.endContainer) {
                            value = !deep
                                ? value.substr(range.endOffset)
                                : value.substr(0, range.startOffset);
                        }

                        const tmpSentence = next
                            ? sentence + value
                            : value + sentence;

                        const part = search.findSomePartOfString(
                            query,
                            tmpSentence,
                            next,
                        );

                        if (part !== false) {
                            let currentPart = search.findSomePartOfString(
                                query,
                                value,
                                next,
                            );

                            if (currentPart === true) {
                                currentPart = trim(query);
                            } else if (currentPart === false) {
                                currentPart = search.findSomePartOfString(
                                    value,
                                    query,
                                    next,
                                );
                                if (currentPart === true) {
                                    currentPart = trim(value);
                                }
                            }

                            let currentPartIndex = search.getSomePartOfStringIndex(
                                query,
                                value,
                                next,
                            ) || 0;

                            if (
                                ((next && !deep) || (!next && deep))
                                && elm.nodeValue.length - value.length > 0
                            ) {
                                currentPartIndex
                                    += elm.nodeValue.length - value.length;
                            }

                            if (bound.startContainer === null) {
                                bound.startContainer = elm;
                                bound.startOffset = currentPartIndex;
                            }
                            if (part !== true) {
                                sentence = tmpSentence;
                            } else {
                                bound.endContainer = elm;
                                bound.endOffset = currentPartIndex;
                                bound.endOffset += currentPart.length;

                                return true;
                            }
                        } else {
                            sentence = '';
                            bound = {
                                startContainer: null,
                                startOffset:    null,
                                endContainer:   null,
                                endOffset:      null,
                            };
                        }
                    } else if (
                        Jodit.modules.Dom.isBlock(elm, this.jodit.editorWindow)
                        && sentence !== ''
                    ) {
                        sentence = next ? `${sentence} ` : ` ${sentence}`;
                    }

                    return false;
                },
                next,
            );

            if (bound.startContainer && bound.endContainer) {
                return bound;
            }

            if (!deep) {
                this.current = next
                    ? this.jodit.editor.firstChild
                    : this.jodit.editor.lastChild;
                return this.find(this.current, query, next, deep + 1, range);
            }
        }

        return false;
    };

    open = (searchAndReplace = false) => {
        if (!this.isOpened) {
            this.searchBox.classList.add('jodit_search-active');
            this.isOpened = true;
        }

        this.jodit.events.fire('hidePopup');
        this.searchBox.classList.toggle(
            'jodit_search-and-replace',
            searchAndReplace,
        );

        this.current = this.jodit.selection.current();
        this.selInfo = this.jodit.selection.save();

        const selStr = (this.jodit.selection.sel || '').toString();

        if (selStr) {
            this.queryInput.value = selStr;
        }

        this.updateCounters();

        if (selStr) {
            this.queryInput.select();
        } else {
            this.queryInput.focus();
        }
    };

    close = () => {
        if (!this.isOpened) {
            return;
        }

        if (this.selInfo) {
            this.jodit.selection.restore(this.selInfo);
            this.selInfo = null;
        }

        this.searchBox.classList.remove('jodit_search-active');
        this.isOpened = false;
    };

    afterInit(editor) {
        console.log(111111);
        if (editor.options.useSearch) {
            const self = this;

            self.searchBox = editor.create.fromHTML(
                self.template,
            );

            const qs = self.searchBox.querySelector.bind(self.searchBox);

            self.queryInput = qs(
                'input.jodit_search-query',
            );

            self.replaceInput = qs(
                'input.jodit_search-replace',
            );

            self.closeButton = qs(
                '.jodit_search_buttons-cancel',
            );

            self.nextButton = qs(
                '.jodit_search_buttons-next',
            );

            self.prevButton = qs(
                '.jodit_search_buttons-prev',
            );

            self.replaceButton = qs(
                '.jodit_search_buttons-replace',
            );

            self.counterBox = qs(
                '.jodit_search_counts span',
            );

            const onInit = () => {
                editor.workplace.appendChild(this.searchBox);

                editor.events
                    .off(this.jodit.container, 'keydown.search')
                    .on(
                        this.jodit.container,
                        'keydown.search',
                        e => {
                            if (editor.getRealMode() !== MODE_WYSIWYG) {
                                return;
                            }

                            switch (e.which) {
                                case consts.KEY_ESC:
                                    this.close();
                                    break;
                                case consts.KEY_F3:
                                    if (self.queryInput.value) {
                                        editor.events.fire(
                                            !e.shiftKey
                                                ? 'searchNext'
                                                : 'searchPrevious',
                                        );
                                        e.preventDefault();
                                    }
                                    break;
                            }
                        },
                    );
            };
            onInit();

            editor.events
                .on('changePlace', onInit)
                .on(self.closeButton, 'click', this.close)
                .on(self.queryInput, 'mousedown', () => {
                    if (editor.selection.isFocused()) {
                        editor.selection.removeMarkers();
                        self.selInfo = editor.selection.save();
                    }
                })
                .on(self.replaceButton, 'click', e => {
                    self.findAndReplace(
                        editor.selection.current() || editor.editor.firstChild,
                        self.queryInput.value,
                    );

                    this.updateCounters();

                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
                .on([self.nextButton, self.prevButton], 'click', (button, e) => {
                    editor.events.fire(
                        self.nextButton === button
                            ? 'searchNext'
                            : 'searchPrevious',
                    );
                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
                .on(
                    this.queryInput,
                    'keydown',
                    this.jodit.async.debounce(e => {
                        switch (e.which) {
                            case consts.KEY_ENTER:
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                if (editor.events.fire('searchNext')) {
                                    this.close();
                                }
                                break;
                            default:
                                this.updateCounters();
                                break;
                        }
                    }, this.jodit.defaultTimeout),
                )
                .on('beforeSetMode.search', () => {
                    this.close();
                })
                .on('keydown.search mousedown.search', () => {
                    if (this.selInfo) {
                        editor.selection.removeMarkers();
                        this.selInfo = null;
                    }
                    if (this.isOpened) {
                        this.current = this.jodit.selection.current();
                        this.updateCounters();
                    }
                })
                .on('searchNext.search searchPrevious.search', () => self.findAndSelect(
                    editor.selection.current() || editor.editor.firstChild,
                    self.queryInput.value,
                    editor.events.current[
                        editor.events.current.length - 1
                    ] === 'searchNext',
                ))
                .on('search.search', (value, next = true) => {
                    editor.execCommand('search', value, next);
                });

            editor.registerCommand('search', {
                exec: (
                    command,
                    value,
                    next = true,
                ) => {
                    self.findAndSelect(
                        editor.selection.current() || editor.editor.firstChild,
                        value || '',
                        next,
                    );
                    return false;
                },
            });
            editor.registerCommand('openSearchDialog', {
                exec: () => {
                    self.open();
                    return false;
                },
                hotkeys: ['ctrl+f', 'cmd+f'],
            });

            editor.registerCommand('openReplaceDialog', {
                exec: () => {
                    if (!editor.options.readonly) {
                        self.open(true);
                    }
                    return false;
                },
                hotkeys: ['ctrl+h', 'cmd+h'],
            });
        }
    }

    beforeDestruct(jodit) {
        Jodit.modules.Dom.safeRemove(this.searchBox);
        jodit.events.off('.search');
    }
}

Jodit.plugins.add('search2', search);
