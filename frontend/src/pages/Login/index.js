import React, { useContext, useState} from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/auth.context';
import Loading from '../../components/loading'
import { useHttp } from '../../hooks/http.hook';
import './index.css'

export default function Login(props) {
    const {login} = useContext(AuthContext)
    const {loading, request, error} = useHttp()

    const [inputData, setInputData] = useState({})

    const changeHandler = (event) => {setInputData({...inputData, [event.target.name]: event.target.value})}

    //запрос отправляется по клику => useEffect не используется
    const loginClickHandler = async () => {
        try {
            const {userID, token} = await request('/api/auth/login', 'POST', {...inputData}, {'Content-Type': 'application/json'})
            login(token, userID)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className='loginWrapper'>
            <div className='loginInputs'>
                <div className='headerWrapper'>
                    <h2>Вход</h2>
                </div>
                <input name='Login' onChange={changeHandler} placeholder='логин' disabled={loading}/><br/>
                <input name='Password' type='password' onChange={changeHandler} placeholder='пароль' disabled={loading}/><br/>
                <div className='errorbox'>{error}</div>
                <div className='loginOptions'>
                    <button onClick={loginClickHandler} disabled={loading}>Войти</button>
                    <Link to='/register'>Регистрация</Link>
                </div>
            </div>
            <Loading visible={loading}/>
        </div>
    )
}