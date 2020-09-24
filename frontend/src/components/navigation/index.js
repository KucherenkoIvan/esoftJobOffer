import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import { AuthContext } from '../../context/auth.context'
import './index.css'

export default function Navigation(props) {
    const {logout} = useContext(AuthContext)
    return (
        <nav className='navigation'>
            <Link to={'/home'}>Список задач</Link>
            <Link to={'/info'}>Информация</Link>
            <Link onClick={logout}>Выход</Link>
        </nav>
    )
}