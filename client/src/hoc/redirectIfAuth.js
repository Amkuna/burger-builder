import React from 'react';
import {Redirect} from 'react-router-dom';

const redirectIfAuth = (WrappedComponent) => {
    return props => {
        //If already authorized, return to the page the user came from
        //FIX REDIRECT
        console.log("CAME FROM: ", props.authRedirectPath);

        if(props.isAuth) {
            return <Redirect to={props.authRedirectPath} />
        }

        return (
            <WrappedComponent {...props} />
        )
    }
};

export default redirectIfAuth;