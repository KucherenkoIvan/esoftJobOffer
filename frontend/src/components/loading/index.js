import React from 'react'
import './index.css'


export default function Loading(props) {
    const {visible} = props
    return (
        <div className='loading' style={{display: visible ? 'block' : 'none'}}>
            <img className='loadingImage' src='https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'/*'https://www.flaticon.com/svg/static/icons/svg/283/283437.svg'*//>
        </div>
    )
}