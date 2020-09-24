import {createContext} from 'react'

const callbackPlaceholder = () => {}

export const AuthContext = createContext({
    isAuthenticated: false,
    token: null,
    userID: null,
    login: callbackPlaceholder,
    logout: callbackPlaceholder
})