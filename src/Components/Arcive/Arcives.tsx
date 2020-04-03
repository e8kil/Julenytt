import * as React from 'react'
import { Pdf } from '../StateManagement/Store'
import Arcive from './Arcive';

interface Props {
    pdfs: Pdf[]
    loggedIn: boolean
    actions: any
}

function Arcives(props: Props) {

    const [pdf, updatePdf] = React.useState(null)
    const [year, updateYear] = React.useState(0)

    const onChangeHandler = (event: any) => {
        updatePdf(event.target.files[0])

        // const data = new FormData()
        // data.append('file', event.target.files[0])
        // for (var x = 0; x < event.target.files.length; x++) {
        //     props.actions.uploadPdf(data, year)
        // }
    }

    const uploadPdf = () => {
        const data = new FormData()
        data.append('file', pdf)
        props.actions.uploadPdf(data, year)
    }

    return <div className="arcivesContainer">        
            { props.pdfs.map((pdf:Pdf) => {
                return <Arcive loggedIn={props.loggedIn} actions={props.actions} pdf={pdf}></Arcive>
            })}

            {props.loggedIn &&
                <div className="editPdfs-upload-container">
                    <img src="https://img.icons8.com/wired/256/000000/pdf.png" />
                    
                    {!pdf && <p>
                        {/* Velg pdf-filen du ønsker å laste opp i filutforskeren.             */}
                        <div className="editPdfs-upload-file-button-container">
                    Legg til PDF
                            <input type="file" name="file" accept="application/pdf" onChange={(e) => onChangeHandler(e)} />
                        </div>
                        </p>
                    }

                    {pdf && <p>
                        Skriv inn årstallet på utgaven du valgte. 
                        <div>
                            <input type="text" placeholder="Årstall " value={year > 0 ? year : ""} onChange={(e) => updateYear(parseInt(e.target.value))} />
                        </div>
                        <input type="save" className="edit-Pdfs-upload-image-button"  disabled={year == 0}  value={"Last opp"} onClick={() => uploadPdf()} />
                    </p> }
                   
                    {/* <button type="button" className="btn btn-success btn-block" onClick={() => onClickHandler()}>Upload</button>  */}
                </div>
            }


        </div >

}

export default Arcives