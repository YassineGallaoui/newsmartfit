import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {

    render() {
        return (
            <div className="container text-center bg-primary">
                <Link to="/"><img src={process.env.PUBLIC_URL + '/img/logo.png'} className="img-fluid my-3" alt="Responsive header img" /></Link>
            </div>
        )
    }
}
