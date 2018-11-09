import React, { Component } from 'react';
import axios from 'axios'



class ImageUploadClass extends Component {

    state = {
        file: null
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


        /*axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    data: {
      "trust": trust
    },
    url: SERVERURL + 'api/profiles/' + blogsID + '/trust',
  }) */

    }

    render() {

        return (
            <div>
                <br />
                Image Upload


              <input type="file" ref={fileInput => this.fileInput = fileInput} style={{ display: "none" }} onChange={this.fileSelected} />
                <button onClick={() => this.fileInput.click()} > Select image </button>
                <button onClick={this.fileUpload} > Upload </button>
            </div>
        );
    }
}


export default ImageUploadClass;
