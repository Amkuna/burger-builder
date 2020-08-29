import React from 'react';
import classes from './Input.module.css';

const Input = (props) => {

    let inputElement = null;
    const inputClasses = [classes.InputElement];

    //Showcase error
    if(props.invalid && props.validation && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    switch (props.elementType) {
        case 'input':
            inputElement = 
                <input 
                    {...props.elementConfig} 
                    name={props.name} 
                    className={inputClasses.join(' ')}  
                    defaultValue={props.defaultValue}
                    ref={props.register(props.validation)}
                />
            break;
        case 'textarea':
            inputElement = 
                <textarea 
                    {...props.elementConfig} 
                    name={props.name}
                    className={inputClasses.join(' ')}  
                    ref={props.register(props.validation)}
                />
            break;
        case 'select':
            inputElement = (
                <select 
                    {...props.elementConfig}
                    name={props.name}
                    className={inputClasses.join(' ')}
                    ref={props.register(props.validation)}
                >
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>
            )
            break;
        default:
            inputElement = (
                <input 
                    ref={props.register(props.validation)} 
                    {...props.elementConfig} onChange={props.changed} 
                    className={inputClasses.join(' ')} 
                />
            )
    }

    return (
        <div className={classes.Input}>
            {props.label && <label className={classes.Label}>{props.label}</label>}
            {inputElement}

            {props.error &&
            <p className={classes.InputError}>
                {props.error.message}
            </p>
            }
        </div>
    )
};

export default Input;