import React, { useContext } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Login from '../Login'
import Home from '../Home'
import Placeholder from '../../components/placeholder'
import Register from '../Register'
import { AuthContext } from '../../context/auth.context';
import Info from '../Info'

export function Routes(props) {
    const {isAuthenticated} = useContext(AuthContext)
    if (isAuthenticated) {
        return (    
            <Switch>
                <Route path={'/home'} exact>
                    <Home/>
                </Route>
                <Route path={'/info'} exact>
                    <Info/>
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
            <Redirect to={'/login'}/>
        </Switch>
    )
}