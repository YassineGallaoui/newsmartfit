import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RuleBigDiv = props => (
    <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
            <div className="card">
                <button className="collapsible">{props.rule.name}</button>
                <div className="content">
                    <div className="card-body">
                        <div className="card-text">
                            <button type="button" className="btn btn-outline-danger float-right ml-3 mb-3" onClick={() => {if(window.confirm('Sure you want to delete this rule?')) props.delete(props.rule._id)}}>Delete Rule</button>
                            <Link to={"/rules/update/"+props.rule._id} className="nav-link"><button type="button" className="btn btn-outline-warning float-right">Edit Rule</button></Link>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-3">
                                    <h6><label>Conditions</label></h6>
                                    <ul>
                                    {
                                    props.rule.conditions.map(currentCondition => {
                                        return <li>{currentCondition.type+" is "+currentCondition.operator+" "+currentCondition.value1+(currentCondition.value2===""? "":(" and "+currentCondition.value2))}</li>;
                                    })
                                    }
                                    </ul>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-3">
                                    <h6><label>Athletes</label></h6>
                                    <ul>
                                        {
                                        props.rule.athletesId.map(currentAthlete => {
                                            let name = "";
                                            let arr = props.athletes;
                                            for(let i=0; i<arr.length; i++){
                                                if(arr[i]._id===currentAthlete)
                                                    name=arr[i].name
                                            }
                                            return <li>{name+" ~ "+currentAthlete}</li>;
                                        })
                                        }
                                    </ul>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-3">
                                    <h6><label>Message</label></h6>
                                    <span>
                                        {props.rule.message}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default class RulesList extends Component {

    constructor(props) {
        super(props);
        this.deleteRule = this.deleteRule.bind(this);
        this.state = {
            rules: [],
            athletes: []
        };
    }

    componentDidMount() {
        axios.get('/rules/')
            .then(response => {
                this.setState({ rules: response.data });
                window.collapsibleDivs();
            })
            .catch((error) => {
                console.log(error);
            })
        
        axios.get('/athletes/')
            .then(response => {
                this.setState({ athletes: response.data });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deleteRule(id) {
        axios.delete('/rules/'+id)
            .then(response => {console.log("Rule "+id+" eliminated");
                this.setState({
                    rules: this.state.rules.filter(el =>el._id !==id)
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    rulesList() {
        return this.state.rules.map(currentrule => {
            return <RuleBigDiv rule={currentrule} athletes={this.state.athletes} key={currentrule._id} delete={this.deleteRule}></RuleBigDiv>;
        })
    }

    render() {
        return (
            <div>
                <h2>
                    Your Rules
                    <Link to="/rules/add" className="nav-link"><button type="button" className="float-right btn btn-outline-primary">New rule</button></Link>
                </h2>
                    {this.rulesList()}
            </div>
        )
    }

}