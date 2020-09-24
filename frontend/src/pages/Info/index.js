import React, { useEffect, useState, useContext } from 'react'
import ChangeChiefModal from '../../components/changeChiefModal'
import Loading from '../../components/loading'
import Navigation from '../../components/navigation'
import { AuthContext } from '../../context/auth.context'
import { ModalContext } from '../../context/modal.context'
import { useHttp } from '../../hooks/http.hook'
import './index.css'


export default function Info(props) {
    const {token, userID} = useContext(AuthContext)
    const {request, loading, error} = useHttp()
    const [currentUser, setCurrentUser] = useState(null)
    const [chiefData, setChiefData] = useState(null)
    const [isModalVisible, setModalVisibility] = useState(false)

    useEffect(() => {
        ;(async () => {
            try {
                const userData = await request(`./api/user/${userID}`, 'GET', null, {authorization: token})
                setCurrentUser(userData)

                if (userData.Chief) {
                    const chief = await request(`./api/user/${userData.Chief}`, 'GET', null, {authorization: token})
                    setChiefData(chief)
                }
            }
            catch (e) {
                console.error(e)
            }
        })()
    }, [isModalVisible])

    return (
        <>
            <Navigation/>
            <div className='pageWrapper justify-center'>

                <div className='userData'>
                    <span name='FirstName' id='FirstName'><b>Имя: </b> {currentUser?.FirstName}</span><br/>

                    <span name='Surname' id='Surname'><b>Фамилия: </b> {currentUser?.Surname}</span><br/>
                    
                    <span name='LastName' id='LastName'><b>Отчество: </b> {currentUser?.LastName || '-'}</span><br/>
                    
                    <span name='Login' id='Login'><b>Логин: </b> {currentUser?.Login}</span><br/>

                    <span name='Chief' id='Chief'><b>Начальник </b> {chiefData ? `${chiefData.FirstName} ${chiefData.Surname} (${chiefData.Login})` : '-'}</span><br/>
                    <button onClick={() => setModalVisibility(true)}>Изменить</button>
                </div>
                <Loading visible={loading}/>  
                <ModalContext.Provider value={{isModalVisible, setModalVisibility}}>
                    <ChangeChiefModal/>
                </ModalContext.Provider>
            </div>
        </>
    )
}