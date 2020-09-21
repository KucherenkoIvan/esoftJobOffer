import React, { useContext, useState} from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/auth.context';
import Loading from '../../components/loading'
import { useHttp } from '../../hooks/http.hook';
import './index.css'

export default function Login(props) {
    const {login} = useContext(AuthContext)
    const {loading, request, error} = useHttp()

    const [inputData, setInputData] = useState({email: '', password: ''})

    const changeHandler = (event) => {setInputData({...inputData, [event.target.name]: event.target.value})}

    //запрос отправляется по клику => useEffect не используется
    const loginClickHandler = async () => {
        try {
            console.log({...inputData})
            const {userID, token, errors} = await request('/api/auth/login', 'POST', {...inputData}, {'Content-Type': 'application/json'})
            login(token, userID, errors)
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <div className='loginWrapper'>
            <div className='loginInputs'>
                <div className='headerWrapper'>
                    <h2>Sign in</h2>
                </div>
                <input name='Login' onChange={changeHandler} placeholder='email' disabled={loading}/><br/>
                <input name='Password' type='password' onChange={changeHandler} placeholder='password' disabled={loading}/><br/>
                <div className='errorbox'>{error}</div>
                <div className='loginOptions'>
                    <button onClick={loginClickHandler} disabled={loading}>Login</button>
                    <Link to='/register'>Sign up</Link>
                </div>
            </div>
            <Loading visible={loading}/>
        </div>
    )
}