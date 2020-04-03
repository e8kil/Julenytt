import * as React from 'react'
import { Photo } from '../StateManagement/Store'
import Gallery from './Gallery'
import EditPhotos from './EditPhotos'

interface Props {
    photos: Photo[],
    showThumbnails: boolean
    autoplay: boolean
    loggedIn: boolean
    actions: any
    extraClass: string
    imagePosition: number
}

function Photos(props: Props) {

    return <div>
        {!props.loggedIn && <Gallery extraClass={props.extraClass} photos={props.photos} showThumbnails={props.showThumbnails} autoPlay={props.autoplay}></Gallery>}
        {props.loggedIn && <EditPhotos imagePosition={props.imagePosition} actions={props.actions} photos={props.photos}></EditPhotos>}
    </div >

}

export default Photos