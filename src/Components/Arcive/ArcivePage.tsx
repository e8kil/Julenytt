import * as React from 'react'
import StoreWrapper from '../../StoreWrapper'
import LoadWrapper from '../../LoadWrapper'
import Actions from '../StateManagement/Actions'
import { Store, StoreData } from '../StateManagement/Store'
import Arcives from './Arcives'

interface Props {
    actions: Actions
    store: Store
    loggedIn: boolean
}

class ArcivePage extends React.Component<Props, {}> {


    componentDidMount() {
        this.props.actions.getPdfs(null)
    }

    render() {
        const renderHomes = (storeData: StoreData) =>
                <LoadWrapper statusList={[storeData.pdfList.status]}>
                <div className="pageContainer">
                    <Arcives loggedIn={this.props.loggedIn} pdfs={storeData.pdfList.data} actions={this.props.actions} />
                </div>
            </LoadWrapper>

        return <StoreWrapper<StoreData> store={this.props.store} render={renderHomes} />
    }


}

export default ArcivePage