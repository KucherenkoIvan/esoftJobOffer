import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/auth.context'
import { ModalContext } from '../../context/modal.context'
import { useHttp } from '../../hooks/http.hook'
import './index.css'

export default function TaskCard(props) {

    const {task} = props
    const {request} = useHttp()
    const {setModalVisibility, setModalContext} = useContext(ModalContext)
    const {token} = useContext(AuthContext)
    const [receiverData, setReceicverData] = useState({})
    const [headerClass, setHeaderClass] = useState('grey-text')


    // получение данных об ответственном
    useEffect(() => {
        if (task.Status === 'выполнена') {
            setHeaderClass('green-text')
        }
        else if (new Date(task.Deadline) < new Date()) {
            setHeaderClass('red-text')
        }
        ;(async () => {
            try {
                const data = await request(`/api/user/${task.Receiver}`, 'GET', null, {authorization: token})
                setReceicverData(data)
            }
            catch(e) {
                console.log(e)
            }
        })()
    }, [props])


    // верстка
    return (
        <div className={`taskCard`} onClick={() => {setModalContext(task); setModalVisibility(true)}}>
            <div className='taskCardWrapper'>
                <h2 className={headerClass}>{task.Title}</h2>
            </div>
            <span><b>Ответственный:</b> {`${receiverData.FirstName || ''} ${receiverData.Surname || ''} (${receiverData.Login || 'Загрузка...'})`}</span><br/>
            <span><b>Приоритет:</b> {task.Priority}</span><br/>
            <span><b>Срок сдачи:</b> {new Date(task.Deadline).toDateString()}</span><br/>
            <span><b>Статус:</b> {task.Status}</span><br/>
            
        </div>
    )
}