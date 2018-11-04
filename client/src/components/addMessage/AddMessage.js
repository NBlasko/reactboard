import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addMessageAction } from '../../actions'

class AddMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            title: '',
            submited: ''
        }
        this.addMessage = this.addMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.formView = this.formView.bind(this);
        this.submitSuccess = this.submitSuccess.bind(this);
        //  this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleKeyPress(e) {
        /*   if (e.key === 'Enter' && this.state.text !== '') {
               this.props.addMessageAction(this.state.text);
               this.setState({ text: '' });
           }*/
    }
    addMessage() {
        if (this.state.text === '' || this.state.title === '') return;  //izbaci neku poruku da je potrebno popuniti polja
        this.setState({ submited: true })
        this.props.addMessageAction({
            text: this.state.text,
            title: this.state.title,
        });

        this.setState({ text: '', title: '' });
    }



    formView (){
        return (
            <div>
                <div className="container">
                    <div className="card-footer bg-transparent border-light">
                    <h2> Add a message </h2>
                        <div className="input-group mb-3">
                            <input type='text' value={this.state.title} name="title" className="form-control" onKeyPress={this.handleKeyPress} onChange={this.handleChange} placeholder="Type a title..." />
                        </div>
                        <div >
                            <textarea type='text' value={this.state.text} name="text" className="form-control" rows="4" onKeyPress={this.handleKeyPress} onChange={this.handleChange} placeholder="Type a message..." />
                        </div>
                    </div>
                    <div className="text-right">
                        <button className="btn btn-secondary" onClick={this.addMessage}> Enter </button>
                    </div>
                </div >
                <div className="card-body">
                    <h2> Preview </h2>
                    <h3>{this.state.title}</h3>
                    <h5 className="card-title text-dark">
                          <i>by {this.props.name},</i> <small className="text-muted"> {new Date().toLocaleString()} </small>   
                    </h5>
                    <p className="card-text">
                        {this.state.text}
                    </p>
                    <div className="container-fluid">
                        <div className="btn-group col-sm-pr-6 p-1" role="group" aria-label="TrustAdd">
                            <button type="button"  className={`btn btn-outline-primary btn-sm  buttonBorder`}><span><i className="fa fa-check-square-o"></i></span> 0 </button>
                            <button type="button" className={`btn btn-outline-danger btn-sm buttonBorder`}><span className="pr-1"> <i className="fa fa-exclamation-triangle"></i></span>0</button>
                        </div>
                        <div className="btn-group col-sm-pr-6" role="group" aria-label="LikeAdd">
                            <button type="button"  className={`btn btn-outline-primary btn-sm buttonBorder`}> <i className="fa fa-thumbs-up"></i>0</button>
                            <button type="button" className={`btn btn-outline-danger btn-sm  rounded-right buttonBorder`}> <i className="fa fa-thumbs-down"></i>0</button>
                            <div className="mr-auto col-sm-p-2"> <span className="badge badge-pill badge-white p-2"> <i className="fa fa-eye"></i> 0 </span></div>
                            <div className="">  <span className="badge badge-pill badge-white p-2"> <i className="fa fa-comment"></i>  0 </span></div>
                        </div>
                    </div>
                </div>

            </div>

        );
    }

    submitSuccess(){
        return (
            <div className="container">
               <h1 className="text-center"> The message was submited! </h1> 
                <div className="btn btn-primary text-center" style ={{width: "100%"}} onClick={() => this.setState({ submited: false })} role="alert">
                    Submit another one?
                </div>

            </div>
        );
    }
    render() {

       return (
        <div className="shadow-lg p-3 m-2 bg-white minHeight rounded">
       {(this.state.submited) ? this.submitSuccess():  this.formView()}
       </div>);
    }
}

const mapStateToProps = (state) => {

    return ({
        name: state.user.name
    })
}


export default connect(mapStateToProps, { addMessageAction })(AddMessage);
