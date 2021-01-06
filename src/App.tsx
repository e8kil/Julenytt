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
import "./style/400px.scss"
import "./style/snow.scss"
import Messages from "./Messages"
import Header from "./Components/Header/Header"
import { Store } from "./Components/StateManagement/Store"
import Actions from "./Components/StateManagement/Actions"
import Requests from "./Components/StateManagement/Requests"
import HomePage from "./Components/Home/HomePage"
import AdminPage from "./Components/Admin/AdminPage"
import PhotosPage from "./Components/Photos/PhotosPage"
import ArcivePage from "./Components/Arcive/ArcivePage"

interface Props {
}

interface State {
  successMessage: string,
  errorMessage: string,
  loggedIn: boolean,
  editMode: boolean
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
      loggedIn: false,
      editMode: true
    }

    this.setErrorMessage = this.setErrorMessage.bind(this)
    this.setSuccessMessage = this.setSuccessMessage.bind(this)
    this.setLoggedInStatus = this.setLoggedInStatus.bind(this)
    this.setEditMode = this.setEditMode.bind(this)


    this.store = new Store()
    this.requests = new Requests()
    this.actions = new Actions(this.requests, this.store, this.setErrorMessage, this.setSuccessMessage, this.setLoggedInStatus, this.setEditMode)

  }

  componentDidMount() {
    this.actions.loggedIn()
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

  setEditMode() {
    this.setState({editMode: !this.state.editMode})
  }

  getJulenyttYear() {
    var d = new Date()
    var year = d.getFullYear()
    var month = d.getMonth()

    if (month == 11) {
      return year
    } else {
      return year - 1
    }
  }
  
  getCurrentYear = () => {
    var d = new Date()
    return d.getFullYear()
}
  
  render() {
    return (
      <Router>
        <div className="julenytt">
          <nav className="julenytt-menu">
            <NavLink className="julenytt-menu-item" activeClassName="menu-item-active" exact to="/">Julenytt {this.getJulenyttYear()}</NavLink> 
            <NavLink className="julenytt-menu-item" activeClassName="menu-item-active" exact to="/Bilder">{this.getJulenyttYear()} i Bilete</NavLink> 
            <NavLink className="julenytt-menu-item" activeClassName="menu-item-active" exact to="/Arkiv">Arkiv</NavLink> 
          </nav>

          <Messages successMessage={this.state.successMessage} errorMessage={this.state.errorMessage} />
          <Switch>
            <Route path="/" exact>
              <HomePage 
                actions={this.actions }
                store={this.store}
                edit={this.state.editMode}
                loggedIn={this.state.loggedIn}
                />
            </Route>  

            <Route path="/Bilder" exact>
              <PhotosPage
                actions={this.actions}
                store={this.store}
                edit={this.state.editMode}
                loggedIn={this.state.loggedIn}
                />
            </Route>

            <Route path="/Arkiv" exact>
              <ArcivePage
                actions={this.actions}
                store={this.store}
                edit={this.state.editMode}
                loggedIn={this.state.loggedIn}
                />
            </Route>                                 

            <Route path="/admin" exact>
              <AdminPage 
                actions={this.actions}
                store={this.store}
                loggedIn={this.state.loggedIn}
                />
            </Route>                                                 
          </Switch>

        {this.state.loggedIn && 
          <div className="editButton">
            { (this.state.loggedIn && this.state.editMode) &&
              <input type="save" onClick={() => this.actions.toogleEditMode()}  value="Lukk redigering" />
            }
            { (this.state.loggedIn && !this.state.editMode) &&
                <input type="save" onClick={() => this.actions.toogleEditMode()}  value="Åpne redigering" />
            }
          </div>
        }

          <div className="footer">
            © {this.getCurrentYear()} - Klepaker
          </div>
        </div>
      </Router>
    )
  }
}