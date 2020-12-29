import React, { useState, useRef } from 'react';
import axios from 'axios'
import { Button, Alert } from 'reactstrap';
import { SERVER_BASE_URL } from '../../../store/types/types';


function ImageUploadClass(props) {

    const [fileState, setFileState] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [progressMessage, setProgressMessage] = useState('');
    const textInput = useRef();

    const clickTextInput = () => textInput.current.click();

    const fileSelected = (e) => {
        setFileState(e.target.files[0])
    }

    //   fileUploadButton() { this.fileInput.click() }
    const fileUpload = () => {


        if (fileState) {
            let fd = new FormData();
            setErrorMessage("");
            fd.append('image', fileState, fileState.name)
            axios({
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.reactBoardToken}`,
                    'Cache-Control': 'no-cache'
                },

                //     url: SERVER_BASE_URL + 'api/images',
                url: SERVER_BASE_URL + 'api/images/galleryImage',
                data: fd,
                onUploadProgress: (e) => {
                    setProgressMessage(Math.round(e.loaded / e.total * 100))
                }
            })
                .then(res => {
                    setProgressMessage('');
                    setFileState(null);
                    console.log("res uploada", res);
                    props.setGallery(images => [{ _id: res.data.id }, ...images])
                })
                .catch(error => {
                    setProgressMessage('');
                    setFileState(null);
                    if (
                        error.response
                        && error.response.data
                        && error.response.data.error
                        && error.response.data.error.message
                    );
                    setErrorMessage(error.response.data.error.message);
                })
        }

    }

    let pm = (progressMessage !== '') ?
        <div>
            <h6> Image is loading... </h6>
            <div className="progress">
                <div
                    className="progress-bar  bg-primary"
                    role="progressbar"
                    style={{ width: `${progressMessage - 1}%` }}
                    aria-valuenow="15"
                    aria-valuemin="0"
                    aria-valuemax="100">
                </div>
                <div
                    className="progress-bar bg-light"
                    role="progressbar"
                    style={{ width: `${101 - progressMessage}%` }}
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100">
                </div>
            </div>
        </div>
        : null;


    return (
        <div>
            <br />
            <input
                type="file"
                ref={textInput}
                style={{ display: "none" }}
                onChange={fileSelected}
            />
            <Button
                color="dark"
                className="m-3"
                onClick={clickTextInput} >
                Select an image to upload
            </Button>
            {
                (fileState && !pm)
                    ? <Button color="dark" onClick={fileUpload} >
                        Upload
                        </Button>
                    : null
            }
            {(progressMessage) ? pm : null}


            {(errorMessage !== '')
                ? <Alert color="warning opacity-5">{errorMessage}</Alert>
                : null}
        </div>
    );
}




export default ImageUploadClass;
