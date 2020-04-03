import { doRequest, doPromiseRequest, ResponseType, AjaxData } from '../../requestHelper'
import { Login, Photo, Text } from './Store'

class Requests {

    constructor() {

    }

    logIn(login: Login, callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/login', 'POST', login, callback)
    }

    getTextData(callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/getTexts', 'GET', null, callback)
    }

    updateTextData(text: Text, callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/updateText', 'POST', text, callback)
    }   
    
    getPhotos(callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/getPhotos', 'GET', null, callback)
    }

    updatePhotoTitle(photo: Photo, callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/updatePhotoTitle', 'POST', photo, callback)
    }    

    uploadPhoto(files: FormData, position: number, callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/uploadPhoto/' + position + '', 'POST', files, callback)
    }   

    deletePhoto(id: String, callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/deletePhoto/', 'POST', {id: id}, callback)
    }  

    deleteAllPhotos(callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/deleteAllPhotos/', 'POST', null, callback)
    }  

    getPdfs(callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/getPdfs/', 'GET', null, callback)
    } 
    
    uploadPdf(File: FormData, year:number, callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/uploadPdf/' + year + '', 'POST', File, callback)
    }  

    uploadPdfImage(File: FormData, year: number, callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/uploadPdfImage/' + year + '', 'POST', File, callback)
    }  

    deletePdf(year: number, callback: (data: AjaxData) => void) {
        doRequest('http://localhost:3000/deletePdf/' + year + '', 'POST', File, callback)
    }  
}

export default Requests