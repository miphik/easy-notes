// @flow
import {action, observable} from 'mobx';

export type ThemeType = {
    isBlack: boolean,
    scaleFactor: number,
    mainFontSize: number,
    color: {
        button: string,
        buttonActive: string,
        dangerButton: string,
        black: string,
        first: string,
        second: string,
        third: string,
        textMain: string,
    },
};

const DEFAULT_THEME = (scale: number) => (
    {
        isBlack:      true,
        scaleFactor:  scale,
        mainFontSize: 14 * scale,
        color:        {
            button:       '#8e8e8e',
            buttonActive: '#d3d3d3',

            dangerButton: '#f5222d',

            black: '#000',

            first:  '#1C262A',
            second: '#242E32',
            third:  '#32373A',

            textMain: '#d3d3d3',
        },
    }
);

class ThemeStore {
    @observable scaleFactor = 1;

    @observable theme = observable.map(DEFAULT_THEME(this.scaleFactor));

    @action
    changeScaleFactor = (scale: number) => {
        this.scaleFactor = scale;
        this.theme = observable.map(DEFAULT_THEME(scale));
    };

    get getTheme(): ThemeType {
        const theme = {};
        this.theme.forEach((value: Object, name: string) => theme[name] = value);
        return theme;
    }
}

export default new ThemeStore();
