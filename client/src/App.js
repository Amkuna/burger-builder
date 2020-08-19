import React, {useEffect, Suspense} from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

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


    let routes = (
        <>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path='/signin' component={asyncSignIn} />
          <Route path='/signup' component={asyncSignUp} />
          <Redirect to="/" />
        </>
    )

    if(props.isAuth) {
      routes = (
        <>
          <Route path="/" exact component={BurgerBuilder} />
          {/* <Route path='/auth' component={asyncAuth} /> */}
          <Route path="/checkout" component={asyncCheckout} />
          <Route path='/orders' component={asyncOrders} />
          <Route path="/logout" component={Logout} />
          <Redirect to="/" />
        </>
      )
    }

    return (
      <>
        <Layout>
          <Switch>
            <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
          </Switch>
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
