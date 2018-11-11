import React, { Component } from 'react';
import axios from 'axios'
import { Button, Alert } from 'reactstrap';


class ImageUploadClass extends Component {

    state = {
        file: null,
        errorMessage: '',
        progressMessage : ''
    }

    fileSelected = e => {
        console.log("e", e.target.files[0])
        this.setState({ file: e.target.files[0] })
    }

    fileUploadButton = () => { this.fileInput.click() }
    fileUpload = () => {

        if (this.state.file) {
            let fd = new FormData();
            fd.append('image', this.state.file, this.state.file.name)
            axios({
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.reactBoardToken}`,
                    'Cache-Control': 'no-cache'
                },

                url: 'http://localhost:3001/api/profiles/images',
                data: fd,
                onUploadProgress: (e) => { console.log(" Upload progress", Math.round(e.loaded / e.total * 100)) }
            })
                .then(res => {
                    console.log(res)
                    this.setState({ file: null })
                })
                .catch(err => {
                    this.setState({ file: null })
                    console.log("error", err)
                })
        }


     

    }

    render() {
        let progressMessage = (this.state.progressMessage !== '') ? <Alert color="warning opacity-5">{this.state.progressMessage}</Alert> : null;
      
        let errorMessage = (this.state.errorMessage !== '') ? <Alert color="warning opacity-5">{this.state.errorMessage}</Alert> : null;
        return (
            <div>
                <br />
              <input type="file" ref={fileInput => this.fileInput = fileInput} style={{ display: "none" }} onChange={this.fileSelected} />
                <Button color="dark" onClick={() => this.fileInput.click()} > Select image </Button>
                <Button color="dark" onClick={this.fileUpload} > Upload </Button>
                {errorMessage}
            </div>
        );
    }
}


export default ImageUploadClass;
