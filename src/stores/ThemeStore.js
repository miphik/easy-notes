// @flow
import {action, observable} from 'mobx';
import store from 'store';

export type ThemeType = {
    isBlack: boolean,
    scaleFactor: number,
    mainFontSize: number,
    measure: {
        rowCategoryHeight: number,
        scaffoldCategoryBlockPxWidth: number,
    },
    color: {
        gray: string,
        selected: string,
        button: string,
        buttonActive: string,
        dangerButton: string,
        black: string,
        lightBlack: string,
        white: string,
        first: string,
        second: string,
        third: string,
        marker: string,
        textMain: string,
    },
};

export const COLORS_KEY = 'THEME:COLORS_KEY';

const DEFAULT_THEME = (scale: number) => (
    {
        isBlack:      true,
        scaleFactor:  scale,
        mainFontSize: scale,
        measure:      {
            rowCategoryHeight:            '2em',
            scaffoldCategoryBlockPxWidth: 20,
        },
        color: {
            gray: '#747474',

            selected: 'rgba(211, 211, 211, 0.2)',

            button:       '#8e8e8e',
            buttonActive: '#d3d3d3',

            dangerButton: '#f5222d',

            lightBlack: '#1d1d1d',
            black:      '#000',
            white:      '#fff',

            first:  '#242E32',
            second: '#1C262A',
            third:  '#32373A',

            marker: '#06AED5',

            textMain: '#d3d3d3',
        },
    }
);

class ThemeStore {
    @observable scaleFactor = 14;

    @observable theme = observable.map(DEFAULT_THEME(this.scaleFactor));

    @action
    changeScaleFactor = (scale: number) => {
        this.scaleFactor = scale;
        document.body.style.fontSize = `${scale}px`;
        this.theme = observable.map(DEFAULT_THEME(scale));
    };

    get getTheme(): ThemeType {
        const theme = {};
        this.theme.forEach((value: Object, name: string) => theme[name] = value);
        return theme;
    }
}

export default new ThemeStore();
