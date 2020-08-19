import React from 'react'
import classes from './NavigationItems.module.css'
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = (props) => {
    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link='/' exact>
                Burger Builder
            </NavigationItem>

            {props.isAuth?
            <>
                <NavigationItem link='/orders'>
                    Orders
                </NavigationItem>
                <NavigationItem link='/logout'>
                    Log Out
                </NavigationItem>
            </>
            :
            <>
                <NavigationItem link='/signin'>
                    Sign In
                </NavigationItem>
                <NavigationItem link='/signup'>
                    Sign Up
                </NavigationItem>
            </>
            }

        </ul>
    )
}

export default NavigationItems

