import React, { useState, useCallback } from 'react'
import Axios from 'axios'


export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userID, setUserID] = useState(null)

    const login = useCallback((token, id) => {
        console.log('login: ', {token, id})
        setToken(token)
        setUserID(id)
    })
    const logout = useCallback(() => {
        token = undefined
        console.log(token)
    })
    return {login, logout, token, userID}
}