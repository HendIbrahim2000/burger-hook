import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const initialState = {
    token: null,
    userID: null,
    error:null,
    loading: false,
    setAuthPath: '/'
}

const authStart = (state, action) => {
    return updateObject( state, {error: null, loading: true } )
}
const authSuccess = (state, action) => {
    return updateObject( state, 
        {
        token: action.idToken,
        userID: action.localId,
        error:null,
        loading: false 
        
    } )
}

const authFail = (state, action) => {
    return updateObject( state, {error: action.error, loading: false } )
} 

const authLogout = (state, action) => {
    return updateObject( state, {token: null, userID: null } )
} 

const setAuthenticatePath = (state, action) => {
    return updateObject( state, {setAuthPath: action.path } )
} 

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTHENTICATE_PATH: return setAuthenticatePath(state, action);
        default: return state
    }
}

export default reducer