import React, {useEffect, Suspense} from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Auth from './containers/Auth/Auth';

// const asyncCheckout = asyncComponent(() => {
//   return import('./containers/Checkout/Checkout');
// })
//React 16.8; Suspense???
const asyncCheckout = React.lazy((() => {
  return import('./containers/Checkout/Checkout');
}))

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
})

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
})

const App = (props) => {

  const {onTryAutoSignup} = props;

  useEffect(() => {
    onTryAutoSignup();
  }, [])


    let routes = (
        <>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path='/auth' component={Auth} />
          <Redirect to="/" />
        </>
    )

    if(props.isAuth) {
      routes = (
        <>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path='/auth' component={asyncAuth} />
          <Route path="/checkout" render={() => <asyncCheckout />} />
          <Route path='/orders' component={asyncOrders} />
          <Route path="/logout" component={Logout} />
          <Redirect to="/" />
        </>
      )
    }

    return (
      <div >
        <Layout>
          <Switch>
            <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
          </Switch>
        </Layout>
      </div>
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
