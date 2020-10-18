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

    render() {
        return (
            <div>
                <h2 className="float-left">Your Athletes</h2>
                <table className="table mt-4">
                    <tbody>
                        {this.athletesList()}
                    </tbody>
                </table>
            </div>
        )
    }
}
