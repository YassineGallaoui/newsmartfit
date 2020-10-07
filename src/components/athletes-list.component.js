import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AthleteRow = props => (
    <tr>
        <td>
            <Link to={"/" + props.athlete._id}>
                {props.athlete.name}
            </Link>
        </td>
    </tr>
)


export default class AthletesList extends Component {

    constructor(props) {
        super(props);
        /* this.onKeyPressed = this.onKeyPressed.bind(this); */
        this.state = { athletes: [] };
    }

    componentDidMount() {
        axios.get('/athletes/')
            .then(response => {
                this.setState({ athletes: response.data })
            })
            .catch((error) => {
                console.log(error);
            })
    }


    athletesList() {
        return this.state.athletes.map(currentathlete => {
            return <AthleteRow athlete={currentathlete} key={currentathlete._id}></AthleteRow>;
        })
    }

    /*     onKeyPressed(event) {
            let value= event.target.value;
            if(value!==""){
                axios.get('/athletes/')
                .then(response => {            
                    for(let z=0; z<response.data.lenght; z++){
                        let x = response.data[z].name.indexOf(value);
                            if(x===-1)
                                response.data.splice(z, 1);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
            }
            console.log("hai scritto"+value);
        } */

    render() {
        return (
            <div>
                <h2 className="float-left">Your Athletes</h2>
                {/* <form className="form-inline float-right">
                    <input className="ricercaAtleta form-control mr-sm-2" id="searchBox" type="search"  value={this.state.value} 
                    placeholder="Search" aria-label="Search"  onKeyUp={this.onKeyPressed} tabIndex="0" ></input>
                </form> */}

                <table className="table mt-4">
                    <tbody>
                        {this.athletesList()}
                    </tbody>
                </table>
            </div>
        )
    }

}
