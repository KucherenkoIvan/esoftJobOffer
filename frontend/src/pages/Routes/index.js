import React, { useContext } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Login from '../Login'
import Home from '../Home'
import Placeholder from '../../components/placeholder'
import Register from '../Register'
import { AuthContext } from '../../context/auth.context';

export function Routes(props) {
    // //setInterval(() => {console.log('router:', isAuthenticated)}, 1000)
    // const {login, logout, token, userID} = useContext(AuthContext)
    // console.log('routes: ', login, logout, token, userID)
    const {isAuthenticated} = useContext(AuthContext)
    if (isAuthenticated) {
        return (    
            <Switch>
                <Route path={'/home'} exact>
                    <Home/>
                </Route>
                <Route path={'/test'} exact>
                    <Placeholder/>
                </Route>          
                <Redirect to={'/home'}/>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path={'/register'} exact>
                <Register/>
            </Route>
            <Route path={'/login'} exact>
                    <Login/>
            </Route>                
            <Redirect to={'/register'}/>
        </Switch>
    )
}