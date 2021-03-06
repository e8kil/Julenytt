import * as React from 'react'
import _ from 'lodash'
import TextContainer from './TextContainer'
import PhotoRow from './PhotoRow'
import Photos from '../Photos/Photos'
import Actions from '../StateManagement/Actions'
import { Photo, Store, StoreData } from '../StateManagement/Store'

interface Props {
    storeData: StoreData
    actions: Actions
    loggedIn: boolean
    edit: boolean
}

function Home(props: Props) {

    const textData = props.storeData.textData.data
    const photoData = props.storeData.photoList.data

    const getPhotosForRow = (row:number) => {
        let photos = photoData.filter((p:Photo) => p.imgPosition == row)
        return photos
    }

    return <div className="content">
        
        {textData[0].txt !== "" && <TextContainer actions={props.actions} loggedIn={props.loggedIn} edit={props.edit} text={textData[0]} storeData={props.storeData} ></TextContainer> }

        <Photos imagePosition={1} extraClass={"homePage"} actions={props.actions} loggedIn={props.loggedIn} edit={props.edit} photos={getPhotosForRow(1)} showThumbnails={true} autoplay={true}></Photos>

        {textData[1].txt !== "" && <TextContainer actions={props.actions} loggedIn={props.loggedIn} edit={props.edit} text={textData[1]} storeData={props.storeData}></TextContainer> }

        <Photos imagePosition={2}  extraClass={"homePage"} actions={props.actions} loggedIn={props.loggedIn} edit={props.edit} photos={getPhotosForRow(2)} showThumbnails={true} autoplay={true}></Photos>

        {textData[2].txt !== "" && <TextContainer actions={props.actions} loggedIn={props.loggedIn} edit={props.edit} text={textData[2]} storeData={props.storeData}></TextContainer> }

    </div>

}

export default Home