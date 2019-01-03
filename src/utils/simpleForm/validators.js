import React from 'react';
import {FormattedMessage as Fm} from 'react-intl';
import TypeUtils from 'utils/TypeUtils';

export const PERCENT_REGEX = /^[1-9][0-9]?%$|^100%$/i;

const requiredError = <Fm id="Validation.rules.required" defaultMessage="Required"/>;
export const required = value => ((Array.isArray(value) && !value.length) || !value
        ? requiredError
        : undefined
);

const numberError = <Fm id="Validation.rules.number" defaultMessage="Number expected"/>;
// eslint-disable-next-line no-restricted-globals
export const number = value => (value && isNaN(Number(value)) ? numberError : undefined);

const numberOrPercentError = (
    <Fm
        id="Validation.rules.numberOrPercent"
        defaultMessage="Number or from 1 to 100% expected"
    />
);
export const numberOrPercent = value => {
    if (PERCENT_REGEX.test(value)) return undefined;
    const isNotNumber = number(value);
    if (isNotNumber) return numberOrPercentError;
    return undefined;
};

const doubleError = <Fm id="Validation.rules.double" defaultMessage="Double expected"/>;
export const double = value => {
    if (value === '' || value === null || value === undefined) return undefined;
    const isNotNumber = number(value);
    if (isNotNumber) return doubleError;
    return !TypeUtils.isDouble(value) ? doubleError : undefined;
};
const doubleOrPercentError = (
    <Fm
        id="Validation.rules.doubleOrPercent"
        defaultMessage="Double or from 1 to 100% expected"
    />
);
export const doubleOrPercent = value => {
    if (PERCENT_REGEX.test(value)) return undefined;
    const isNotNumber = number(value);
    if (isNotNumber) return doubleOrPercentError;
    return !TypeUtils.isDouble(value) ? doubleOrPercentError : undefined;
};

const phoneNumberError = (
    <Fm
        id="Validation.rules.phoneNumber"
        defaultMessage="Invalid phone number, must be 10 digits"
    />
);
export const phoneNumber = value => (value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? phoneNumberError
    : undefined);

const emailError = <Fm id="Validation.rules.email" defaultMessage="Invalid email address"/>;
export const email = value => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? emailError
    : undefined);

const urlError = <Fm id="Validation.rules.httpUrl" defaultMessage="Invalid url"/>;
export const url = value => (value && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)
    ? urlError
    : undefined);

const alphanumericAndUnderscoreError = (
    <Fm
        id="Validation.rules.alphanumericAndUnderscore"
        defaultMessage="Use only letters, numbers and underscore"
    />
);
export const alphanumericAndUnderscore = string => (/^[a-z0-9_]+$/gmi.test(string)
    ? undefined
    : alphanumericAndUnderscoreError);
