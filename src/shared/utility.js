export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
}

export const checkValidity = (value, rules, form) => {
    let isValid = true;
    if(!rules) {
        return true;
    }

    if(rules.required) {
        isValid = value.trim() !== '' && isValid;
    }
    if(rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }
    if(rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }
    if(rules.isEmail) {
        // eslint-disable-next-line
        const pattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        isValid = pattern.test(value) && isValid
    }
    if(rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    if(rules.equalTo) {
        isValid = form.password.value === form.passwordConfirm.value;
    }
    return isValid;
}