import { Status, AjaxData, defaultRemoteData } from '../../requestHelper'
import { Store, Photo, Login } from './Store'
import Requests from './Requests';
import { history } from '../../helpers'

class Actions {

    private requests: Requests
    private store: Store
    private success: (m: string) => void
    private error: (m: string) => void
    private setLoggedInStatus: (d: boolean) => void
    private setEditMode: () => void

    constructor(requests: Requests, store: Store, error: (m: string) => void, success: (m: string) => void, setLoggedInStatus: (d: boolean) => void, setEditMode: () => void) {
        this.requests = requests
        this.store = store
        this.success = success
        this.error = error
        this.setLoggedInStatus = setLoggedInStatus
        this.setEditMode = setEditMode
    }

    loggedIn = () => {
        this.requests.loggedIn((data: AjaxData) => {

            if (data.status === Status.error) {
                this.error(data.error)
            }

            if (data.status === Status.complete) {
                this.store.setState({ loggedIn: data.data.auth })
                this.setLoggedInStatus(data.data.auth)
            }
        })
    }

    logIn = (login: Login) => {
        this.requests.logIn(login, (data: AjaxData) => {

            if (data.status === Status.error) {
                this.error(data.error)
            }

            if (data.status === Status.complete) {
                if (data.data.auth) {
                    this.success("Logget inn")
                    localStorage.setItem("token", data.data.token)
                } else {
                    this.error("Feil brukernavn eller passord")
                }
                this.setLoggedInStatus(data.data.auth)
            }
        })
    }

    logOut = () => {
        this.setLoggedInStatus(false)
    }

    getTextData = (scroll:number) => {
        this.requests.getTextData((data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }
            this.store.setState({ textData: data })
            window.scroll({ top: scroll })
        })
    }

    updateTextData = (text: any) => {
        let offset = window.pageYOffset
        this.requests.updateTextData(text, (data: AjaxData) => {
            if (data.status === Status.error) {
                this.error(data.error)
            }

            if (data.status === Status.complete) {

                if(data.data.auth) {
                    this.success("Lagring vellykket")
                } else {
                    this.setLoggedInStatus(false)
                    this.error("Ikke lenger logget inn")
                }
                
                this.getTextData(offset)
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
                if(data.data.auth) {
                    this.success("Lagring vellykket")
                    this.getPhotos(offset)
                } else {
                    this.error("Ikke lenger logget inn")
                    this.setLoggedInStatus(false)
                }                 
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
                if(data.data.auth) {
                    this.success("Bilde slettet")
                    this.getPhotos(offset)
                } else {
                    this.error("Ikke lenger logget inn")
                    this.setLoggedInStatus(false)
                }                 
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
                if(data.data.auth) {
                    this.success("Bilder slettet")
                    this.getPhotos(offset)
                } else {
                    this.error("Ikke lenger logget inn")
                    this.setLoggedInStatus(false)
                }  
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
                if(data.data.auth) {
                    this.success("Lagring vellykket")
                    this.getPhotos(window.pageYOffset)
                } else {
                    this.error("Ikke lenger logget inn")
                    this.setLoggedInStatus(false)
                }                  
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
                if(data.data.auth) {
                    this.success("Lagring vellykket")
                } else {
                    this.error("Ikke lenger logget inn")
                    this.setLoggedInStatus(false)
                } 

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
                if(data.data.auth) {
                    this.success("Lagring vellykket")
                    this.getPdfs(offset)
                } else {
                    this.error("Ikke lenger logget inn")
                    this.setLoggedInStatus(false)
                }                 
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
                if(data.data.auth) {
                    this.success("PDF slettet")
                    this.getPdfs(offset)
                } else {
                    this.error("Ikke lenger logget inn")
                    this.store.setState({loggedIn: false})
                }                 
            } else {
                this.store.setState({ pdfList: defaultRemoteData })
            }
        })
    }

    toogleEditMode() {
        this.setEditMode()
    }

}

export default Actions