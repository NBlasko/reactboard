import React, { Component } from 'react';
import axios from 'axios'
import { Button, Alert } from 'reactstrap';


class ImageUploadClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            errorMessage: '',
            progressMessage: ''
        }
        this.fileSelected = this.fileSelected.bind(this);
        this.fileUploadButton = this.fileUploadButton.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }


    fileSelected(e) {
        console.log("e", e.target.files[0])
        this.setState({ file: e.target.files[0] })
    }

    fileUploadButton() { this.fileInput.click() }
    fileUpload() {

        if (this.state.file) {
            let fd = new FormData();
            fd.append('image', this.state.file, this.state.file.name)
            axios({
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.reactBoardToken}`,
                    'Cache-Control': 'no-cache'
                },

             url: 'http://localhost:3001/api/images',
          // url: 'http://localhost:3001/api/images/gallery',
                data: fd,
                onUploadProgress: (e) => {
                    this.setState({ progressMessage: Math.round(e.loaded / e.total * 100) })
                }
            })
                .then(res => {
                    console.log(res)
                    this.setState({ file: null, progressMessage: '' })
                    window.location.reload()
                })
                .catch(err => {
                    this.setState({ file: null, progressMessage: '' })
                    console.log("error", err)
                })
        }




    }

    render() {
        console.log("cc")
        const pm = this.state.progressMessage;
        let progressMessage = (pm !== '') ?
            <div>
                <h6> Image is loading... </h6>
                <div className="progress">
                    <div className="progress-bar  bg-primary" role="progressbar" style={{ width: `${pm - 1}%` }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                    <div className="progress-bar bg-light" role="progressbar" style={{ width: `${101 - pm}%` }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            : null;

        let errorMessage = (this.state.errorMessage !== '') ? <Alert color="warning opacity-5">{this.state.errorMessage}</Alert> : null;
        return (
            <div>
                <br />
                <input type="file" ref={fileInput => this.fileInput = fileInput} style={{ display: "none" }} onChange={this.fileSelected} />
                <Button color="dark" className="m-3" onClick={() => this.fileInput.click()} > Select image </Button>
                {(this.state.file && !pm) ? <Button color="dark" onClick={this.fileUpload} > Upload </Button> : null}
                {(pm) ? progressMessage : null}


                {errorMessage}
            </div>
        );
    }
}



export default ImageUploadClass;
