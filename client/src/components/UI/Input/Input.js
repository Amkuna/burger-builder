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
                    onChange={props.onChange} 
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
                    onChange={props.onChange} 
                    className={inputClasses.join(' ')}  
                    defaultValue={props.defaultValue}
                    ref={props.register(props.validation)}
                />
            break;
        case 'select':
            inputElement = (
                <select 
                    {...props.elementConfig}
                    name={props.name}
                    className={inputClasses.join(' ')}
                    defaultValue={props.value}
                    onChange={props.onChange}
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
                    defaultValue={props.defaultValue}
                />
            )
    }

    return (
        <div className={classes.Input}>
            {props.label && <label className={classes.Label}>{props.label}</label>}
            {inputElement}
            <div>
                {props.error?.type === 'required' && "This field is required"}
            </div>
        </div>
    )
};

export default Input;