import * as React from 'react'
import StoreWrapper from '../../StoreWrapper'
import Home from './Home'
import LoadWrapper from '../../LoadWrapper'
import Actions from '../StateManagement/Actions'
import { Store, StoreData } from '../StateManagement/Store'
import Header from '../Header/Header'
import { Redirect } from 'react-router-dom'

interface Props {

    actions: Actions
    store: Store
    edit: boolean
    loggedIn: boolean
}

class HomePage extends React.Component<Props, {}> {


    componentDidMount() {
        this.props.actions.getPhotos(null)
        this.props.actions.getTextData(0)
    }

    getYear() {
        var d = new Date()
        var year = d.getFullYear()
        var month = d.getMonth()
    
        if (month == 11) {
          return year
        } else {
          return year - 1
        }
    }

    render() {
        const renderHomes = (storeData: StoreData) => 
            <>
                <Header year={this.getYear()}></Header>
                <LoadWrapper statusList={[storeData.textData.status, storeData.photoList.status]}> 
                    <Home loggedIn={this.props.loggedIn} edit={this.props.edit} storeData={storeData} actions={this.props.actions} /> 
                </LoadWrapper>
            </>

        return <StoreWrapper<StoreData> store={this.props.store} render={renderHomes} />
    }


}

export default HomePage