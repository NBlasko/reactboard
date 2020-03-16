import React from 'react';

function AddMessageSubmitSuccess(props) {
    return (
        <div className="container">
            <h1 className="text-center">
                The message was submited!
             </h1>
            <div
                className="btn btn-primary text-center"
                style={{ width: "100%" }}
                onClick={() => props.setSubmited(false)}
                role="alert">
                Submit another one?
            </div>

        </div>
    );
}


export default AddMessageSubmitSuccess;