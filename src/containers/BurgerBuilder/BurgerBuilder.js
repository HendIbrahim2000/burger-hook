import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Auxel from '../../hoc/Auxel/Auxel';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

const BurgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false)

    useEffect(()=>{
        props.onInitIngredients();
    },[])

    const updatePurchaseState = ( ingredients ) => {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0;
    }

    const purchaseHandler = () => {
        if(props.isAuth) {
            setPurchasing(true)
        } else {
            props.setAuthenticatePath('/checkout')
            props.history.push('/auth')
        }
            
        
        
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        props.onInitPurchase();
        const { history } = props;
        history.push("/checkout")
    }

        const disabledInfo = {
            ...props.ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if ( props.ings ) {
            burger = (
                <Auxel>
                    <Burger ingredients={props.ings} />
                    <BuildControls
                        ingredientAdded={props.onIngredientAdded}
                        ingredientRemoved={props.onIngredientRemoved}
                        isAuth={props.isAuth}
                        disabled={disabledInfo}
                        purchasable={updatePurchaseState(props.ings)}
                        ordered={purchaseHandler}
                        price={props.price} />
                </Auxel>
            );
            orderSummary = <OrderSummary
                ingredients={props.ings}
                price={props.price}
                purchaseCancelled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler.bind(this)} />;
        }
        // {salad: true, meat: false, ...}
        return (
            <Auxel>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxel>
        );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuth: state.auth.token !== null,
        authPath: state.auth.setAuthPath
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        setAuthenticatePath: (path) => dispatch(actions.setAuthenticatePath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));