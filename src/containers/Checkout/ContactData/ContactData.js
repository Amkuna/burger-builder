import React from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import WithErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../../store/actions/index';

import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers';

const schema = yup.object().shape({
    name: yup.string().required("This field is required"),
    street: yup.string().required("This field is required"),
    zipCode: yup.string().required("This field is required"),
    country: yup.string().required("This field is required"),
    email: yup.string().required("This field is required").email("Must be a valid email"),
    deliveryMethod: yup.string().required("This field is required")
});

const ContactData = (props) => {
    const {register, handleSubmit, errors} = useForm({
        resolver: yupResolver(schema),
    });

    const orderForm = {
        name: {
            elementType: 'input',
            name: "name",
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
        },
        street: {
            elementType: 'input',
            name: "street",
            elementConfig: {
                type: 'text',
                placeholder: 'Street'
            },
        },
        zipCode: {
            elementType: 'input',
            name: 'zipCode',
            elementConfig: {
                type: 'text',
                placeholder: 'ZIP'
            },
        },
        country: {
            elementType: 'input',
            name: 'country',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
        },
        email: {
            elementType: 'input',
            name: 'email',
            elementConfig: {
                type: 'email',
                placeholder: 'Email'
            },
        },
        deliveryMethod: {
            elementType: 'select',
            name: "deliveryMethod",
            elementConfig: {
                options: [
                    {value: 'fastest', displayValue: 'Fastest'},
                    {value: 'cheapest', displayValue: 'Cheapest'}
                ]
            },
            defaultValue: 'Fastest',
        }
    };

    const orderHandler = (formData) => {

        const order = {
            ingredients: props.ingredients,
            price: props.price,
            orderData: formData,
            userId: props.userId
        };

        props.onOrderBurger(order, props.token);
    }

    const formElementsArray = [];
    for(let key in orderForm) {
        formElementsArray.push({
            id: key,
            config: orderForm[key]
        })
    }

    let form = (
        <form onSubmit={handleSubmit(orderHandler)}>
            {formElementsArray.map(formElement => (
                <Input
                    key={formElement.id} 
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    name={formElement.config.name}

                    register={register}
                    error={errors[formElement.config.name]}
                />
            ))}
            <Button className={classes.Button} btnType='Success'>ORDER</Button>
        </form>
    );
    if(props.loading) {
        form = <Spinner />
    }
    return (
        <div className={classes.ContactData}>
            <h4 className={classes.Header}>Enter your Contact Data</h4>
            {form}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(ContactData, axios));