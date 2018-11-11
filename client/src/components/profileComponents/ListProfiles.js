import React, { Component } from 'react';
import axios from "axios";
import { SERVERURL } from '../../constants';


class ListProfiles extends Component {

    state = {
        slika: ''
    }
    componentDidMount() {
        var img = document.createElement("img");
        
       img.src =  SERVERURL + 'api/images';
      // console.log("img", img.src)
       var src = document.getElementById("slikabr1");
        src.appendChild(img);

        axios({
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.reactBoardToken}`,
                'Cache-Control': 'no-cache',
            },
            url: SERVERURL + 'api/test',
        }).then(res => {
             console.log("res",res)
               this.setState({slika: res.data})
          //  img.src =  res;
      //      src.appendChild(res);

        })
            .catch(err => console.log(err));

    }


    render() {
        console.log("listprofiles props", this.props.routeProps)
        return (
            <div>
                ListProfiles
                <h1>oce li</h1>
                <img src={"data:image/png;base64," + this.state.slika} alt="nema nista" />
                <div id = "slikabr1"  /> <div></div>
            </div>
        );
    }
}


export default ListProfiles;
