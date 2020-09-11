import React, {useEffect} from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Orders.module.css';

const Orders = (props) => {
    const {onFetchOrders} = props;

    useEffect(() => {
        onFetchOrders(props.token, props.userId);
    }, [onFetchOrders, props.token, props.userId])

    let orders = <Spinner />;
    console.log("Orders: ", props.orders);
    if(!props.loading) {
        orders = props.orders.length > 0 ? (
            <div>
                {props.orders.map(order => (
                    <Order key={order.id}
                        ingredients={order.ingredients}
                        price={order.price}
                    />
                ))}
            </div>
        ) : (
            <div className={classes.NoResults}>
                <h2>We've come up emtpy!</h2>
            </div>
        )
    }
    return orders;
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));