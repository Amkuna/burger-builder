import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

const PrivateRoute = ({component: Component, isAuth, ...rest}) => {
    return (
        <Route 
            {...rest} 
            render={
                (props) => isAuth?
                    <Component {...props} />
                    :
                    <Redirect 
                        to={{
                            pathname: "/signin",
                            state: {
                                from: props.location
                            }
                        }} 
                    />
            }
        />
    )
};

const mapStateToProps = state => ({
    isAuth: state.auth.token !== null
});

export default connect(mapStateToProps)(PrivateRoute);