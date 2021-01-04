import { doRequest, doPromiseRequest, ResponseType, AjaxData } from '../../requestHelper'
import { Login, Photo, Text } from './Store'

class Requests {

    private apiUrl
    constructor() {
        this.apiUrl = "#{apiUrl}"
    }

    logIn(login: Login, callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/login', 'POST', login, callback)
    }

    getTextData(callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/getTexts', 'GET', null, callback)
    }

    updateTextData(text: Text, callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/updateText', 'POST', text, callback)
    }   
    
    getPhotos(callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/getPhotos', 'GET', null, callback)
    }

    updatePhotoTitle(photo: Photo, callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/updatePhotoTitle', 'POST', photo, callback)
    }    

    uploadPhoto(files: FormData, position: number, callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/uploadPhoto/' + position + '', 'POST', files, callback)
    }   

    deletePhoto(id: String, callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/deletePhoto/', 'POST', {id: id}, callback)
    }  

    deleteAllPhotos(callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/deleteAllPhotos/', 'POST', null, callback)
    }  

    getPdfs(callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/getPdfs/', 'GET', null, callback)
    } 
    
    uploadPdf(File: FormData, year:number, callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/uploadPdf/' + year + '', 'POST', File, callback)
    }  

    uploadPdfImage(File: FormData, year: number, callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/uploadPdfImage/' + year + '', 'POST', File, callback)
    }  

    deletePdf(year: number, callback: (data: AjaxData) => void) {
        doRequest(''+this.apiUrl+'/deletePdf/' + year + '', 'POST', File, callback)
    }  
}

export default Requests