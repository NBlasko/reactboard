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
        console.log("date", message.date)
        const localDate= new Date(message.date);
        console.log("localDate", localDate)
        return (
            <div>
                <hr/>
                {message._id}
                <div>
                  author:  {message.author}
                </div>
                <div>
                 body:   {message.body}
                </div>
                <div>
                  date:  {message.date}
                </div>

            </div>

        )

    }
}

export default connect(null, null)(SingleComment);