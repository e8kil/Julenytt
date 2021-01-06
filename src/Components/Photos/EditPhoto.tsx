import * as React from 'react'
import { Photo } from '../StateManagement/Store'

interface Props {
    p: Photo
    actions: any
}

function EditPhoto(props: Props) {

    const [photo, updatePhoto] = React.useState(props.p)

    const getUrl = (id: string) => {
        try {
            return require("../../../Uploads/Images/" + id).default            
        } catch(e) {
            console.error("Klarte ikke finne: " + id)
            return "https://img.icons8.com/wired/256/000000/no-camera.png"
        }
    }

    return <div className="editPhoto-container">
            <img onClick={() => props.actions.deletePhoto(photo.id)} className="editPhoto-delete-icon" title="Slett bilde" src="https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png" />
            <div className="editPhoto" style={{ backgroundImage: 'url("'+getUrl(photo.id)+'")' }} > </div >
            <textarea className="editPhoto-text" onChange={(e) => updatePhoto({...photo, title: e.target.value})} value={photo.title !== null ? photo.title : ""}>{photo.title}</textarea>
            <input type="save" onClick={() => props.actions.updatePhotoTitle(photo)} disabled={photo.title === props.p.title} value="Lagre tekst" />
        </div>


}

export default EditPhoto