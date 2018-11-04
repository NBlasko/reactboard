import React, { Component } from 'react';
import { connect } from 'react-redux';




class SingleComment extends Component {
    //   constructor(props) {
    //      super(props);
    //    this.handleClick = this.handleClick.bind(this);
    //   }

    //  handleClick(e) {
    //      this.props.deleteMessageAction(e.target.id);
    //  }
    render() {
        const { message } = this.props;



        let localDate = new Date(message.date).toLocaleString() + "";
        // const vreme = new Date() ;
        //  const iso  =  vreme.toISOString();
        //sad znam kako da brojim coins, mislim ...
        //  const opet= new Date(iso);
        //  console.log("vreme", vreme, iso, opet);

        //koristi message._id za iinfinite scroll ili query selector
        return (
            <div id = {message._id}>
                <hr />
                <div>
                    <b>{message.author}</b>, <small className="text-muted"> {localDate.slice(0, -3)} </small>
                </div>
                <div>
                    {message.body}
                </div>
            </div>

        )

    }
}

export default connect(null, null)(SingleComment);