export const NUMBER_REGEX = /^-?\d+$/;
export const DOUBLE_REGEX = /^-?[0-9]+(\.[0-9]+)?$/;

export default class TypeUtils {
    static roundTwo(number) {
        return Math.round(number * 100) / 100;
    }

    static formatNumber(number) {
        return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace('.00', '');
    }

    static isNumber(number) {
        return NUMBER_REGEX.test(number);
    }

    static isDouble(number) {
        return DOUBLE_REGEX.test(number);
    }

    static isTrue(value, strict = false) {
        let newVal = value;
        if (newVal instanceof Object) {
            if (!strict || Object.keys(newVal).length) {
                return true;
            }
            return false;
        }
        if (Array.isArray(newVal)) {
            if (!strict || newVal.length) {
                return true;
            }
            return false;
        }
        if (typeof newVal === 'string') {
            newVal = newVal.toLowerCase();
        }
        switch (newVal) {
            case true:
            case 'true':
            case 1:
            case '1':
            case 'on':
            case 'yes':
                return true;
            case '':
            case 'false':
                return false;
            default:
                return typeof newVal === 'string';
        }
    }
}
