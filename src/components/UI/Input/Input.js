import React from 'react';
import classes from './Input.module.css';

const Input = (props) => {

    let inputElement = null;
    const inputClasses = [classes.InputElement];

    //Showcase error
    if(props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    switch (props.elementType) {
        case 'input':
            inputElement = <input {...props.elementConfig} onChange={props.changed} className={inputClasses.join(' ')}  value={props.value}/>
            break;
        case 'textarea':
            inputElement = <textarea {...props.elementConfig} onChange={props.changed} className={inputClasses.join(' ')}  value={props.value}/>
            break;
        case 'select':
            inputElement = (
                <select 
                    className={inputClasses.join(' ')}
                    value={props.value}
                    onChange={props.changed}
                >
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>
            )
            break;
        default:
            inputElement = <input {...props.elementConfig} onChange={props.changed} className={inputClasses.join(' ')}  value={props.value}/>
    }

    return (
        <div className={classes.Input}>
            {props.label && <label className={classes.Label}>{props.label}</label>}
            {inputElement}
        </div>
    )
};

export default Input;