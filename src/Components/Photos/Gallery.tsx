import * as React from 'react'
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css"
import { Photo } from '../StateManagement/Store'
import '../../style/gallery.scss'
import { Redirect } from 'react-router-dom'

interface Props {
    photos: Photo[],
    showThumbnails: boolean,
    autoPlay: boolean,
    extraClass: string
}

function Gallery(props: Props) {

    const [redirect, updateRedirect] = React.useState(false)
    const [fullscreen, updateFullscreen] = React.useState(false)
    const [showThumbnails, updateShowThumbnails] = React.useState(props.showThumbnails)

    const getImages = (images:Photo[]) => {
        let imageList:any = []
        images.forEach((p: Photo) => {
            var image = require("../../../src/Images/uploads/" + p.id).default            
            imageList.push({
                original: image,
                thumbnail: image,
                description: p.title
            })
        })

        return imageList
    }

    const getYear = () => {
        var d = new Date()
        var year = d.getFullYear()
        var month = d.getMonth()

        if (month == 11) {
            return year
        } else {
            return year - 1
        }
    }

    const fullscreenToggle = (target:any) => {
        if (target) {
            updateFullscreen(true)
            updateShowThumbnails(false)
        } else {
            updateFullscreen(false)
            updateShowThumbnails(props.showThumbnails ? true: false)
        }
    }

    return <div className={fullscreen ? "gallery-container-" + props.extraClass + "-fullscreen" : "gallery-container-"+props.extraClass}>
            
            <ImageGallery 
                items={getImages(props.photos)}
                slideDuration={500}
                slideInterval={5000}
                showThumbnails={props.showThumbnails}
                autoPlay={props.autoPlay}
                lazyLoad={true}
                onScreenChange={(e: any) => fullscreenToggle(e) }
            />
            
            {props.extraClass == "homePage" &&  <a className="linkToMorePhotos" onClick={() => updateRedirect(true)}> Sjå fleire bilete fra {getYear()} her </a>}

        {redirect && <Redirect to="/Bilder" />}

    </div >

}
export default Gallery
