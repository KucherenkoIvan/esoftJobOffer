import React, {useState, useContext} from 'react'
import { AuthContext } from '../../context/auth.context';
import { Link } from 'react-router-dom'
import Loading from '../../components/loading'
import { useHttp } from '../../hooks/http.hook';
import './index.css'


export default function Register(props) {
    
    const auth = useContext(AuthContext)
    const {loading, error, request} = useHttp()

    const [inputData, setInputData] = useState({})
    const [set, changeSet] = useState(true)

    const setChangeHandler = (e) => {
        if(!inputData.FirstName) {
            return 
        }
        else if (!inputData.Surname) {
            return 
        }
        e.target.blur()
        changeSet(!set)
    }

    const changeHandler = (event) => {
        setInputData({...inputData, [event.target.name]: event.target.value}
        )}

    const registerClickHandler = async () => {
        console.log('register!')
        try {
            const {userID, token} = await request('/api/auth/register', 'POST', {...inputData}, {'Content-Type': 'application/json'})
            auth.login(token, userID)
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <div 
            className='registerWrapper'
        >
            <Loading 
                visible={loading}
            />
            <div 
                className='registerInputs'
            >
                <div 
                    className='headerWrapper'
                >
                    <h2>Регистрация</h2>
                </div>


                <div 
                    className='setsWrapper'
                >
                    
                    <div
                        className={`formSet ${set ? 'visible' : 'invisible'}`}
                    >
                        <input 
                            name='Surname' 
                            placeholder='фамилия' 
                            onChange={changeHandler} 
                            disabled={loading}
                        /><br/>
                        <input 
                            name='FirstName' 
                            placeholder='имя'
                            onChange={changeHandler} 
                            disabled={loading}
                        /><br/>
                        <input 
                            name='LastName' 
                            placeholder='отчество' 
                            onChange={changeHandler} 
                            disabled={loading}
                        /><br/>
                        
                        
                        <div 
                            className='errorbox'
                        >
                            {error}
                        </div>
                  
                        <button 
                            onClick={setChangeHandler} 
                            disabled={!(inputData.FirstName && inputData.Surname)}
                        >
                            Далее
                        </button>
                    </div>

                    <div 
                        className={`formSet`}
                    >
                        <input 
                            name='Login' 
                            placeholder='логин' 
                            onChange={changeHandler} 
                            disabled={loading}
                        /><br/>
                        <input 
                            name='Password' 
                            type='password' 
                            placeholder='пароль'
                            onChange={changeHandler} 
                            disabled={loading}
                        /><br/>
                        <input 
                            name='confirmedPassword' 
                            type='password' 
                            placeholder='подтверждение пароля'
                            onChange={changeHandler} 
                            disabled={loading}
                        /><br/>
                        
                        
                        <div 
                            className='errorbox'
                        >
                            {error}
                        </div>

                        <button 
                            onClick={registerClickHandler} 
                            disabled={loading}
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                </div>
                <div 
                    className='registerOptions'
                >
                    <Link 
                        to='/login'
                    >
                        У меня уже есть аккаунт
                    </Link>
                </div>
            </div>
        </div>
    )
}