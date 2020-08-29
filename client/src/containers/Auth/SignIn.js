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

import redirectIfAuth from '../../hoc/redirectIfAuth';
import {compose} from 'redux';

const schema = yup.object().shape({
    email: yup.string().required("Required field").email("Please enter a valid email"),
    password: yup.string().required("Required field")
})

const SignIn = (props) => {
    const {register, handleSubmit, errors} = useForm({
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
    
    if(props.loading) {
    }

    const submitHandler = (formData) => {
        props.onAuth(formData.email, formData.password, () => {
            props.history.push("/");
        });
    }

    return (
        <div className={classes.Auth}>
            {props.error && <p>{props.error.message}</p>}
            <form onSubmit={handleSubmit(submitHandler)}>
                {form}
                <Button btnType="Success">Sign In</Button> 
            </form>
            <Link to="/signup">Don't have an account? Sign Up here!</Link>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        building: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, callback) => dispatch(actions.signIn(email, password, callback)),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default compose (
    connect(mapStateToProps, mapDispatchToProps),
    redirectIfAuth
)(SignIn);