import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false
};

const purchaseInit = (state, action) => {
    return updateObject(state, {purchased: false})
}

const purchaseBurgerSuccess = (state, action) => {
    const newOrder = updateObject(action.orderData, {id: action.id})
    return updateObject(state, {loading: false, purchased: true, orders: state.orders.concat(newOrder)})
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.PURCHASE_INIT:
            return purchaseInit(state, action)
            // return {
            //     ...state,
            //     purchased: false
            // }
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            return purchaseBurgerSuccess(state, action);
            // const newOrder = {
            //     ...action.orderData,
            //     id: action.id
            // }
            
            // return {
            //     ...state,
            //     loading: false,
            //     purchased: true,
            //     orders: state.orders.concat(newOrder)
            // }
        case actionTypes.PURCHASE_BURGER_FAIL:
            return updateObject(state, {loading: false})
            // return {
            //     ...state,
            //     loading: false
            // }
        case actionTypes.PURCHASE_BURGER_START:
            return updateObject(state, {loading: true})
            // return {
            //     ...state,
            //     loading: true
            // }
        case actionTypes.FETCH_ORDERS_START:
            return updateObject(state, {loading: true})
            // return {
            //     ...state,
            //     loading: true,
            // }
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return updateObject(state, {loading: false, orders: action.orders})
            // return {
            //     ...state,
            //     orders: action.orders,
            //     loading: false
            // }
        case actionTypes.FETCH_ORDERS_FAIL: 
            return updateObject(state, {loading: false})
            // return {
            //     ...state,
            //     loading: false,

            // }
        default:
            return state;
    }
}

export default reducer;