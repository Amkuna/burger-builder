import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import {withRouter} from 'react-router-dom';

const Burger = (props) => {
    //TODO Understand this
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map( (_, i) => {
                return <BurgerIngredient key={igKey + i} type={igKey} />
            })
        })
        .reduce((prevVal, currVal) => {
            return prevVal.concat(currVal)
        }, [])//initial value

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }
    
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

//with router gets the params of the nearest match
export default withRouter(Burger);