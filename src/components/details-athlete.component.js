import React, { Component } from 'react';
import axios from 'axios';
import Chart from "./charts.component"
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const DataRow = props => (
    <th className="tabellaMoodDate py-4">
        <span className="tabellaMoodDateText">
            {props.mood.Data}
        </span>
    </th>
)


const MoodRow = props => (
    <td className="tabellaMoodDate2">
        {props.onSetEmoticon(props.mood.Mood)}
    </td>
)

export default class DetailsAthlete extends Component {

    constructor(props) {
        super(props);

        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);

        this.state = {
            id: '',
            name: '',
            weight: 0,
            height: 0,
            dob: '',
            activity: [],
            activityToPass: [],
            mfp: [],
            mfpToPass: [],
            body: [],
            bodyToPass: [],
            sleep: [],
            sleepToPass: [],
            mood: [],
            moodToPass: [],
            athletes: [],
            startDate: null,
            endDate: null
        }
    }

    componentDidMount() {
        axios.get('/athletes/' + this.props.match.params.id)
            .then(response => {
                this.setState({
                    id: response.data._id,
                    name: response.data.name,
                    weight: response.data.weight,
                    height: response.data.height,
                    dob: response.data.dob,
                    activity: response.data.activity,
                    activityToPass: response.data.activity,
                    mfp: response.data.mfp,
                    mfpToPass: response.data.mfp,
                    body: response.data.body,
                    bodyToPass: response.data.body,
                    sleep: response.data.sleep,
                    sleepToPass: response.data.sleep,
                    mood: response.data.mood,
                    moodToPass: response.data.mood
                });
                window.collapsibleDivs();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onChangeStartDate(date) {
        this.state.activityToPass = [...this.state.activity];
        this.state.mfpToPass = [...this.state.mfp];
        this.state.bodyToPass = [...this.state.body];
        this.state.sleepToPass = [...this.state.sleep];
        let arrInfo = [];
        for (let j = 0; j < 4; j++) {
            switch (j) {
                case 0: arrInfo = this.state.activityToPass; break;
                case 1: arrInfo = this.state.mfpToPass; break;
                case 2: arrInfo = this.state.bodyToPass; break;
                case 3: arrInfo = this.state.sleepToPass; break;
            }
            if (arrInfo.length > 0) {
                for (let i = 0; i < arrInfo.length; i++) {
                    let parts = arrInfo[i].Data.split("/")
                    let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                    if (date !== null && Date.parse(correctDate) < Date.parse(date.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                    if (this.state.endDate !== null && Date.parse(correctDate) > Date.parse(this.state.endDate.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                }
            }
            switch (j) {
                case 0: this.setState({ activityToPass: arrInfo }); break;
                case 1: this.setState({ mfpToPass: arrInfo }); break;
                case 2: this.setState({ bodyToPass: arrInfo }); break;
                case 3: this.setState({ sleepToPass: arrInfo }); break;
            }
        }
        this.setState({
            startDate: date
        })
    }

    onChangeEndDate(date) {
        this.state.activityToPass = [...this.state.activity];
        this.state.mfpToPass = [...this.state.mfp];
        this.state.bodyToPass = [...this.state.body];
        this.state.sleepToPass = [...this.state.sleep];
        let arrInfo = [];
        for (let j = 0; j < 4; j++) {
            switch (j) {
                case 0: arrInfo = this.state.activityToPass; break;
                case 1: arrInfo = this.state.mfpToPass; break;
                case 2: arrInfo = this.state.bodyToPass; break;
                case 3: arrInfo = this.state.sleepToPass; break;
            }
            if (arrInfo.length > 0) {
                for (let i = 0; i < arrInfo.length; i++) {
                    let parts = arrInfo[i].Data.split("/")
                    let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                    if (date !== null && Date.parse(correctDate) > Date.parse(date.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                    if (this.state.startDate !== null && Date.parse(correctDate) < Date.parse(this.state.startDate.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                }
            }
            switch (j) {
                case 0: this.setState({ activityToPass: arrInfo }); break;
                case 1: this.setState({ mfpToPass: arrInfo }); break;
                case 2: this.setState({ bodyToPass: arrInfo }); break;
                case 3: this.setState({ sleepToPass: arrInfo }); break;
            }
        }
        this.setState({
            endDate: date
        })
    }

    setDate() {
        if (this.state.startDate === null && this.state.endDate === null) {
            return this.state.mood.map(currentmood => {
                return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
            })
        }
        if (this.state.startDate !== null && this.state.endDate === null) {
            return this.state.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                if (Date.parse(correctDate) >= Date.parse(this.state.startDate.toLocaleDateString('ko-KR'))) {
                    return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
                }
            })
        }
        if (this.state.startDate === null && this.state.endDate !== null) {
            return this.state.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                if (Date.parse(correctDate) <= Date.parse(this.state.endDate.toLocaleDateString('ko-KR'))) {
                    return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
                }
            })
        }
        if (this.state.startDate !== null && this.state.endDate !== null) {
            return this.state.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                if (Date.parse(correctDate) >= Date.parse(this.state.startDate.toLocaleDateString('ko-KR')) && Date.parse(correctDate) <= Date.parse(this.state.endDate.toLocaleDateString('ko-KR'))) {
                    return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
                }
            })
        }
    }

    setMood() {
        if (this.state.startDate === null && this.state.endDate === null) {
            return this.state.mood.map(currentmood => {
                return <MoodRow mood={currentmood} onSetEmoticon={this.setEmoticon} key={currentmood.Data}></MoodRow>;
            })
        }
        if (this.state.startDate !== null && this.state.endDate === null) {
            return this.state.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                if (Date.parse(correctDate) >= Date.parse(this.state.startDate.toLocaleDateString('ko-KR'))) {
                    return <MoodRow mood={currentmood} onSetEmoticon={this.setEmoticon} key={currentmood.Data}></MoodRow>;
                }
            })
        }
        if (this.state.startDate === null && this.state.endDate !== null) {
            return this.state.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                if (Date.parse(correctDate) <= Date.parse(this.state.endDate.toLocaleDateString('ko-KR'))) {
                    return <MoodRow mood={currentmood} onSetEmoticon={this.setEmoticon} key={currentmood.Data}></MoodRow>;
                }
            })
        }
        if (this.state.startDate !== null && this.state.endDate !== null) {
            return this.state.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                if (Date.parse(correctDate) >= Date.parse(this.state.startDate.toLocaleDateString('ko-KR')) && Date.parse(correctDate) <= Date.parse(this.state.endDate.toLocaleDateString('ko-KR'))) {
                    return <MoodRow mood={currentmood} onSetEmoticon={this.setEmoticon} key={currentmood.Data}></MoodRow>;
                }
            })
        }
    }

    setEmoticon(number) {
        if (number === 1) return <span role="img" aria-label="Really Bad" >☹️</span>;
        if (number === 2) return <span role="img" aria-label="Bad" >😕</span>;
        if (number === 3) return <span role="img" aria-label="Normal" >😐</span>;
        if (number === 4) return <span role="img" aria-label="Good" >🙂</span>;
        if (number === 5) return <span role="img" aria-label="Really Good" >😃</span>;
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
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 my-3">
                        <div className="card">
                            <button className="collapsible">Setted Rules</button>
                            <div className="content">
                                <div className="card-body">
                                    <p className="card-text">
                                        <span className="text-muted"><em>{this.state.name} has got the following rules:</em></span><br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                        <div className="row">
                            <div className="bg-light col-sm-12 col-md-12 col-lg-12 col-xl-12 py-3">
                                <span className="mr-3">Filter graphs by date range:</span>
                                <span className="d-inline-block">
                                    <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.startDate}
                                        onChange={date => this.onChangeStartDate(date)}
                                        maxDate={new Date()}
                                        isClearable
                                        placeholderText=" No start date selected"
                                        className="d-inline-block mx-3"
                                    />
                                </span>
                                <span className="d-inline-block">
                                    <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.endDate}
                                        onChange={date => this.onChangeEndDate(date)}
                                        minDate={this.state.startDate}
                                        maxDate={new Date()}
                                        isClearable
                                        placeholderText=" No end date selected"
                                        className="d-inline-block mx-3"
                                    />
                                </span>
                                <br />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                        <div className="card">
                            <button className="collapsible">Mood</button>
                            <div className="content">
                                <div className="card-body">
                                    <div className="row" id="moodSection">
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                            <div className="card">
                                                <div className="card-body overflow-auto">
                                                    <div className="card-text">
                                                        <table className="table m2-4 small">
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
                                                            chartData={this.state.activityToPass}
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
                                                            chartData={this.state.activityToPass}
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
                                                            chartData={this.state.activityToPass}
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
                                                            chartData={this.state.activityToPass}
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
                                                            chartData={this.state.activityToPass}
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
                                                            chartData={this.state.bodyToPass}
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
                                                            chartData={this.state.bodyToPass}
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
                                                            chartData={this.state.bodyToPass}
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
                                                            chartData={this.state.mfpToPass}
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
                                                            chartData={this.state.mfpToPass}
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
                                                            chartData={this.state.mfpToPass}
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
                                                            chartData={this.state.mfpToPass}
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
                                                            chartData={this.state.mfpToPass}
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
                                                            chartData={this.state.sleepToPass}
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
                                                            chartData={this.state.sleepToPass}
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