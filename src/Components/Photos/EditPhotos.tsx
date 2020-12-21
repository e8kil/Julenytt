import * as React from 'react'
import { Photo } from '../StateManagement/Store'
import EditPhoto from './EditPhoto'
import axios from 'axios';
import Actions from '../StateManagement/Actions';

interface Props {
    photos: Photo[]
    actions: Actions
    imagePosition: number
}

function EditPhotos(props: Props) {

    const [selectedImage, updateSelectedImage] = React.useState(null)
    const [loaded, updateLoaded] = React.useState(0)

    const onChangeHandler = (event: any) => {
        const data = new FormData()
        for (var x = 0; x < event.target.files.length; x++) {
            data.append('file', event.target.files[x])
        }
        props.actions.uploadPhoto(data, props.imagePosition)        
    }

    const deleteAllPhotos = () => {
        let c = confirm("Dette vil slette alle bildene på julenytt. Ønsker du å fortsette?")
        if(c) {
            props.actions.deleteAllPhotos()
        }
    }

    return <div className="editPhotos-container">
            <div className="linkDeleteAllPhotos-container">
                <a className="linkDeleteAllPhotos" onClick={() => deleteAllPhotos()}> Slett alle bildene </a>
            </div>
            <div className="editPhotos-upload-container">
                <img src="https://img.icons8.com/dotty/150/000000/upload-2.png" />
                <p>
                   Trykk her for å legge til flere bilder
                </p>
                <input type="file" name="file" accept="image/x-png,image/gif,image/jpeg" multiple onChange={(e) => onChangeHandler(e)} />
                {/* <button type="button" className="btn btn-success btn-block" onClick={() => onClickHandler()}>Upload</button>  */}
            </div>
             {props.photos.map((p:Photo) => {
                return <EditPhoto actions={props.actions} p={p}></EditPhoto>
            })}
    </div >

}

export default EditPhotos