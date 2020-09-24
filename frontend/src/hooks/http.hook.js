import React, {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const request = useCallback(async (url, method='GET', body=null, headers={}) => {
        try {
            setLoading(true)
            const serverResponse = await fetch(url, {method, body: body ? JSON.stringify(body) : null, headers})

            const data = await serverResponse.json()

            if (!serverResponse.ok) {
                throw new Error(data.errors?.[0].msg || 'Неопознанная ошибка')
            }

            setLoading(false)
            return data
        }
        catch(e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    return {loading, error, request}
}