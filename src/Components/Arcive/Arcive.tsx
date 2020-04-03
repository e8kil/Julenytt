import * as React from 'react'
import { Pdf } from '../StateManagement/Store';
import Actions from '../StateManagement/Actions';
import { PDFJS } from 'pdfjs-dist';

interface Props {
    pdf: Pdf
    loggedIn: boolean
    actions: Actions
}

function Arcive(props: Props) {

    const [image, updateImage] = React.useState(null)

    fetch('../../../src/PdfImages/'+props.pdf.id+'.jpg', {})
        .then((response) => { console.log(response); if(response.status === 200) { updateImage(response.url)}} )


    const onChangeHandler = (event: any) => {
        const data = new FormData()
        data.append('file', event.target.files[0])
        console.log(data)
        props.actions.uploadPdfImage(data, parseInt(props.pdf.id))
    }

    const deleteAllPhotos = () => {
        let c = confirm("Er du sikker på at du ønsker å slette pdf?")
        if (c) {
            props.actions.deletePdf(parseInt(props.pdf.id))
        }
    }


    return <div className="Pdf-container">
                {props.loggedIn && <img onClick={() => deleteAllPhotos()} className="edit-arcive-delete-icon" title="Slett bilde" src="https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png" /> }
                <a href={'../../../src/pdfFiles/' + props.pdf.id + '.pdf'} target="_blank">
                    <div className="arcive-title">{props.pdf.name}</div>
                    {image && <div className="arcive-image" style={{ backgroundImage: 'url('+image+')' }} > </div > }
                    {!image && props.loggedIn &&
                        <div className="arcive-image arcive-image-missing">
                            <img src="https://img.icons8.com/wired/256/000000/add-image.png" />
                            <p>
                                <div className="editPdfs-upload-image-button-container ">
                                        Legg til bilde
                                        <input type="file" accept="image/x-png,image/gif,image/jpeg" name="file" onChange={(e) => onChangeHandler(e)} />
                                </div>
                            </p>
                        </div>
                    }

                    {!image && !props.loggedIn && 
                        <div className="arcive-missing-image-container">
                            <img src="https://img.icons8.com/wired/256/000000/no-image.png" />
                        </div>
                    }
                </a>
        </div >

}

export default Arcive