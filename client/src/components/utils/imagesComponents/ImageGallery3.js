import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SingleImageInGallery from './SingleImageInGallery';
import ImageUploadClass from './ImageUploadClass';
import {
    getGalleryListAction,
    getNewGalleryListAction,
    removeGalleryListAction
} from '../../../store/actions';

import { withRouter } from "react-router";

function ImageGallery(props) {

    const [numOfImages, setNumberOfImages] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [emptyAJAX, setEmptyAJAX] = useState(false);
    const [matchPath, setMatchPath] = useState('');

    const dispatch = useDispatch();

    const { numberValue, publicID, galleryList } = useSelector((state) => {
        const numberValue = (state.numberOfData) ? state.numberOfData.number : -1
        let returnedObject = {}
        returnedObject.publicID = state.user.publicID
        returnedObject.numberValue = numberValue;
        if (state.galleryList) returnedObject.galleryList = state.galleryList
        return (returnedObject);
    });


    const handleClick = () => {
        if (!isLoading && !emptyAJAX
            && galleryList
            && galleryList[0]) {
            setIsLoading(true);
            if (props.match.path !== "/addmessage")
                dispatch(getGalleryListAction(galleryList.length));
        }

        if (props.match.path === "/addmessage") {
            const l = (
                galleryList
                && galleryList.length
            )
                ? galleryList.length
                : 0
            dispatch(getGalleryListAction(l));
        }
    }

    useEffect(() => {
        //   setMatchPath(props.match.path);
        // if (props.match.path !== "/addmessage")
        //     dispatch(getNewGalleryListAction(0));

        return () => dispatch(removeGalleryListAction());
    }, []);


    useEffect(() => {
        if (props.match.path !== matchPath)
            setMatchPath(props.match.path);
    }, [props.match.path]);


    useEffect(() => {
        dispatch(getNewGalleryListAction(0));
    }, [props.match.url]);



    // componentDidMount() {
    //     setMatchPath(props.match.path);
    //     if (props.match.path !== "/addmessage")
    //     dispatch(getNewGalleryListAction(0));
    // }

    // componentDidUpdate(prevProps, prevState) {
    //     if (props.match.path !== matchPath)
    //         setMatchPath(props.match.path);
    //     if (prevProps.match.url !== this.props.match.url)
    //         dispatch(getNewGalleryListAction(0));
    // }

    useEffect(() => {
        const fetchedLength =
            (numberValue || numberValue === 0)
                ? numberValue
                : -1;
        if (galleryList) {
            setIsLoading(false);
            setNumberOfImages(galleryList.length);

            if ((fetchedLength >= 0 && fetchedLength < 5) && galleryList.length !== -1)
                setEmptyAJAX(true);
        }
    }, [numberValue]);


    // componentWillReceiveProps(newProps) {
    //     const numberValue =
    //         (newProps.numberValue || newProps.numberValue === 0)
    //             ? newProps.numberValue
    //             : -1;
    //     if (newProps.galleryList) {
    //         this.setState({ isLoading: false, numOfImages: newProps.galleryList.length });
    //         if ((numberValue >= 0 && numberValue < 5) && newProps.galleryList.length !== -1)
    //             this.setState({ emptyAJAX: true })
    //     }
    // }




    // napravi action da dobaci niz slika sa svojim podacima
    // po url param i ako je korisnik koji trazi slike da pogleda ulogovan
    //       console.log("this.props.publicID", this.props.publicID,
    //        "this.props.match", this.props.match)

    const imageGalleryList
        = (galleryList
            && matchPath === props.match.path
        )
            ? galleryList.map((singleImage) =>
                <SingleImageInGallery
                    key={singleImage._id}
                    singleImage={singleImage}
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
                        <ImageUploadClass />

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