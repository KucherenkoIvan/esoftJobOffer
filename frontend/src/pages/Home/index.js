import React, { useContext, useEffect, useState } from 'react';
import Navigation from '../../components/navigation'
import { AuthContext } from '../../context/auth.context';
import TaskCard from '../../components/taskCard';
import Loading from '../../components/loading';
import { useHttp } from '../../hooks/http.hook';
import './index.css'
import CreateTaskModal from '../../components/createTaskModal';
import { ModalContext } from '../../context/modal.context';


export default function Home(props) {
    const {token} = useContext(AuthContext)
    const [data, setData] = useState(null)
    const {loading, request} = useHttp()     
    const [isModalVisible, setModalVisibility] = useState(false)
    const [modalContext, setModalContext] = useState(null)
    const [queryOption, setQueryOption] = useState('all')

    const getTasks = async () => {
        try {
            const items = await request(`/api/task?group=${queryOption}`, 'GET', undefined, {authorization: token})
            setData([...items])
        }
        catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {getTasks()}, [isModalVisible, queryOption])
    
    return (
        <div className='pageWrapper'>
            <Navigation/>
            <ModalContext.Provider value={{isModalVisible, setModalVisibility, modalContext, setModalContext}}>
                <div className='tasklist'>
                    <div className='toolBar'>
                        <button onClick={() => setModalVisibility(true)} disabled={loading} >+</button>
                        <select onChange={(e) => setQueryOption(e.target.value)}>
                            <option value='all'>Без группировок</option>
                            <option value='by_day'>На сегодня</option>
                            <option value='by_week'>На неделю</option>
                            <option value='by_ever'>На будущее</option>
                            <option value='by_subs'>По ответственным</option>
                        </select>
                        <button onClick={getTasks} disabled={loading} id='refresh'></button>
                    </div>
                    <div className='cardsContainer'>
                        {data?.map((item) => {
                            return item ? (<TaskCard key={item.id} task={item}>{item.title}</TaskCard>) : ''
                        })}
                    </div>
                </div>
                <Loading visible={loading}/>
                <CreateTaskModal/>
            </ModalContext.Provider>
        </div>
    )
}