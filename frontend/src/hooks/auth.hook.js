import React, { useState, useCallback } from 'react'


export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userID, setUserID] = useState(null)

    const login = useCallback((token, id) => {
        setToken(token)
        setUserID(id)
    })
    const logout = useCallback(() => {
        setToken(undefined)
        setUserID(undefined)
    })
    return {login, logout, token, userID}
}