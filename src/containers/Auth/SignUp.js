import React, {useEffect} from 'react';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers';
import * as yup from 'yup';

const schema = yup.object().shape({
    email: yup.string().required("Required field").email("Please enter a valid email"),
    password: yup.string().required("Required field"),
    passwordConfirm: yup.string().required("Required field").oneOf([yup.ref("password"), null], "Passwords must match")
})

const SignUp = (props) => {
    const {register, handleSubmit, errors} = useForm({
        resolver: yupResolver(schema)
    });

    const authForm = {
        email: {
            elementType: "input",
            name: "email",
            elementConfig: {
                type: "email",
                placeholder: "Email address"
            },
        },
        password: {
            elementType: "input",
            name: "password",
            elementConfig: {
                type: "password",
                placeholder: "Password"
            },
        },
        passwordConfirm: {
            elementType: "input",
            name: "passwordConfirm",
            elementConfig: {
                type: "password",
                placeholder: "Repeat password"
            },
        }
    }

    const {building, authRedirectPath, setAuthRedirectPath} = props;

    useEffect(() => {
        if(!building && authRedirectPath !== '/') {
            setAuthRedirectPath('/');
        }
    }, [building, authRedirectPath, setAuthRedirectPath]);
    
    const submitHandler = (formData) => {
        props.onAuth(formData.email, formData.password);
    }

    if(props.token) {
        return <Redirect to={props.location.state?.from || "/"} />
    }

    //Sets id as the name of the input, and config as the rest of the input's configuration
    const formElementsArray = [];
    for (let key in authForm) {
        formElementsArray.push({
            id: key,
            config: authForm[key]
        })
    }

    let form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id} 
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig} 
            name={formElement.config.name}

            register={register}
            error={errors[formElement.config.name]}
        />
    ))
    
    if(props.loading) {
    }

    return (
        <div className={classes.Auth}>
            {props.error && <p>{props.error.message}</p>}
            <form onSubmit={handleSubmit(submitHandler)}>
                {form}
                <Button className={classes.SubmitBtn} btnType="Success">Sign Up</Button> 
            </form>
            <Link to="/signin">Already have an account? Sign In instead</Link>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.token,
        building: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, passwordConfirm) => dispatch(actions.signUp(email, password, passwordConfirm)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);