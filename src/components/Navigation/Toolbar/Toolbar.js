import React from 'react';
import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import LoadingBar from 'react-redux-loading-bar';

const Toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <LoadingBar showFastActions style={{
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: "#cf8f2e"

            }}/>
            <div className={classes.Navigation}>
                <DrawerToggle clicked={props.drawerToggleClicked} />
                <div className={classes.Logo}>
                    <Logo height='80%'/>
                </div>
                
                <nav className={classes.DesktopOnly}>
                    <NavigationItems isAuth={props.isAuth} />
                </nav>
            </div>

        </header>
    )
};

export default Toolbar;