import React, {useEffect} from 'react';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers';
import * as yup from 'yup';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

const schema = yup.object().shape({
    email: yup.string().required("Required field").email("Please enter a valid email"),
    password: yup.string().required("Required field")
})

const SignIn = (props) => {

    const {register, handleSubmit, errors, setError} = useForm({
        resolver: yupResolver(schema)
    });

    const authForm = {
        email: {
            name: "email",
            elementType: "input",
            elementConfig: {
                type: "email",
                placeholder: "Email address"
            },
        },
        password: {
            name: "password",
            elementType: "input",
            elementConfig: {
                type: "password",
                placeholder: "Password"
            },
        }
    }

    const {building, authRedirectPath, setAuthRedirectPath} = props;
    
    useEffect(() => {
        if(!building && authRedirectPath !== '/') {
            setAuthRedirectPath('/');
        }
    }, [building, authRedirectPath, setAuthRedirectPath]);


    //Sets id as the name of the input, and config as the rest of the input's configuration
    const formElementsArray = [];
    for (let key in authForm) {
        formElementsArray.push({
            id: key,
            ...authForm[key]
        })
    }

    let form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id} 
            elementType={formElement.elementType} 
            elementConfig={formElement.elementConfig} 

            name={formElement.name}
            register={register}
            validation={formElement.validation}
            error={errors[formElement.name]}
        />
    ))
    
    
    const submitHandler = async (formData) => {
        props.startLoading();
        const res = await props.onSignIn(formData.email, formData.password);
        if(res.error) {
            switch(res.error.message) {
                case "EMAIL_NOT_FOUND":
                    setError(authForm.email.name, {
                        message: "Email not found"
                    });
                    break;
                case "INVALID_PASSWORD":
                    setError(authForm.password.name, {
                        message: "Invalid password"
                    });
                    break;
                default:
                    setError(authForm.email.name, {
                        message: "Unknown error"
                    })
                    break;
            }
        } else {
            props.history.replace(props.location.state?.from || "/");
        }
        props.stopLoading();
    }

    return (
        <div className={classes.Auth}>
            <form onSubmit={handleSubmit(submitHandler)} noValidate>
                {form}
                <Button 
                    btnType="Success"
                    className={classes.SubmitBtn}
                >
                    Sign In
                </Button> 
            </form>
            <Link to="/signup" className={classes.Instead}>Don't have an account? Sign Up here!</Link>
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
        onSignIn: async (email, password) => dispatch(actions.signIn(email, password)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
        startLoading: () => dispatch(showLoading()),
        stopLoading: () => dispatch(hideLoading())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);