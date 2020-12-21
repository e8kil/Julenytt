import { Status, AjaxData, defaultRemoteData } from '../../requestHelper'
import { Store, Photo, Login } from './Store'
import Requests from './Requests';

class Actions {

    private requests: Requests
    private store: Store
    private success: (m: string) => void
    private error: (m: string) => void
    private loggedIn: (loggedIn: boolean) => void

    constructor(requests: Requests, store: Store, error: (m: string) => void, success: (m: string) => void, loggedIn: (loggedIn: boolean) => void ) {
        this.requests = requests
        this.store = store
        this.success = success
        this.error = error
        this.loggedIn = loggedIn
    }

    logIn = (login: Login) => {
        this.requests.logIn(login, (data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }

            if (data.status === Status.complete) {
                if (data.data[0].count > 0) {
                    this.loggedIn(true)
                    this.success("Logget inn")
                } else {
                    this.error("Feil brukernavn eller passord")
                }
                this.store.setState({ loggedIn: data.data[0].count > 0 })
            }
        })
    }

    logOut = () => {
        this.store.setState({ loggedIn: false })
    }

    getTextData = () => {
        this.requests.getTextData((data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            this.store.setState({ textData: data })
        })
    }

    updateTextData = (text: any) => {
        this.requests.updateTextData(text, (data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }

            if (data.status === Status.complete) {
                this.success("Oppdatert")
            }
        })
    }

    getPhotos = (scroll:number) => {
        this.requests.getPhotos((data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            this.store.setState({ photoList: data })
            
            if(scroll) {
                window.scroll({ top: scroll })
            }
        })
    }

    uploadPhoto = (files: FormData, position:number) => {
        let offset = window.pageYOffset
        this.requests.uploadPhoto(files, position, (data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            if (data.status === Status.complete) {
                this.success("Lagring vellykket")
                this.getPhotos(offset)
            } else {
                this.store.setState({ photoList: defaultRemoteData })
            }
        })
    }

    deletePhoto = (id: string) => {
        let offset = window.pageYOffset
        this.requests.deletePhoto(id, (data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            if (data.status === Status.complete) {
                this.success("Bilde slettet")
                this.getPhotos(offset)
            } else {
                this.store.setState({ photoList: defaultRemoteData })
            }
        })
    }    

    deleteAllPhotos = () => {
        let offset = window.pageYOffset
        this.requests.deleteAllPhotos((data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            if (data.status === Status.complete) {
                this.success("Bilde slettet")
                this.getPhotos(offset)
            } else {
                this.store.setState({ photoList: defaultRemoteData })
            }
        })
    }

    updatePhotoTitle = (photo: Photo) => {

        this.requests.updatePhotoTitle(photo, (data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            if (data.status === Status.complete) {
                this.success("Lagring vellykket")
                this.getPhotos(window.pageYOffset)
            }
        })
    }

    getPdfs = (scroll: number) => {
        this.requests.getPdfs((data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            this.store.setState({ pdfList: data })

            if (scroll) {
                window.scroll({ top: scroll })
            }
        })
    }

    uploadPdf = (file: FormData, year: number) => {
        let offset = window.pageYOffset
        this.requests.uploadPdf(file, year, (data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            if (data.status === Status.complete) {
                this.success("Lagring vellykket")
                this.getPdfs(offset)
            } else {
                this.store.setState({ pdfList: defaultRemoteData })
            }
        })
    }

    uploadPdfImage = (file: FormData, year: number) => {
        let offset = window.pageYOffset
        this.requests.uploadPdfImage(file, year, (data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            if (data.status === Status.complete) {
                this.success("Lagring vellykket")
                this.getPdfs(offset)
            } else {
                this.store.setState({ pdfList: defaultRemoteData })
            }
        })
    }

    deletePdf = (year:number) => {
        let offset = window.pageYOffset
        this.requests.deletePdf(year, (data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            if (data.status === Status.complete) {
                this.success("PDF slettet")
                this.getPdfs(offset)
            } else {
                this.store.setState({ pdfList: defaultRemoteData })
            }
        })
    }

}

export default Actions