import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, localId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        localId: localId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const authLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('localId')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkLogTime = (logTime) => {
    return dispatch => {
        setTimeout(()=>{
            dispatch(authLogout())
            
        }, logTime * 1000)
    }
    
}

export const auth = (email, password, isSignUp) => {
    return dispatch  => {
            dispatch(authStart()) ;
            const authData = {
                email: email,
                password: password,
                returnSecureToken: true
            }
            let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCKwoCHSy6oyOHXE3cahnyACka2dTxduak'
            if (!isSignUp) {
                url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCKwoCHSy6oyOHXE3cahnyACka2dTxduak'
            }
            axios.post(url, authData )
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)
                localStorage.setItem('token', response.data.idToken)
                localStorage.setItem('expirationDate', expirationDate)
                localStorage.setItem('localId', response.data.localId)
                dispatch(authSuccess(response.data.idToken, response.data.localId))
                dispatch(checkLogTime(response.data.expiresIn))
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error))
            })
    }
}

export const setAuthenticatePath = (path) => {
    return{
        type: actionTypes.SET_AUTHENTICATE_PATH,
        path: path
    }
}

export const checkExpiration = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const localId = localStorage.getItem('localId');
        if(!token) {
            dispatch(authLogout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if(expirationDate <= new Date()) {
                dispatch(authLogout())
            } else {
                dispatch(authSuccess(token, localId))
                dispatch(checkLogTime((expirationDate.getTime() - new Date().getTime()) / 1000))
            }
        }
    }
}