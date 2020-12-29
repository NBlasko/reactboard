import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SingleImageInGallery from './SingleImageInGallery';
import ImageUploadClass from './ImageUploadClass';
import axios from "axios";
import { SERVER_BASE_URL } from '../../../store/types/types';
import { withRouter } from "react-router";

function ImageGallery(props) {
    const [gallery, setGallery] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [emptyAJAX, setEmptyAJAX] = useState(false);

    const publicID = useSelector((state) => {
        return (state.user.publicID);
    });


    const handleClick = () => {
        if (isLoading) return;
        setIsLoading(true);
        axios({
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.reactBoardToken}`,
                'Cache-Control': 'no-cache'
            },
            url: SERVER_BASE_URL + 'api/images/gallerylist?skip=' + gallery.length,
        }).then(res => {
            setGallery(images => [...images, ...res.data.galleryList])
            setIsLoading(false);
            if (res.data.galleryList.length >= 0 && res.data.galleryList.length < 5)
                setEmptyAJAX(true);
        })
            .catch(error => {
                setIsLoading(false);
                console.log(error)
            });
    }


    const imageGalleryList
        = (gallery)
            ? gallery.map((singleImage) =>
                <SingleImageInGallery
                    key={singleImage._id}
                    singleImage={singleImage}
                    setGallery = {setGallery}
                    {...props}
                />)
            : null;
    return (
        <div >
            {
                (   /* render everything*/
                    /* if you are viewing your own profile */
                    publicID === props.match.params.id
                    /* or you want to add a message*/
                    || props.match.path === `/addmessage`
                )
                    ?
                    <div>
                        <ImageUploadClass
                            setGallery={setGallery}
                        />

                        <hr />
                        <h2 className="text-dark">Image Gallery</h2>
                        <div className="row">

                            {imageGalleryList}

                        </div>
                        {(emptyAJAX)
                            ? <div> There are no more images... </div>
                            : <button
                                className="btn btn-primary mt-2"
                                onClick={handleClick}>
                                Load more images
                             </button>
                        }
                    </div>
                    :
                    null
            }
        </div>
    )
}


const ImageGalleryWithRouter = withRouter(ImageGallery);

export default ImageGalleryWithRouter;