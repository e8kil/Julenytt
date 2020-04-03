import * as React from 'react'
import StoreWrapper from '../../StoreWrapper'
import LoadWrapper from '../../LoadWrapper'
import Actions from '../StateManagement/Actions'
import { Store, StoreData } from '../StateManagement/Store'
import Photos from './Photos'

interface Props {

    actions: Actions
    store: Store
    loggedIn: boolean
}

class PhotosPage extends React.Component<Props, {}> {


    componentDidMount() {
        this.props.actions.getPhotos(null)
    }

    render() {
        const renderHomes = (storeData: StoreData) =>
            <LoadWrapper statusList={[storeData.photoList.status]}>
                <div className="pageContainer">
                    <Photos imagePosition={3} extraClass={"photosPage"} loggedIn={this.props.loggedIn} photos={storeData.photoList.data} actions={this.props.actions} showThumbnails={true} autoplay={false} />
                </div>
            </LoadWrapper>

        return <StoreWrapper<StoreData> store={this.props.store} render={renderHomes} />
    }


}

export default PhotosPage