import React, {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const request = useCallback(async (url, method='GET', body=null, headers={}) => {
        try {
            setLoading(true)
            console.log({method, body, headers})
            const serverResponse = await fetch(url, {method, body: JSON.stringify(body), headers})
            console.log({serverResponse})

            const data = await serverResponse.json()
            console.log({data})

            if (!serverResponse.ok) {
                throw new Error(data.errors[0].msg || 'Неопознанная ошибка')
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