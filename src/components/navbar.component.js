import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark sticky-top">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link to={"/"} className="nav-link">Athletes List <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/rules"} className="nav-link">View Rules</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}