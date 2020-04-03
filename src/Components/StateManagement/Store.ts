import { AjaxData, Status, defaultRemoteData } from '../../requestHelper'
import BaseStore from '../../BaseStore'

interface Photo {
    id: string,
    imgPosition: number,
    title: string
}

interface Text {
    id: number
    txt: string
}

interface Login {
    username: string,
    password: string
}

interface Pdf {
    id: string,
    name: string
}

interface StoreData {
    textData: AjaxData,
    photoList: AjaxData,
    pdfList: AjaxData
    loggedIn: boolean
}

class Store extends BaseStore<StoreData> {
    constructor() {
        super()
        this.state = {
            textData: defaultRemoteData,
            photoList: defaultRemoteData,
            pdfList: defaultRemoteData,
            loggedIn: false
        }
    }
}


export { Store, StoreData, Photo, Text, Login, Pdf }
