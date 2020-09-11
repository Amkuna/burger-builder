import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
    
    //Object of ingredients and amounts of them used
    const ingredients = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });

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
    const onInitIngredients = useCallback(() => dispatch(burgerBuilderActions.initIngredients()), [dispatch]);
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

    const disabledInfo = {...ingredients};

    //converts to an object of boolean ingredients, to check whether you can deduct ingredients
    for(let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = error? <p>Ingredients can't be loaded!</p>:<Spinner />;
    
    if(ingredients) {
        burger = (
            <div style={{display: "flex", height: "100%"}}>
                <BuildControls 
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    price={totalPrice}
                    purchasable={updatePurchaseState(ingredients)}
                    ordered={purchaseHandler}
                    isAuth={isAuth}
                />
                <Burger ingredients={ingredients}/>
            </div>
        );

        orderSummary = (
            <OrderSummary 
                ingredients={ingredients}
                purchaseCancelled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler}
                price={totalPrice}
            />
        );
    }

    return (
        <>
            {/* Show modal when in purchasing state */}
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>

            {burger}
        </>
    );
}

export default WithErrorHandler(BurgerBuilder, axios);