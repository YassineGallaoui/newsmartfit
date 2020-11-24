import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Emoji from 'a11y-react-emoji'
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

let currentYear = new Date().getFullYear(), years = [];
let startYear = 2000;
while (startYear <= currentYear) {
    years.push(startYear++);
}
let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export default class DetailsAthlete extends Component {
    constructor(props) {
        super(props);

        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
        this.showMyRulesPartOne = this.showMyRulesPartOne.bind(this);
        this.showMyRulesPartTwo = this.showMyRulesPartTwo.bind(this);

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
            endDate: null,
            rules:[]
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

        axios.get('/rules/')
            .then(response => {
                this.setState({ rules: response.data });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    showMyRulesPartOne() {
        let firstTime = true;
        return this.state.rules.map(currentRule => {
            let arr = [...currentRule.athletesId]
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === this.props.match.params.id) {
                    if (firstTime === true)
                        document.getElementById("textMyAthleteRules").innerHTML = this.state.name + " has got the following rules:"
                    firstTime = false;
                    return <div className="card my-3 card-body" key={currentRule._id}>
                        <mark className="h6">
                            <Link to={"/rules/update/" + currentRule._id}>
                                &gt; {currentRule.name}
                            </Link>
                        </mark>
                        <div>
                            <label>Conditions</label>
                            <ul>
                                {
                                    currentRule.conditions.map(currentCondition => {
                                        return <li><b>{currentCondition.link + " "}</b>{currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}</li>;
                                    })
                                }
                            </ul>
                            <label>Temporal Conditions</label>
                            <ul>
                                {
                                    currentRule.temporalConditions.map(currentTemporalCondition => {
                                        return <li><b>{currentTemporalCondition.temporalLink}</b>{` "` + currentTemporalCondition.temporalItem + `" `}<b>{currentTemporalCondition.temporalOperator}</b>{` "` + currentTemporalCondition.temporalValue1 + `" ` + (currentTemporalCondition.temporalValue2 === "" ? "" : (`and "` + currentTemporalCondition.temporalValue2 + `"`))}</li>;
                                    })
                                }
                            </ul>
                            <label>Message</label><br />
                            <span>
                                {currentRule.message}
                            </span>
                        </div>
                    </div>;
                }
            }
            if (firstTime === true)
                document.getElementById("textMyAthleteRules").innerHTML = this.state.name + " has got no rules."
        })
    }

    showMyRulesPartTwo() {
        return this.state.rules.map(currentRule => {
            let firstTime = true;
            let arr2 = [...currentRule.suggestedAthletesId];
            arr2 = (arr2.filter(el => currentRule.athletesId.indexOf(el.substring(el.indexOf("~ ")+2)) === -1))
            for (let i = 0; i < arr2.length; i++) {
                if (arr2[i].substring(arr2[i].indexOf("~ ") + 2) === this.props.match.params.id) {
                    if (firstTime === true) {
                        document.getElementById("textMySuggestedAthleteRules").innerHTML = "Think about adding the following rules to " + this.state.name + ":"
                    }
                    firstTime = false;
                    return <div className="card my-3 card-body" key={currentRule._id}>
                        
                        <mark className="h6">
                            <Link to={"/rules/update/" + currentRule._id}>
                                &gt; {currentRule.name}
                            </Link>
                        </mark>
                        <div>
                            <label>Conditions</label>
                            <ul>
                                {
                                    currentRule.conditions.map(currentCondition => {
                                        return <li><b>{currentCondition.link + " "}</b>{currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}</li>;
                                    })
                                }
                            </ul>
                            <label>Temporal Conditions</label>
                            <ul>
                                {
                                    currentRule.temporalConditions.map(currentTemporalCondition => {
                                        return <li><b>{currentTemporalCondition.temporalLink}</b>{` "` + currentTemporalCondition.temporalItem + `" `}<b>{currentTemporalCondition.temporalOperator}</b>{` "` + currentTemporalCondition.temporalValue1 + `" ` + (currentTemporalCondition.temporalValue2 === "" ? "" : (`and "` + currentTemporalCondition.temporalValue2 + `"`))}</li>;
                                    })
                                }
                            </ul>
                            <label>Message</label><br />
                            <span>
                                {currentRule.message}
                            </span>
                        </div>
                    </div>;
                }
            }
            if (firstTime === true)
                document.getElementById("textMySuggestedAthleteRules").innerHTML = "No suggested rules for " + this.state.name

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
                    let dateInfo = parts[2] + "-" + parts[1] + "-" + parts[0];
                    if (date !== null && Date.parse(dateInfo) < Date.parse(date.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                    dateInfo = new Date(dateInfo + "T00:00:00");
                    if (this.state.endDate !== null && Date.parse(dateInfo) > Date.parse(this.state.endDate.toLocaleDateString('ko-KR'))) {
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
                    let dateInfo = parts[2] + "-" + parts[1] + "-" + parts[0];
                    dateInfo = new Date(dateInfo + "T00:00:00");
                    if (date !== null && Date.parse(dateInfo) > Date.parse(date.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                    if (this.state.startDate !== null && Date.parse(dateInfo) < Date.parse(this.state.startDate.toLocaleDateString('ko-KR'))) {
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
                correctDate = new Date(correctDate + "T00:00:00");
                if (Date.parse(correctDate) <= Date.parse(this.state.endDate.toLocaleDateString('ko-KR'))) {
                    return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
                }
            })
        }
        if (this.state.startDate !== null && this.state.endDate !== null) {
            return this.state.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                correctDate = new Date(correctDate + "T00:00:00");
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
                correctDate = new Date(correctDate + "T00:00:00");
                if (Date.parse(correctDate) <= Date.parse(this.state.endDate.toLocaleDateString('ko-KR'))) {
                    return <MoodRow mood={currentmood} onSetEmoticon={this.setEmoticon} key={currentmood.Data}></MoodRow>;
                }
            })
        }
        if (this.state.startDate !== null && this.state.endDate !== null) {
            return this.state.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                correctDate = new Date(correctDate + "T00:00:00");
                if (Date.parse(correctDate) >= Date.parse(this.state.startDate.toLocaleDateString('ko-KR')) && Date.parse(correctDate) <= Date.parse(this.state.endDate.toLocaleDateString('ko-KR'))) {
                    return <MoodRow mood={currentmood} onSetEmoticon={this.setEmoticon} key={currentmood.Data}></MoodRow>;
                }
            })
        }
    }

    setEmoticon(number) {
        if (number === 0) return <Emoji symbol="☹️" label="Really Bad" />;
        if (number === 1) return <Emoji symbol="😕" label="Bad" />;
        if (number === 2) return <Emoji symbol="😐" label="Normal" />;
        if (number === 3) return <Emoji symbol="🙂" label="Good" />;
        if (number === 4) return <Emoji symbol="😃" label="Really Good" />;
    }

    render() {
        return (
            <div>
                <h2>Details</h2>
                <div className="row">
                    <div className="col-sm-12 col-md-5 col-lg-5 col-xl-4 my-3">
                        <div className="card">
                            <button className="collapsible">General Info</button>
                            <div className="content">
                                <div className="card-body">
                                    <p className="card-text">
                                        <span className="text-muted"><em>AthleteID: {this.state.id}</em></span><br />
                                        <span>Name: {this.state.name}</span><br />
                                        <span>Birthday: {this.state.dob}</span><br />
                                        <span>Weight: {this.state.weight} cm</span><br />
                                        <span>Height: {this.state.height} kg</span><br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-7 col-lg-7 col-xl-8 my-3">
                        <div className="card">
                            <button className="collapsible">Setted Rules</button>
                            <div className="content" id="contentDetailsRules">
                                <div className="card-body">
                                    <p className="card-text">
                                        <div id="textMyAthleteRules"></div>                                        
                                        {this.showMyRulesPartOne()}
                                        <div id="textMySuggestedAthleteRules"></div>
                                        {this.showMyRulesPartTwo()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                        <div className="card bg-light">
                            <div className="card-body py-3">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                        <span className="mx-3 d-block d-md-inline mb-2">If you want, filter graphs by date range:</span>
                                        <span className="d-inline-block">
                                            <DatePicker
                                                renderCustomHeader={({
                                                    date,
                                                    changeYear,
                                                    changeMonth,
                                                    decreaseMonth,
                                                    increaseMonth,
                                                    prevMonthButtonDisabled,
                                                    nextMonthButtonDisabled
                                                }) => (
                                                        <div
                                                            style={{
                                                                margin: 10,
                                                                display: "flex",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <button type="button" className="btn btn-light btn-sm" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                                {"<"}
                                                            </button>
                                                            <select
                                                                className="form-control form-control-sm"
                                                                value={date.getFullYear()}
                                                                onChange={({ target: { value } }) => changeYear(value)}
                                                            >
                                                                {years.map(option => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <select
                                                                className="form-control form-control-sm"
                                                                value={months[date.getMonth()]}
                                                                onChange={({ target: { value } }) =>
                                                                    changeMonth(months.indexOf(value))
                                                                }
                                                            >
                                                                {months.map(option => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <button type="button" className="btn btn-light btn-sm" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                                {">"}
                                                            </button>
                                                        </div>
                                                    )}
                                                dateFormat="dd/MM/yyyy"
                                                selected={this.state.startDate}
                                                onChange={date => this.onChangeStartDate(date)}
                                                maxDate={this.state.endDate}
                                                isClearable
                                                placeholderText=" No start date selected"
                                                className="d-inline-block mx-3"
                                            />
                                        </span>
                                        <span className="d-inline-block">
                                            <DatePicker
                                                renderCustomHeader={({
                                                    date,
                                                    changeYear,
                                                    changeMonth,
                                                    decreaseMonth,
                                                    increaseMonth,
                                                    prevMonthButtonDisabled,
                                                    nextMonthButtonDisabled
                                                }) => (
                                                        <div
                                                            style={{
                                                                margin: 10,
                                                                display: "flex",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <button type="button" className="btn btn-light btn-sm" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                                {"<"}
                                                            </button>
                                                            <select
                                                                className="form-control form-control-sm"
                                                                value={date.getFullYear()}
                                                                onChange={({ target: { value } }) => changeYear(value)}
                                                            >
                                                                {years.map(option => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <select
                                                                className="form-control form-control-sm"
                                                                value={months[date.getMonth()]}
                                                                onChange={({ target: { value } }) =>
                                                                    changeMonth(months.indexOf(value))
                                                                }
                                                            >
                                                                {months.map(option => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <button type="button" className="btn btn-light btn-sm" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                                {">"}
                                                            </button>
                                                        </div>
                                                    )}
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
                            <button className="collapsible">Activity</button>
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
                            <button className="collapsible">Body</button>
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
                            <button className="collapsible">Nutrition</button>
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
                            <button className="collapsible">Sleep</button>
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