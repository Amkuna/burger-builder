import React, {useState, useEffect, useCallback} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import * as actionCreators from '../../store/actions/burgerBuilder';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index';

export const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);
    const dispatch = useDispatch();

    const ingredients = useSelector(state => {
        return state.burgerBuilder.ingredients;
    })

    const totalPrice = useSelector(state => {
        return state.burgerBuilder.totalPrice;
    })

    const error = useSelector(state => {
        return state.burgerBuilder.error;
    })

    const isAuth = useSelector(state => {
        return state.auth.token !== null;
    })

    const onIngredientAdded = (ingredient) => dispatch(burgerBuilderActions.addIngredient(ingredient));
    const onIngredientRemoved = (ingredient) => dispatch(burgerBuilderActions.removeIngredient(ingredient));
    const onInitIngredients = useCallback(() => dispatch(burgerBuilderActions.initIngredients()), []);
    const onInitPurchase = () => dispatch(burgerBuilderActions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients])

    const updatePurchaseState = (updatedIngredients) => {
        const sum = Object.keys(updatedIngredients)
            .map(igKey => {
                return updatedIngredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        
        return sum > 0;
    }


    const purchaseHandler = () => {
        if(isAuth) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }

    const disabledInfo = {
        ingredients
    };

    for(let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;

    let burger = error? <p>Ingredients can't be loaded!</p>:<Spinner />;
    
    if(ingredients) {
        burger = (
            <>
                <Burger ingredients={ingredients}/>
                <BuildControls 
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    price={totalPrice}
                    purchasable={updatePurchaseState(ingredients)}
                    ordered={purchaseHandler}
                    isAuth={isAuth}
                />
            </>
        );

        orderSummary = (
            <OrderSummary ingredients={ingredients}
                            purchaseCancelled={purchaseCancelHandler}
                            purchaseContinued={purchaseContinueHandler}
                            price={totalPrice}
                        />
        );
    }

    return (
        <>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </>
    );
}

// const mapStateToProps = state => {
//     return {
//         ingredients: state.burgerBuilder.ingredients,
//         totalPrice: state.burgerBuilder.totalPrice,
//         error: state.burgerBuilder.error,
//         isAuth: state.auth.token !== null
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         onIngredientAdded: (ingredient) => dispatch(burgerBuilderActions.addIngredient(ingredient)),
//         onIngredientRemoved: (ingredient) => dispatch(burgerBuilderActions.removeIngredient(ingredient)),
//         onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
//         onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
//         onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path))
//     }
// }

export default WithErrorHandler(BurgerBuilder, axios);