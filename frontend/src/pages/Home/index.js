import React, { useContext, useEffect, useState } from 'react';
import Navigation from '../../components/navigation'
import { AuthContext } from '../../context/auth.context';
import Axios from 'axios'
import TaskCard from '../../components/taskCard';
import './index.css'
import Loading from '../../components/loading';


export default function Home(props) {
    const {token, userID} = useContext(AuthContext)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    // useEffect(() => {
    //     console.log({token, userID})
    //     console.log(Axios.post('/api/task', {sender: userID, title: `test ${Date.now()}`, shortcut: `created by ${userID}`, deadline: Date.now()}, {headers: {authorization: token}}).then(res => {return res}))
    // }, [userID])        
    const getTasks = async () => {
        try {
            setLoading(true)
            const serverRespose = await Axios.get('/api/task', {headers: {authorization: token}})
            const items = await serverRespose.data
            setData([...items])
            setLoading(false) 
        }
        catch (e) {
            console.error(e)
            setLoading(false) 
        }
    }
    useEffect(() => {getTasks()}, [])
    return (
        <div className='pageWrapper'>
            <Navigation/>
            <div className='tasklist'>
                <div className='toolBar'>
                    <button onClick={getTasks} disabled={loading} id='refresh'></button>
                </div>
                <div className='cardsContainer'>
                    {data.map((item) => {
                        return (<TaskCard key={JSON.stringify(item)} task={item}>{item.title}</TaskCard>)
                    })}
                    <TaskCard>
                        
                    </TaskCard>
                </div>
            </div>
            <Loading visible={loading}/>
        </div>
    )
}