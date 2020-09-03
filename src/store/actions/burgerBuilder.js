import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (ingredient) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredient
    }
}

export const removeIngredient = (ingredient) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredient
    }
}

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients
    }
}

export const fetchIngredientsFail = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAIL
    }
}

export const initIngredients = () => async dispatch => {
    try {
        const res = await axios.get("https://react-my-burger-e6262.firebaseio.com/ingredients.json")
        dispatch(setIngredients(res.data));
    } catch (error) {
        dispatch(fetchIngredientsFail());
    }
}