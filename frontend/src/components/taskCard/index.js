import React, { useState } from 'react'
import './index.css'

export default function TaskCard(props) {
    const {task} = props
    if (!task) {
        return (
        <div className={`taskCard justify-center`}>
            <span className='plus'>+</span>
        </div>
        )
    }
    console.log(task)
    return (
        <div className={`taskCard`}>
            <div className='taskCardWrapper'>
                <h2>{task.title}</h2>
            </div>
            <span><b>from:</b> {task.sender}</span><br/>
            <span><b>to:</b> {task.receiver || 'nobody'}</span><br/>
            <p>{task.shortcut}</p>
        </div>
    )
}