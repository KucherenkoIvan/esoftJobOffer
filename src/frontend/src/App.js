import {BrowserRouter as Router, Route} from 'react-router-dom'
import React, { useState, useContext } from 'react'
import logo from './logo.svg'
import './App.css'
import {Routes} from './pages/Routes'
import {useAuth} from './hooks/auth.hook'
import { AuthContext } from './context/auth.context';

import Login from './pages/Login'



export default function App(props) {
  const {login, logout, token, userID} = useAuth()
  const isAuthenticated = !!token
  return (
    <AuthContext.Provider value={{login, logout, token, userID, isAuthenticated}}>
      <Router>
        <Routes/>
      </Router>          
    </AuthContext.Provider>
  )
}
