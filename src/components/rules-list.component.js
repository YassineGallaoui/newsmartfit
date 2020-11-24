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
                            <div className="row">

                                
                                <div className="order-md-last col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-3">
                                    <button type="button" className="btn btn-outline-danger float-left float-md-right ml-xl-3 mb-3" onClick={() => { if (window.confirm('Sure you want to delete this rule?')) props.delete(props.rule._id) }}>Delete Rule</button>
                                    <Link to={"/rules/update/" + props.rule._id}><button type="button" className="btn btn-outline-warning float-left float-md-right ml-3">Edit Rule</button></Link>
                                </div>

                                <div className="col-sm-12 col-md-5 col-lg-5 col-xl- mb-3">
                                    <h6><label>Athletes</label></h6>
                                    <ul>
                                        {
                                            props.rule.athletesId.map(currentAthlete => {
                                                let name = "";
                                                let arr = props.athletes;
                                                for (let i = 0; i < arr.length; i++) {
                                                    if (arr[i]._id === currentAthlete)
                                                        name = arr[i].name
                                                }
                                                return <li>{name + " ~ " + currentAthlete}</li>;
                                            })
                                        }
                                    </ul>
                                    <label>{
                                        (props.rule.suggestedAthletesId.filter(el => props.rule.athletesId.indexOf(el.substring(el.indexOf("~ ")+2)) === -1).length) > 0 ? "Other Suggested Athletes:":"No Other Suggested Athletes"
                                    }</label>
                                    <ul>
                                        {
                                            (props.rule.suggestedAthletesId.filter(el => props.rule.athletesId.indexOf(el.substring(el.indexOf("~ ")+2)) === -1))
                                                .map(currentSuggestedAthlete => {
                                                    return <li>{currentSuggestedAthlete}</li>;
                                            })
                                            
                                        }
                                    </ul>
                                </div>

                                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-3">
                                    <h6><label>Message</label></h6>
                                    <span>
                                        {props.rule.message}
                                    </span>
                                </div>
                            
                            </div>
                            
                            <div className="row">
                                <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5 mb-3">
                                    <h6><label>Conditions</label></h6>
                                    <ul>
                                        {
                                            props.rule.conditions.map(currentCondition => {
                                                return <li><b>{currentCondition.link + " "}</b>{currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}</li>;
                                            })
                                        }
                                    </ul>
                                </div>

                                <div className="col-sm-12 col-md-7 col-lg-7 col-xl-7 mb-3">
                                    <h6><label>Temporal Conditions</label></h6>
                                    <ul>
                                        {
                                            props.rule.temporalConditions.map(currentTemporalCondition => {
                                                return <li><b>{currentTemporalCondition.temporalLink}</b>{` "` + currentTemporalCondition.temporalItem + `" `}<b>{currentTemporalCondition.temporalOperator}</b>{` "` + currentTemporalCondition.temporalValue1 + `"` + (currentTemporalCondition.temporalValue2 === "" ? "" : (` and "` + currentTemporalCondition.temporalValue2 + `"`))}</li>;
                                            })
                                        }
                                    </ul>
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
        axios.delete('/rules/' + id)
            .then(response => {
                console.log("Rule " + id + " eliminated");
                this.setState({
                    rules: this.state.rules.filter(el => el._id !== id)
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
                    <Link to={"/rules/add"}><button type="button" className="float-right btn btn-outline-primary">New rule</button></Link>
                </h2>
                {this.rulesList()}
            </div>
        )
    }
}