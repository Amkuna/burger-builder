import React from 'react';
import {Redirect} from 'react-router-dom';

//IS FOR NOW ONLY WORKING IF YOURE NOT LOGGED IN>>>>
const redirectIfAuth = (WrappedComponent) => {
    console.log("In redirectIfAuth.js");

    return props => {
        //If already authorized, return to the page the user came from
        console.log("In deeper");
        
        if(props.isAuth) {
            return <Redirect to={props.authRedirectPath} />
        }

        return (
            <WrappedComponent {...props} />
        )
    }
};

export default redirectIfAuth;