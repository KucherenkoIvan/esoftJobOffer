import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/auth.context'
import { ModalContext } from '../../context/modal.context'
import { useHttp } from '../../hooks/http.hook'
import './index.css'

export default function CreateTaskModal(props) {

    const {isModalVisible, setModalVisibility, modalContext, setModalContext} = useContext(ModalContext)
    const {request, error, loading} = useHttp()
    const {token, userID} = useContext(AuthContext)
    const statusOptions =  ['к выполнению', 'выполняется', 'выполнена', 'отменена']
    const priorityOptions = ['низкий', 'средний', 'высокий']
    const [receiverOptions, setReceiverOptions] = useState([])
    const [inputData, setInputData] = useState({})


    // получаем список подчиненных
    useEffect(() => {
        ;(async () => {
            try {
                const data = await request('/api/user/subordinates', 'GET', null, {authorization: token})
                setReceiverOptions(data)
                setModalContext(null)
            }
            catch (e) {
                console.warn("can't load subordinates data", e)
            }
        })()
    }, [])

    // приводим дату дедлайна к нужному формату
    useEffect(() => {
        const addZero = (t) => {
            if (t.toString().length == 1)
                return `0${t}`
            return t
        }
        let date = new Date(modalContext?.Deadline)
        let dateString = `${date.getFullYear()}-${addZero(date.getMonth())}-${addZero(date.getDate())}T${addZero(date.getHours())}:${addZero(date.getMinutes())}`
        setInputData({...modalContext, Deadline:dateString})       
    }, [modalContext])

    // функция "уборки" перед закрытием
    const cleanup = () => {
        setModalContext(null)
        setInputData({})
        setModalVisibility(false)
    }

    // обработка create_Click
    const createTaskHandler = async () => {
        try {
            const data = await request('/api/task', 'POST', {...inputData}, {authorization: token, 'Content-Type': 'application/json'})
            cleanup()
        }
        catch (e) {
            console.warn(e)
        }
    }

    // обработка update_Click
    const updateTaskHandler = async () => {
        try {
            const data = await request('/api/task', 'PATCH', {...inputData}, {authorization: token, 'Content-Type': 'application/json'})
            cleanup()
        }
        catch (e) {
            console.warn(e)
        }
    }


    // обработка изменений input'ов
    const changeHandler = (e) => {
        setInputData({...inputData, [e.target.name]: e.target.value})
    }


    // верстка
    return (
        <div className='modalWrapper' style={{display: isModalVisible ? 'flex' : 'none'}}>
            <div className='modal'>
                <h2>{modalContext ? 'Редактирование' : 'Создание'}</h2>
                <div className='errorbox'>{error}</div>
                <label htmlFor='Title'>Заголовок:*</label>
                <input
                    name='Title'
                    placeholder='title'
                    onChange={changeHandler}
                    value={inputData?.Title || ''}
                    disabled={!!modalContext && (modalContext?.Sender !== userID)}
                /><br/>

                <label htmlFor='Shortcut'>Описание:</label>
                <textarea
                    name='Shortcut'
                    placeholder='shortcut'
                    onChange={changeHandler}
                    value={inputData?.Shortcut || ''}
                    disabled={!!modalContext && (modalContext?.Sender !== userID)}
                    /><br/>

                <label htmlFor='Deadline'>Срок сдачи:*</label>
                <input
                    name='Deadline'
                    type='datetime-local'
                    value={inputData?.Deadline}
                    onChange={changeHandler}
                    disabled={!!modalContext && (modalContext?.Sender !== userID)}
                    /><br/>
                
                <label htmlFor='Priority'>Приоритет:*</label>
                <select
                    name='Priority'
                    onChange={changeHandler}
                    value={inputData?.Priority || ''}
                    disabled={!!modalContext && (modalContext?.Sender !== userID)}
                >
                    <option key={null}></option>
                    {priorityOptions.map((item) => {
                        return (<option value={item} key={item}>{item}</option>)
                    })}                    
                </select><br/>
                
                <label htmlFor='Status'>Статус:*</label>
                <select
                    name='Status'
                    onChange={changeHandler}
                    value={inputData?.Status || ''}
                >
                    <option ket={null}></option>
                    {statusOptions.map((item) => {
                        return (<option value={item} key={item}>{item}</option>)
                    })}                    
                </select><br/>
                
                
                <label htmlFor='Receiver'>Ответственный:*</label>
                <select
                    name='Receiver'
                    onChange={changeHandler}
                    value={inputData?.Receiver || ''}
                    disabled={!!modalContext && (modalContext?.Sender !== userID)}
                >
                    <option key={null}></option>
                    {receiverOptions.map((item) => {
                        return (<option value={item.id} key={item.id}>{`${item.FirstName} ${item.Surname} (${item.Login})`}</option>)
                    })}                    
                </select><br/>
                <div className={'ModalButtons'}>
                    <button onClick={modalContext ? updateTaskHandler : createTaskHandler}>Ок</button>
                    <button onClick={cleanup}>Отмена</button>
                </div>
            </div>
        </div>
    )
}