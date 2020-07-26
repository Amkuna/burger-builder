import React, {useState} from 'react';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

const Layout = props => {
    const [showSideDrawer, setShowSideDrawer] = useState(false);

    const sideDrawerClosedHandler = () => {
        setShowSideDrawer(false);
    }

    const sideDrawerToggleHandler = () => {
        setShowSideDrawer(!showSideDrawer);
    }

    return (
        <>
            <Toolbar isAuth={props.isAuth} drawerToggleClicked={sideDrawerToggleHandler}/>
            <SideDrawer isAuth={props.isAuth} closed={sideDrawerClosedHandler} show={showSideDrawer}/>
            <main className={classes.Content}>
                {props.children}
            </main>
        </>
    )
};

const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);