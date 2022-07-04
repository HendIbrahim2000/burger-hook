import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom'

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'

import * as actions from '../../store/actions/index'
import classes from './Auth.module.css'

const Auth = props => {

    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 7
            },
            valid: false,
            touched: false
        }
    })
    const [isSignUp, setIsSignUp] = useState(true)

    const checkValidity = (value, rules) => {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }
    const inputChangedHandler= (event, controlName) => {
        const controlUpdated = {
            ...controls,
            [controlName]: {
                ...controls[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true
            }
        }
        setControls(controlUpdated)
    }

    useEffect(() => {
        if (!props.building && props.authPath !== '/') {
            props.setAuthenticatePath()
        }
    },[])
    
    const SubmitHandle=(event) => {
        event.preventDefault()
        props.onAuth(controls.email.value, controls.password.value, isSignUp)

    }
    const switchAuthMoodHandler = (event) => {
        event.preventDefault()
        setIsSignUp(!isSignUp)
    }
        const formElementsArray = []
        for (let key in controls) {
            formElementsArray.push({
                id: key,
                config: controls[key]
            });
        }
        let redirectToMain = null
        if(props.isAuth) {
            redirectToMain = <Redirect to={props.authPath} />
        }
        let form = 
        (formElementsArray.map(formElement => (
            <Input 
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => inputChangedHandler(event, formElement.id)} />
        )))
        if(props.loading){
            form = <Spinner />
        }
        let errorMessage = null
        if(props.error) {
            errorMessage = (
                <p>{props.error.message}</p>
            ) 
        }
        
        return(
            <div className={classes.Auth}>
                {redirectToMain}
                {errorMessage}
            <form onSubmit={SubmitHandle}>
                {form}
                <Button btnType="Success">Submit</Button>
                <br />
                <Button
                clicked={switchAuthMoodHandler}
                btnType="Danger">Switch to {isSignUp? 'SIGNIN':'SIGNUP'}</Button>
            </form>
            </div>
        )
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token !== null,
        building: state.burgerBuilder.building,
        authPath: state.auth.setAuthPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        setAuthenticatePath: () => dispatch(actions.setAuthenticatePath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)