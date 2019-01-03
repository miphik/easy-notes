/* eslint-disable react/prop-types */
import cloneDeep from 'lodash/cloneDeep';
/* eslint-disable no-param-reassign,react/no-access-state-in-setstate,react/destructuring-assignment */
import isEqual from 'lodash/isEqual';
import React, {Component} from 'react';

const EMPTY_STATE = {
    formValues:   {},
    focusedField: {},
    touchedField: {},
    errors:       {},
    asyncErrors:  {},
};

export const FormContext = React.createContext();
export const getArrayValue = (name, values, onlyPrimitives = false) => {
    if (typeof name !== 'string') return undefined;
    const arrName = name.split('.');
    let index = 0;
    let tempValue = values;
    // eslint-disable-next-line no-cond-assign
    while (arrName.length > index) {
        tempValue = tempValue[arrName[index].replace('$', '')];
        if (tempValue === undefined) return undefined;
        index += 1;
        if (arrName.length !== index && !tempValue) return undefined;
    }
    return onlyPrimitives
    && (((typeof tempValue === 'object' && !React.isValidElement(tempValue)) || Array.isArray(tempValue)))
        ? undefined : tempValue;
};

const setArrayValue = (name, newValue, values) => {
    const arrName = name.split('.');
    let index = 0;
    const newValues = cloneDeep(values);
    let tempValue = newValues;
    // eslint-disable-next-line no-cond-assign
    while (arrName.length > index) {
        if (arrName[index].indexOf('$') === 0) {
            arrName[index] = arrName[index].replace('$', '');
        }
        if (!tempValue[arrName[index]]) tempValue[arrName[index]] = {};
        if (arrName.length - 1 === index) {
            tempValue[arrName[index]] = newValue;
        } else {
            tempValue = tempValue[arrName[index]];
        }
        index += 1;
    }
    return newValues;
};

const simpleForm = (formIdentity, debug = false) => Comp => class extends Component {
    fieldValidators = {};

    constructor(props) {
        super(props);
        this.state = {
            ...EMPTY_STATE,
            formValues: cloneDeep(props.initialValues) || {},
        };
        if (debug) this.logging('constructor, init', {initialValues: this.state.formValues});
    }

    componentWillReceiveProps(nextProps) {
        const {initialValues} = this.props;
        const {formValues} = this.state;
        const newInitialValues = cloneDeep(nextProps.initialValues);

        if (!isEqual(newInitialValues, initialValues) || !Object.keys(formValues).length || nextProps.reInitForm) {
            this.setState({...EMPTY_STATE, formValues: newInitialValues || {}});
            if (debug) this.logging('receivedNewProps', {initialValues: newInitialValues || {}});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual([nextProps, nextState], [this.props, this.state]);
    }

    onChangeValue = (name, value, {validateOnChangeAlways = false, resetField = null} = {}) => {
        const {onChange} = this.props;
        const {focusedField, touchedField} = this.state;
        let val = value;
        if (value && value.target && value.target.value !== undefined) {
            val = value.target.value;
        } else if (value && value.target && value.target.checked !== undefined) val = value.target.checked;
        let formValues = setArrayValue(name, val, {...this.state.formValues});
        let errors = {...this.state.errors};
        // formValues[name] = val;
        if (!focusedField[name] || validateOnChangeAlways) {
            const error = this.validateOneField(name, val);
            if (error) {
                errors = setArrayValue(name, error, errors);
            } else {
                errors = setArrayValue(name, null, errors);
            }
        } else if (touchedField[name] || validateOnChangeAlways) {
            errors = setArrayValue(name, null, errors);
        }
        if (resetField && typeof resetField === 'string') {
            formValues = setArrayValue(resetField, undefined, formValues);
        }

        if (debug) {
            this.logging('field value changed', {
                name,
                value,
                formValues,
                errors,
            });
        }
        this.setState({
            formValues,
            errors,
        }, () => {
            // eslint-disable-next-line react/prop-types
            if (onChange) onChange(name, val, formValues);
        });
    };

    onFocus = name => {
        const {focusedField, touchedField} = this.state;
        focusedField[name] = true;
        touchedField[name] = true;
        this.setState({focusedField, touchedField});
        if (debug) this.logging('field focused', {name});
    };

    onBlur = name => {
        let errors = {...this.state.errors};
        const focusedField = {...this.state.focusedField};
        delete focusedField[name];
        const error = this.validateOneField(name);
        if (error) {
            errors = setArrayValue(name, error, errors);
        }
        this.setState({
            focusedField,
            errors,
        });
        if (debug) {
            this.logging(
                'field blur',
                {
                    name,
                    errors,
                },
            );
        }
    };

    onSubmit = successFunc => () => {
        const errors = this.validate();
        const {asyncErrors, formValues} = this.state;
        if (!Object.keys(errors).length && !Object.keys(asyncErrors).length && successFunc) {
            successFunc({...formValues});
        }
        if (debug) {
            this.logging(
                'form submitted',
                {
                    formValues,
                    asyncErrors,
                    errors,
                },
            );
        }
    };

    setValidators = (name, validators) => (this.fieldValidators[name] = validators);

    logging = (...args) => {
        if (args[0]) console.log(`%c ${formIdentity}:`, 'background: #222; color: #D4E157', ...args);
    };

    validateOneField = (name, value) => {
        const formValues = {...this.state.formValues};
        const fieldValue = value === undefined ? getArrayValue(name, formValues) : value;
        const validator = this.fieldValidators[name];
        let error;
        if (validator) {
            if (typeof validator === 'function') {
                error = validator(fieldValue, formValues, this.props);
            } else if (Array.isArray(validator)) {
                // eslint-disable-next-line no-restricted-syntax
                for (const valid of validator) {
                    if (typeof valid === 'function') error = valid(fieldValue, formValues, this.props);
                    if (error) break;
                }
            }
        }
        return error;
    };

    validate = () => {
        let errors = {};
        Object.keys(this.fieldValidators)
            .forEach(fieldName => {
                const error = this.validateOneField(fieldName);
                if (error) errors = setArrayValue(fieldName, error, errors);
            });
        this.setState({errors});
        return errors;
    };

    validateAsync = promise => new Promise(resolve => this.setState({asyncErrors: {}}, resolve)).then(
        promise.catch(errors => this.setState({asyncErrors: errors})),
    );

    resetForm = () => {
        this.setState({...EMPTY_STATE});
        if (debug) this.logging('form reset');
    };

    invalidateField = (name, error) => {
        const pairs = typeof name === 'object' ? name : {[name]: error};
        const {errors, focusedField} = this.state;
        let newErrors = {
            ...errors,
            ...pairs,
        };
        const focused = {};
        Object.keys(pairs)
            .forEach(field => {
                if (!newErrors[field]) {
                    newErrors = setArrayValue(field, null, errors);
                }
                focused[field] = true;
            });
        const newFocused = {
            ...focusedField,
            ...focused,
        };
        this.setState({
            errors:       newErrors,
            focusedField: newFocused,
        });
    };

    render() {
        const {
            formValues, touchedField, errors, focusedField, asyncErrors,
        } = this.state;
        if (debug) {
            this.logging('form render', {
                formValues, touchedField, errors, focusedField, asyncErrors,
            });
        }
        return (
            <FormContext.Provider
                value={{
                    errors:        this.state.errors,
                    values:        this.state.formValues,
                    asyncErrors:   this.state.asyncErrors,
                    onChange:      this.onChangeValue,
                    onFocus:       this.onFocus,
                    onBlur:        this.onBlur,
                    setValidators: this.setValidators,
                }}
            >
                <Comp
                    {...this.props}
                    onSubmitForm={this.onSubmit}
                    formValues={formValues}
                    validate={this.validate}
                    resetForm={this.resetForm}
                    invalidateField={this.invalidateField}
                    changeField={this.onChangeValue}
                    validateAsync={this.validateAsync}
                />
            </FormContext.Provider>
        );
    }
};

export default simpleForm;
