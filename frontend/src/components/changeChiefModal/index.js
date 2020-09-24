import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/auth.context'
import { ModalContext } from '../../context/modal.context'
import { useHttp } from '../../hooks/http.hook'

export default function ChangeChiefModal(props) {
    const {isModalVisible, modalContext, setModalVisibility, setModalContext} = useContext(ModalContext)
    const {loading, error, request} = useHttp()
    const [joinCode, setJoinCode] = useState('')
    const {token} = useContext(AuthContext)
    const [code, setCode] = useState('')

    const changeHandler = (e) => {
        setCode(e.target.value)
    }


    const submitHandler = async () => {
        try {
            console.log(code)
            const data = await request('/api/user/self', 'PATCH', {connectionCode: code}, {authorization: token, 'Content-Type': 'application/json'})
            setModalVisibility(false)
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        ;(async () => {
            try {
                const data = await request('/api/user/join', 'GET', null, {authorization: token})
                setJoinCode(data)
            } catch (e) {
                console.log(e)
            }

        })()
    }, [])

    return (
        <div className='modalWrapper' style={{display: isModalVisible ? 'flex' : 'none'}}>
            <div className='modal max-width-30'>
                <p>Чтобы присоединиться к команде уже зарегистрированного начальника введите код приглашения</p>
                <input onChange={changeHandler} onFocus={changeHandler}></input> <br/>
                <div className='errorbox'>{error}</div>
                <div className='ModalButtons'>
                    <button onClick={submitHandler}>Ок</button>
                    <button onClick={() => setModalVisibility(false)}>Отмена</button>
                </div>
                <p>Чтобы добавить подчиненного, передайте ему этот код:</p>
                <input value={joinCode}></input>
            </div>
        </div>
    )
}