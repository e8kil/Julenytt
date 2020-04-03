import * as React from 'react'
import StoreWrapper from '../../StoreWrapper'
import Home from './Home'
import LoadWrapper from '../../LoadWrapper'
import Actions from '../StateManagement/Actions'
import { Store, StoreData } from '../StateManagement/Store'
import Header from '../Header/Header'

interface Props {

    actions: Actions
    store: Store
    loggedIn: boolean
    year: number
}

class HomePage extends React.Component<Props, {}> {


    componentDidMount() {
        this.props.actions.getPhotos(null)
        this.props.actions.getTextData()
    }

    render() {
        const renderHomes = (storeData: StoreData) => 
            <LoadWrapper statusList={[storeData.textData.status, storeData.photoList.status]}> 
                <Header year={this.props.year}></Header>
                <Home loggedIn={this.props.loggedIn} storeData={storeData} actions={this.props.actions} /> 
            </LoadWrapper>

        return <StoreWrapper<StoreData> store={this.props.store} render={renderHomes} />
    }


}

export default HomePage