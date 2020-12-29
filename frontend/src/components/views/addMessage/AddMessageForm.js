import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addMessageAction,
    getSingleUserAction,
    removePreviewBlogImageAction
} from '../../../store/actions';
import { SERVER_BASE_URL } from '../../../store/types/types';
import ImageGallery from '../../utils/imagesComponents/ImageGallery';


function AddMessageForm(props) {

    const dispatch = useDispatch();
    const storeData = useSelector(state => {
        const { name, imageQueryID, publicID } = state.user;
        return {
            name,
            publicID,
            imageQueryID,
            previewBlogImageId: state.previewBlogImage.id
        }
    });

    useEffect(() => {
        if (storeData.publicID)
            dispatch(getSingleUserAction(storeData.publicID));
    }, [dispatch, storeData.publicID]);


    const [textState, setText] = useState('');
    const [titleState, setTitle] = useState('');

    const handleChangeText = (e) => {
        setText(e.target.value)
    }

    const handleChangeTitle = (e) => {
        setTitle(e.target.value)
    }


    const addMessage = (e) => {
        if (textState === '' || titleState === '') return;  //izbaci neku poruku da je potrebno popuniti polja
        props.setSubmited(true)
        dispatch(addMessageAction({
            text: textState,
            title: titleState,
            imageId: storeData.previewBlogImageId
        }));

        setText('');
        setTitle('');
    }

    const handleRemovePreviewImage = (e) => {
        dispatch(removePreviewBlogImageAction())
    }

    return (
        <div>
            <div className="container">
                <div className="card-footer bg-transparent border-light">
                    <h2> Add a message </h2>
                    <div className="input-group mb-3">
                        <input
                            type='text'
                            value={titleState}
                            name="title"
                            className="form-control"
                            onChange={handleChangeTitle}
                            placeholder="Type a title..." />
                    </div>
                    <div >
                        <textarea
                            type='text'
                            value={textState}
                            name="text"
                            className="form-control"
                            rows="4"
                            onChange={handleChangeText}
                            placeholder="Type a message..."
                        />
                    </div>
                </div>
                <ImageGallery />
                <div className="text-right">
                    <button
                        className="btn btn-secondary"
                        onClick={addMessage}
                    >
                        Enter
                      </button>
                </div>
            </div >
            <div className="card-body">
                <h2> Preview </h2>
                {
                    (storeData.previewBlogImageId)
                        ? <div>
                            <button
                                className="btn btn-danger mb-1"
                                onClick={handleRemovePreviewImage}>
                                Remove preview image
                           </button>
                            <img
                                // onClick={this.toggle}
                                className="imageFit"
                                src={`${SERVER_BASE_URL}api/images/galleryImage?imageQueryID=${storeData.imageQueryID}&singleImageID=${storeData.previewBlogImageId}&publicID=${storeData.publicID}`}
                                alt="loading..."
                            />
                        </div>
                        : null
                }
                <h3>{titleState}</h3>
                <h5 className="card-title text-dark">
                    <i>by {storeData.name},</i>
                    <small className="text-muted"> {new Date().toLocaleString()} </small>
                </h5>
                <p className="card-text">
                    {textState}
                </p>
                <div className="container-fluid">
                    <div className="btn-group col-sm-pr-6 p-1" role="group" aria-label="TrustAdd">
                        <button
                            type="button"
                            className={`btn btn-outline-primary btn-sm  buttonBorder`}>
                            <span>
                                <i className="fa fa-check-square-o"></i>
                            </span>
                            0
                        </button>
                        <button
                            type="button"
                            className={`btn btn-outline-danger btn-sm buttonBorder`}>
                            <span className="pr-1">
                                <i className="fa fa-exclamation-triangle"></i></span>
                            0
                        </button>
                    </div>
                    <div className="btn-group col-sm-pr-6" role="group" aria-label="LikeAdd">
                        <button
                            type="button"
                            className={`btn btn-outline-primary btn-sm buttonBorder`}>
                            <i className="fa fa-thumbs-up"></i>
                            0
                        </button>
                        <button
                            type="button"
                            className={`btn btn-outline-danger btn-sm rounded-right buttonBorder`}>
                            <i className="fa fa-thumbs-down"></i>
                            0
                        </button>
                        <div
                            className="mr-auto col-sm-p-2">
                            <span className="badge badge-pill badge-white p-2">
                                <i className="fa fa-eye"></i>
                                0
                            </span>
                        </div>
                        <div>
                            <span className="badge badge-pill badge-white p-2">
                                <i className="fa fa-comment"></i>
                                0
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default AddMessageForm;