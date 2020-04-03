import * as React from 'react'
import Admin from './Admin'
import StoreWrapper from '../../StoreWrapper'
import Actions from '../StateManagement/Actions'
import { Store, StoreData } from '../StateManagement/Store'

interface Props {
    actions: Actions
    store: Store
}

class AdminPage extends React.Component<Props, {}> {
    render() {
        const renderHomes = (storeData: StoreData) => <Admin storeData={storeData} actions={this.props.actions} />
        return <StoreWrapper<StoreData> store={this.props.store} render={renderHomes} />
    }
}

export default AdminPage