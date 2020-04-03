import * as React from "react"
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink,
  useHistory, 
  Redirect
} from "react-router-dom"
import "./style/main.scss"
import "./style/loader.scss"
import "./style/900px.scss"
import "./style/600px.scss"
import "./style/snow.scss"
import Messages from "./Messages"
// import HomePage from "./Components/Home/HomePage"
// import HomeRequests from "./Components/Home/HomeRequests"
// import AdminRequests from "./Components/Admin/AdminRequests"
// import AdminPage from "./Components/Admin/AdminPage"
import Header from "./Components/Header/Header"
import { Store } from "./Components/StateManagement/Store"
import Actions from "./Components/StateManagement/Actions"
import Requests from "./Components/StateManagement/Requests"
import HomePage from "./Components/Home/HomePage"
import AdminPage from "./Components/Admin/AdminPage"
import PhotosPage from "./Components/Photos/PhotosPage"
import ArcivePage from "./Components/Arcive/ArcivePage"
// import PhotosRequests from "./Components/Photos/PhotosRequests"
// import { PhotosStore } from "./Components/Photos/PhotosStore"
// import PhotosActions from "./Components/Photos/PhotosActions"
// import PhotosPage from "./Photos/PhotosPage"
// import ArcivePage from "./Arcive/ArcivePage"


interface Props {
}

interface State {
  successMessage: string,
  errorMessage: string,
  loggedIn: boolean
}

export default class App extends React.Component<Props, State> {

  private requests: Requests
  private store: Store
  private actions: Actions

  constructor (props:Props) {
    super(props)
    this.state = {
      successMessage: "", 
      errorMessage: "", 
      loggedIn: false
    }

    this.setErrorMessage = this.setErrorMessage.bind(this)
    this.setSuccessMessage = this.setSuccessMessage.bind(this)

    this.store = new Store()
    this.requests = new Requests()
    this.actions = new Actions(this.requests, this.store, this.setErrorMessage, this.setSuccessMessage, (loggedIn: boolean) => this.setLoggedInStatus(loggedIn))

  }

  setSuccessMessage(message:string) {
    this.setState({successMessage: message})
    setTimeout(() => {
      this.setState({successMessage: ""})
    }, 2000)
  }

  setErrorMessage(message:string) {
    this.setState({errorMessage: message})
    setTimeout(() => {
      this.setState({ errorMessage: "" })
    }, 2000)    
  }

  setLoggedInStatus(loggedIn: boolean) {
    this.setState({loggedIn: loggedIn})
  }

  getYear() {
    var d = new Date()
    var year = d.getFullYear()
    var month = d.getMonth()

    if (month == 12) {
      return year
    } else {
      return year - 1
    }
  }
  

  
  render() {
 
    return (
      <Router>
        <div className="julenytt">
          <nav className="julenytt-menu">
            <NavLink className="julenytt-menu-item" activeClassName="menu-item-active" exact to="/">Julenytt {this.getYear()}</NavLink> 
            <NavLink className="julenytt-menu-item" activeClassName="menu-item-active" exact to="/Photos">{this.getYear()} i Bilete</NavLink> 
            <NavLink className="julenytt-menu-item" activeClassName="menu-item-active" exact to="/Arcive">Arkiv</NavLink> 

            {/* <NavLink activeClassName="active" to="/Photos">Bilder</NavLink> <span className="xadmin-menu-seperator">|</span> 
            <NavLink activeClassName="active" to="/Arcive">Arkiv</NavLink> <span className="xadmin-menu-seperator">|</span>  */}

          </nav>

          <Messages successMessage={this.state.successMessage} errorMessage={this.state.errorMessage} />
          <Switch>
            <Route path="/" exact>
              <HomePage 
                actions={this.actions }
                store={this.store}
                loggedIn={this.state.loggedIn} 
                year={this.getYear()}/>
            </Route>  

            <Route path="/Photos" exact>
              <PhotosPage
                actions={this.actions}
                store={this.store}
                loggedIn={this.state.loggedIn} />
            </Route>

            <Route path="/Arcive" exact>
              <ArcivePage
                actions={this.actions}
                store={this.store}
                loggedIn={this.state.loggedIn} />
            </Route>                                 

            <Route path="/admin" exact>
              <AdminPage 
                actions={this.actions}
                store={this.store}/>
            </Route> 

            {/* <Route path="/Photos" exact>
              <PhotosPage setSuccessMessage={this.setSuccessMessage} setErrorMessage={this.setErrorMessage} />
            </Route>  
            <Route path="/Photos" exact>
              <ArcivePage setSuccessMessage={this.setSuccessMessage} setErrorMessage={this.setErrorMessage} />
            </Route>  */}
                                                            
          </Switch>
        </div>
      </Router>
    )
  }
}