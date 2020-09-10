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
    password: yup.string().required("Required field"),
    passwordConfirm: yup.string().required("Required field").oneOf([yup.ref("password"), null], "Passwords must match")
})

const SignUp = (props) => {
    const {register, handleSubmit, errors, setError} = useForm({
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

    const submitHandler = async (formData) => {
        props.startLoading();
        const res = await props.onSignUp(formData.email, formData.password);
        if(res.error) {
            switch(res.error.message) {
                case "EMAIL_EXISTS":
                    setError(authForm.email.name, {
                        message: "Email is already in use"
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
    

    return (
        <div className={classes.Auth}>
            <form onSubmit={handleSubmit(submitHandler)} noValidate>
                {form}
                <Button className={classes.SubmitBtn} btnType="Success">Sign Up</Button> 
            </form>
            <Link to="/signin" className={classes.Instead}>Already have an account? Sign In instead</Link>
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
        onSignUp: (email, password, passwordConfirm) => dispatch(actions.signUp(email, password, passwordConfirm)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
        startLoading: () => dispatch(showLoading()),
        stopLoading: () => dispatch(hideLoading())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);