

import * as React from 'react'
import { Redirect } from 'react-router-dom'
import Actions from '../StateManagement/Actions'
import { StoreData } from '../StateManagement/Store'

interface Props {
    storeData: StoreData
    actions: Actions
    loggedIn: boolean
}

function Admin(props: Props) {

    const [login, updateLogin] = React.useState({username: "", password: ""})
    return <div className="loginContainer">
                { props.loggedIn  && <Redirect to="/" /> }
                { !props.loggedIn && <h1>Logg inn</h1> }
                { !props.loggedIn && <input type="text" placeholder="Brukernavn" value={login.username} onChange={(e) => updateLogin({...login, username: e.target.value })} /> }
                { !props.loggedIn && <input type="password" placeholder="Passord" value={login.password} onChange={(e) => updateLogin({...login, password: e.target.value })} /> }
                { !props.loggedIn && <input type="submit" value="Logg inn" onClick={() => props.actions.logIn(login)}></input> }
            </div>

}

export default Admin