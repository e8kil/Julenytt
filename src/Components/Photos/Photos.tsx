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
    edit: boolean
}

function Photos(props: Props) {

    return <div>
        {(!props.loggedIn || (props.loggedIn && !props.edit)) && <Gallery extraClass={props.extraClass} photos={props.photos} showThumbnails={props.showThumbnails} autoPlay={props.autoplay}></Gallery>}
        {(props.loggedIn && props.edit) && <EditPhotos imagePosition={props.imagePosition} actions={props.actions} photos={props.photos}></EditPhotos>}
    </div >

}

export default Photos