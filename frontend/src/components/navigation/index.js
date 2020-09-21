import React from 'react'
import {Link} from 'react-router-dom'
import './index.css'

export default function Navigation(props) {
    return (
        <nav className='navigation'>
            <Link to={'/test'}>Test</Link>
            <Link to={'/home'}>Home</Link>
            <Link to={'/settings'} id='settings'>Settings</Link>
        </nav>
    )
}