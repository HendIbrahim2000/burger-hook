import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom'

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'

import * as actions from '../../store/actions/index'
import classes from './Auth.module.css'

class Auth extends Component {
    state = {
        controls: {
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
        },
        isSignUp: true
    }
    checkValidity(value, rules) {
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
    inputChangedHandler= (event, controlName) => {
        const controlUpdated = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        }
        this.setState({ controls: controlUpdated })
    }

    componentDidMount () {
        if (!this.props.building && this.props.authPath !== '/') {
            this.props.setAuthenticatePath()
        }
    }
    
    SubmitHandle=(event) => {
        event.preventDefault()
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)

    }
    switchAuthMoodHandler = (event) => {
        event.preventDefault()
        this.setState( prevState => {
            return{isSignUp: !prevState.isSignUp}
        })
    }
    render(){
        const formElementsArray = []
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }
        let redirectToMain = null
        if(this.props.isAuth) {
            redirectToMain = <Redirect to={this.props.authPath} />
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
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        )))
        if(this.props.loading){
            form = <Spinner />
        }
        let errorMessage = null
        if(this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            ) 
        }
        
        return(
            <div className={classes.Auth}>
                {redirectToMain}
                {errorMessage}
            <form onSubmit={this.SubmitHandle}>
                {form}
                <Button btnType="Success">Submit</Button>
                <br />
                <Button
                clicked={this.switchAuthMoodHandler}
                btnType="Danger">Switch to {this.state.isSignUp? 'SIGNIN':'SIGNUP'}</Button>
            </form>
            </div>
        )
    }
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