import React, { Component } from 'react';
import Axios from 'axios';
import Chart from "./charts.component"
import Emoji from 'a11y-react-emoji';

const DataRow = props => (
    <th className="tabellaMoodDate">
        {props.mood.Data}
    </th>
)


const MoodRow = props => (
    <td  className="tabellaMoodDate2">
        {props.onSetEmoticon(props.mood.Mood)}
    </td>
)



export default class DetailsAthlete extends Component {  

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            weight: 0,
            height: 0,
            dob: '',
            activity: [],
            mfp: [],
            body: [],
            sleep: [],
            mood: [],
            athletes: []
        }
    }

    componentDidMount() {
        Axios.get('/athletes/' + this.props.match.params.id)
            .then(response => {
                this.setState({
                    id: response.data._id,
                    name: response.data.name,
                    weight: response.data.weight,
                    height: response.data.height,
                    dob: response.data.dob,
                    activity: response.data.activity,
                    mfp: response.data.mfp,
                    body: response.data.body,
                    sleep: response.data.sleep,
                    mood: response.data.mood
                });
                window.collapsibleDivs();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    setDate(){
        return this.state.mood.map(currentmood => {
            return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
        })
    }

    setMood(){
        return this.state.mood.map(currentmood => {
            return <MoodRow mood={currentmood} onSetEmoticon={this.setEmoticon} key={currentmood.Data}></MoodRow>;
        })
    }

    setEmoticon(number){
        if(number===1) return <Emoji symbol="☹️" label="worst" />;
        if(number===2) return <Emoji symbol="😕" label="wrong" />;
        if(number===3) return <Emoji symbol="😐" label="middle" />;
        if(number===4) return <Emoji symbol="🙂" label="good" />;
        if(number===5) return <Emoji symbol="😃" label="best" />;
    }

    render() {
        return (
            <div>
                <h2>Details</h2>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 my-3">
                        <div className="card">
                            <button className="collapsible">Informazioni generali</button>
                            <div className="content">
                                <div className="card-body">
                                    <p className="card-text">
                                        <span className="text-muted"><em>AthleteID: {this.state.id}</em></span><br />
                                        <span>Nome: {this.state.name}</span><br />
                                        <span>Data di nascita: {this.state.dob}</span><br />
                                        <span>Peso: {this.state.weight}</span><br />
                                        <span>Altezza: {this.state.height}</span><br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                        <div className="card">
                            <button className="collapsible">Umore</button>
                            <div className="content">
                                <div className="card-body">
                                    <div className="card-text">
                                        <table className="table mt-4 small">
                                            <thead>
                                                <tr>
                                                    {this.setDate()}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {this.setMood()}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                        <div className="card">
                            <button className="collapsible">Attività</button>
                            <div className="content">
                                <div className="card-body">
                                    <div className="row" id="activitySection">
                                        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="calorieBruciate"
                                                            chartData={this.state.activity}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="passi"
                                                            chartData={this.state.activity}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="distanza"
                                                            chartData={this.state.activity}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="piani"
                                                            chartData={this.state.activity}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="minuti"
                                                            chartData={this.state.activity}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                        <div className="card">
                            <button className="collapsible">Corpo</button>
                            <div className="content">
                                <div className="card-body">
                                    <div className="row" id="activitySection">
                                        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="peso"
                                                            chartData={this.state.body}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="massaGrassa"
                                                            chartData={this.state.body}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="imc"
                                                            chartData={this.state.body}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                        <div className="card">
                            <button className="collapsible">Alimentazione</button>
                            <div className="content">
                                <div className="card-body">
                                    <div className="row" id="activitySection">
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="caloriesXMeal"
                                                            chartData={this.state.mfp}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="nutrientiColazione"
                                                            chartData={this.state.mfp}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="nutrientiPranzo"
                                                            chartData={this.state.mfp}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="nutrientiCena"
                                                            chartData={this.state.mfp}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="nutrientiSnack"
                                                            chartData={this.state.mfp}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                        <div className="card">
                            <button className="collapsible">Sonno</button>
                            <div className="content">
                                <div className="card-body">
                                    <div className="row" id="activitySection">
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="minutiSleeping"
                                                            chartData={this.state.sleep}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="card-text">
                                                        <Chart
                                                            target="numeroRisvegli"
                                                            chartData={this.state.sleep}
                                                            >
                                                        </Chart>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}