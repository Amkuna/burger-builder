import React, {useEffect, Suspense} from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch, withRouter} from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import PrivateRoute from './PrivateRoute';

// const asyncCheckout = asyncComponent(() => {
//   return import('./containers/Checkout/Checkout');
// })

const asyncCheckout = React.lazy(() => import('./containers/Checkout/Checkout'));
const asyncSignIn = React.lazy(() => import ("./containers/Auth/SignIn"));
const asyncSignUp = React.lazy(() => import ("./containers/Auth/SignUp"));
const asyncOrders = asyncComponent(() => import('./containers/Orders/Orders'));

const App = (props) => {

  const {onTryAutoSignup} = props;

  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup])

    return (
      <>
        <Layout>
          <Suspense 
            fallback={<p>Loading...</p>}
          >
            <Switch location={props.locationProp}>
              <Route path="/" exact component={BurgerBuilder} />
              <Route path='/signin' component={asyncSignIn} />
              <Route path='/signup' component={asyncSignUp} />
              <Route path="/checkout" component={asyncCheckout} />
              <PrivateRoute path='/orders' component={asyncOrders} />
              <PrivateRoute path="/logout" component={Logout} />
              <Route path="*">
                Page not found
              </Route>
            </Switch>
          </Suspense>
        </Layout>
      </>
    );

}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
