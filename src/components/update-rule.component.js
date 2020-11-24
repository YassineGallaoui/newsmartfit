import React, { Component } from 'react';
import axios from 'axios';
let exampleText = `You should:
        - first tip
        - second tip
        - ...
        `

export default class UpdateRule extends Component {
    constructor(props) {
        super(props);

        this.controllaNomi = this.controllaNomi.bind(this);
        this.onAddAthleteId = this.onAddAthleteId.bind(this);
        this.onAddSuggestedAthleteId = this.onAddSuggestedAthleteId.bind(this);
        this.onAddAllAthletesId = this.onAddAllAthletesId.bind(this);
        this.onAddAllSuggestedAthletesId = this.onAddAllSuggestedAthletesId.bind(this);
        this.onRemoveAthleteId = this.onRemoveAthleteId.bind(this);
        this.onRemoveAllAthletesId = this.onRemoveAllAthletesId.bind(this);
        this.onAddCondition = this.onAddCondition.bind(this);
        this.onRemoveCondition = this.onRemoveCondition.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeOperator = this.onChangeOperator.bind(this);
        this.onChangeValue1Condition = this.onChangeValue1Condition.bind(this);
        this.onChangeValue2Condition = this.onChangeValue2Condition.bind(this);
        this.onChangelink = this.onChangelink.bind(this);
        this.filterAthletes = this.filterAthletes.bind(this);
        this.onChangeTemporalItem = this.onChangeTemporalItem.bind(this);
        this.onChangeTemporalOperator = this.onChangeTemporalOperator.bind(this);
        this.onChangeValue1TemporalCondition = this.onChangeValue1TemporalCondition.bind(this);
        this.onChangeValue2TemporalCondition = this.onChangeValue2TemporalCondition.bind(this);
        this.onChangeTemporalLink = this.onChangeTemporalLink.bind(this);
        this.onAddTemporalCondition = this.onAddTemporalCondition.bind(this);
        this.onRemoveTemporalCondition = this.onRemoveTemporalCondition.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.showSuggestedAthletes = this.showSuggestedAthletes.bind(this);

        this.myRef = React.createRef();
        this.myRef2 = React.createRef();

        this.state = {
            firstAthletesList: [{}], //LISTA DI TUTTI GLI ATLETI POSSIBILI
            permanentAthletesList: [{}],
            name: '',
            athletesId: [], //LISTA DEGLI ATLETI A CUI STO ESPRESSAMENTE ASSEGNATO QUESTA REGOLA
            automaticAthletesId: [], //LISTA DEGLI ATLETI A CUI STO AUTOMATICAMENTE ASSEGNATO QUESTA REGOLA
            conditions: [],
            currentLink: 'and',
            currentOp: 'higher than',
            currentType: 'Calories Intake (Breakfast)',
            currentValue1: '',
            currentValue2: '',
            temporalConditions: [],
            currentTemporalLink: 'and',
            currentTemporalOp: 'starts with',
            currentTemporalItem: 'select temporal item',
            currentTemporalValue1: '',
            currentTemporalValue2: '',
            message: exampleText,
            alreadyExistingRules: [{}], //REGOLE GIÀ ESISTENTI PER POTER SETTARE IL NOME AUTOMATICO, SE SERVE
            askResult: [],
            suggestedAthletesId: []
        }
    }

    componentDidMount() {
        axios.get('/rules/' + this.props.match.params.id)
            .then(response => {
                this.setState({
                    athletesId: response.data.athletesId,
                    /* suggestedAthletesId: response.data.suggestedAthletesId, */
                    name: response.data.name,
                    message: response.data.message,
                    conditions: response.data.conditions,
                    temporalConditions: response.data.temporalConditions
                })
            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('/athletes/')
            .then(response => {
                this.setState({ firstAthletesList: response.data, permanentAthletesList: response.data })
                this.controllaNomi();
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('/rules/')
            .then(response => {
                this.setState({ alreadyExistingRules: response.data });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    controllaNomi() {
        let arr1 = this.state.athletesId;
        let arr2 = this.state.firstAthletesList;
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i] === arr2[j]._id) {
                    let replaceString = arr2[j].name + " ~ " + arr1[i];
                    arr1[i] = replaceString;
                    arr2.splice(j, 1)
                    this.setState({ firstAthletesList: arr2, athletesId: arr1 });
                }
            }
        }
    }

    ///////////////////////
    /* GENERAL  SETTINGS */
    ///////////////////////

    onAddAthleteId() {
        let newUserFull = this.myRef.current.value;
        if (newUserFull === "noneSelected") {
            window.alert("No one is selected");
            return;
        }
        let userId = newUserFull.substring(newUserFull.indexOf("~ ") + 2);
        this.setState({
            athletesId: this.state.athletesId.concat(newUserFull)
        })
        let arr1 = this.state.firstAthletesList;
        for (let j = 0; j < arr1.length; j++) {
            if (arr1[j]._id === userId) {
                arr1.splice(j, 1)
                break;
            }
        }
    }

    onAddSuggestedAthleteId(e) {
        let newUserFull = e;
        let userId = newUserFull.substring(newUserFull.indexOf("~ ") + 2);
        this.setState({
            athletesId: this.state.athletesId.concat(newUserFull)
        })
        //tolgo il nome dell'atleta aggiunto dalla lista degli atleti che si possono aggiungere
        let arr1 = this.state.firstAthletesList;
        for (let j = 0; j < arr1.length; j++) {
            if (arr1[j]._id === userId) {
                arr1.splice(j, 1)
                break;
            }
        }
    }

    onAddAllAthletesId() {
        var arrAthletes = [...this.state.firstAthletesList];
        var arrAthletesId = [...this.state.athletesId];
        while (arrAthletes.length > 0) {
            let str = arrAthletes[0].name + " ~ " + arrAthletes[0]._id;
            console.log(str)
            arrAthletesId.push(str)
            arrAthletes.splice(0, 1);
        }
        this.setState({
            firstAthletesList: arrAthletes,
            athletesId: arrAthletesId
        })
    }

    onAddAllSuggestedAthletesId() {
        var arrAthletesFromSelect = [...this.state.firstAthletesList];
        var arrAthletesAskResult = [...this.state.askResult];
        var arrAthletesId = [...this.state.athletesId];
        while (arrAthletesAskResult.length > 0) {
            let str = arrAthletesAskResult[0].name + " ~ " + arrAthletesAskResult[0]._id;
            console.log(str)
            let trovato = false;
            for (let x = 0; x < arrAthletesId.length; x++) {
                if (arrAthletesId[x] === str)
                    trovato = true
            }
            if (trovato === false)
                arrAthletesId.push(str)
            arrAthletesAskResult.splice(0, 1);
            for (let x = 0; x < arrAthletesFromSelect.length; x++) {
                if (arrAthletesFromSelect[x].name + " ~ " + arrAthletesFromSelect[x]._id === str)
                    arrAthletesFromSelect.splice(x, 1)
            }
        }
        this.setState({
            firstAthletesList: arrAthletesFromSelect,
            athletesId: arrAthletesId
        })
    }

    onRemoveAthleteId(e) {
        var athletesIDCopy = [...this.state.athletesId];
        var index = athletesIDCopy.indexOf(e)
        if (index !== -1) {
            athletesIDCopy.splice(index, 1);
            this.setState({ athletesId: athletesIDCopy });
        }
        let f = e.substring(e.indexOf("~ ") + 2);
        axios.get('/athletes/' + f)
            .then(response => {
                this.setState({ firstAthletesList: this.state.firstAthletesList.concat(response.data) })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    onRemoveAllAthletesId() {
        console.log("funzione chiamata")
        let athletesIDCopy = [...this.state.athletesId];
        while (athletesIDCopy.length > 0) {
            let str = athletesIDCopy[0];
            console.log(athletesIDCopy[0]);
            athletesIDCopy.splice(0, 1);
            let athId = str.substring(str.indexOf("~ ") + 2);
            axios.get('/athletes/' + athId)
                .then(response => {
                    this.setState({ firstAthletesList: this.state.firstAthletesList.concat(response.data) })
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        this.setState({ athletesId: athletesIDCopy });
    }

    newAthletesList() {
        return this.state.athletesId.map(currentathleteId => {
            return (
                <div
                    type="text"
                    className="p-3 mb-2 bg-light"
                    key={currentathleteId}>
                    <em>{currentathleteId}</em>
                    <button type="button" className="btn btn-outline-danger btn-sm ml-4" onClick={() => { this.onRemoveAthleteId(currentathleteId) }}>Remove</button>
                </div>
            )
        })
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        })
    }

    onChangeMessage(e) {
        this.setState({
            message: e.target.value
        })
    }


    ///////////////////////
    /* NORMAL CONDITIONS */
    ///////////////////////

    onChangeType(e) {
        if (e.target.value === "Mood") {
            document.getElementById("selectVal1").style.display = "none";
            document.getElementById("selectVal2").style.display = "none";
            document.getElementById("selectValMood").style.display = "block";
            this.setState({
                currentValue1: "Really Bad"
            })
            if (this.state.currentOp === "between") {
                document.getElementById("selectSecondValMood").style.display = "block";
                this.setState({
                    currentValue2: "Really Bad"
                })
            }
        } else {
            document.getElementById("selectValMood").style.display = "none";
            document.getElementById("selectSecondValMood").style.display = "none";
            document.getElementById("selectVal1").style.display = "block";
            if (this.state.currentOp === "between")
                document.getElementById("selectVal2").style.display = "block";
        }
        this.setState({
            currentType: e.target.value
        })
    }

    onChangeOperator(e) {
        if (e.target.value === "between") {
            if (this.state.currentType === "Mood") {
                document.getElementById("selectVal1").style.display = "none";
                document.getElementById("selectVal2").style.display = "none";
                document.getElementById("selectValMood").style.display = "block";
                document.getElementById("selectSecondValMood").style.display = "block";
            }
            else {
                document.getElementById("selectVal1").style.display = "block";
                document.getElementById("selectVal2").style.display = "block";
                document.getElementById("selectValMood").style.display = "none";
                document.getElementById("selectSecondValMood").style.display = "none";
            }
        } else {
            if (this.state.currentType === "Mood") {
                document.getElementById("selectVal1").style.display = "none";
                document.getElementById("selectVal2").style.display = "none";
                document.getElementById("selectValMood").style.display = "block";
                document.getElementById("selectSecondValMood").style.display = "none";
            } else {
                document.getElementById("selectVal1").style.display = "block";
                document.getElementById("selectVal2").style.display = "none";
                document.getElementById("selectValMood").style.display = "none";
                document.getElementById("selectSecondValMood").style.display = "none";
            }
            this.setState({
                currentValue2: ""
            })
        }
        this.setState({
            currentOp: e.target.value
        })
    }

    onChangeValue1Condition(e) {
        this.setState({
            currentValue1: e.target.value
        })
    }

    onChangeValue2Condition(e) {
        this.setState({
            currentValue2: e.target.value
        })
    }

    onChangelink(e) {
        this.setState({
            currentLink: e.target.value
        })
    }

    onAddCondition(e) {
        // CREARE COMPONENTI DELLA CONDIZIONE
        if (this.state.currentValue1 === "") {
            alert("Insert at least one value in the condition!")
            return;
        }
        if (this.state.currentOp === "between" && (this.state.currentValue1 === "" || this.state.currentValue2 === "")) {
            alert("If you select between operation, you must also insert two valid values!")
            return;
        }
        let newCondition = {
            link: this.state.currentLink,
            operator: this.state.currentOp,
            type: this.state.currentType,
            value1: this.state.currentValue1,
            value2: this.state.currentValue2
        }
        //AGGIORNARE LO STATE DELLE CONDIZIONI
        this.setState({
            conditions: this.state.conditions.concat(newCondition)
        })
    }

    onRemoveCondition(a, b, c, d) {
        var conditionsCopy = [...this.state.conditions];
        for (let i = 0; i < conditionsCopy.length; i++) {
            if (conditionsCopy[i].type === a && conditionsCopy[i].op === b && conditionsCopy[i].value1 === c && conditionsCopy[i].value2 === d) {
                conditionsCopy.splice(i, 1);
                this.setState({ conditions: conditionsCopy });
            }
        }
        this.filterAthletes();
    }

    ///////////////////////
    //* ASK TO DATABASE *//
    ///////////////////////

    componentDidUpdate(prevProps, prevState) {
        if (prevState.conditions !== this.state.conditions) {
            this.filterAthletes();
        }
    }

    filterAthletes() {
        //QUA CERCO DI CAPIRE QUALI ATLETI RIENTRANO NELLE CONDIZIONI RICHIESTE.
        let condizioni = this.state.conditions;

        if (condizioni.length === 0) {
            this.setState({ askResult: [] });
            return;
        }

        for (let p = 0; p < condizioni.length; p++) {
            let tipo = condizioni[p].type;
            let operatore = condizioni[p].operator;
            let valore1 = condizioni[p].value1;
            let valore2 = condizioni[p].value2;
            let link = condizioni[p].link;
            let whereToSearch = "";
            let comparison = "";
            // WHERE TO SEARCH
            //CASO 1
            if (tipo === "Calories Intake (Breakfast)") whereToSearch = "mfp.CaloriesBreakfast";
            if (tipo === "Calories Intake (Lunch)") whereToSearch = "mfp.CaloriesLunch";
            if (tipo === "Calories Intake (Dinner)") whereToSearch = "mfp.CaloriesDinner";
            if (tipo === "Calories Intake (Snacks)") whereToSearch = "mfp.CaloriesSnacks";
            if (tipo === "Carbs (g)") whereToSearch = "mfp.Carbs_g";
            if (tipo === "Fat (g)") whereToSearch = "mfp.Fat_g";
            if (tipo === "Protein (g)") whereToSearch = "mfp.Protein_g";
            if (tipo === "Cholesterol (mg)") whereToSearch = "mfp.Cholest_mg";
            if (tipo === "Sodium (mg)") whereToSearch = "mfp.Sodium_mg";
            if (tipo === "Sugars (g)") whereToSearch = "mfp.Sugars_g";
            if (tipo === "Fibre (g)") whereToSearch = "mfp.Fiber_g";
            //CASO 2
            if (tipo === "Mood") whereToSearch = "mood.Mood";
            //CASO 3
            if (tipo === "Bed exits") whereToSearch = "sleep.NumeroDiRisvegli";
            if (tipo === "Sleep minutes") whereToSearch = "sleep.MinutiDiSonno";
            if (tipo === "Sleep latency") whereToSearch = "sleep.DurataDelRiposo";
            if (tipo === "Sleep awakening") whereToSearch = "sleep.MinutiDiVeglia";
            //CASO 4
            if (tipo === "Burned calories") whereToSearch = "activity.CalorieBruciate";
            if (tipo === "Activity duration") whereToSearch = "activity.MinutiDiAttivitàIntensa";
            if (tipo === "Activity distance") whereToSearch = "activity.Distanza";
            if (tipo === "Steps") whereToSearch = "activity.Passi";

            // WHAT IS THE OPERATOR?
            if (operatore === "equal to") comparison = "===";
            if (operatore === "not equal to") comparison = "!==";
            if (operatore === "higher than") comparison = ">";
            if (operatore === "lower than") comparison = "<";
            if (operatore === "between") comparison = "><";

            // THE FIRST VALUE
            let val1 = null;
            if (tipo !== "Mood")
                val1 = parseFloat(valore1)
            else {
                if (valore1 === "Really Good") val1 = 4
                if (valore1 === "Good") val1 = 3
                if (valore1 === "Normal") val1 = 2
                if (valore1 === "Bad") val1 = 1
                if (valore1 === "Really Bad") val1 = 0
            }


            // THE SECOND VALUE
            let val2 = null;
            if (valore2 !== "") {
                if (tipo === "Mood") {
                    if (valore2 === "Really Good") val2 = 4
                    if (valore2 === "Good") val2 = 3
                    if (valore2 === "Normal") val2 = 2
                    if (valore2 === "Bad") val2 = 1
                    if (valore2 === "Really Bad") val2 = 0
                } else {
                    val2 = parseFloat(valore2);
                }
            }

            // ===> ORA VALUTO SE LA CONDIZIONE IN QUESTIONE È VERA O MENO! <=== //

            const condition = {
                tipo: whereToSearch,
                op: comparison,
                value1: val1,
                value2: val2
            }

            axios.post('/athletes/ask', condition)
                .then(response => {
                    if (this.state.conditions.length === 1) {
                        this.setState({ askResult: response.data });
                        return;
                    } else if (link === "and") {
                        /* response.data = (response.data).filter(el => el === this.state.askResult) */
                        let filtered = [];
                        let arrAskResult = this.state.askResult;
                        (response.data).filter(function (newData) {
                            return arrAskResult.filter(function (oldData) {
                                if (newData._id === oldData._id) {
                                    filtered.push(newData)
                                }
                            })
                        });
                        this.setState({ askResult: filtered });
                    } else if (link === "or") {
                        let fusion = this.state.askResult.concat(response.data);
                        for (let i = 0; i < fusion.length; i++) {
                            for (let n = 0; n < fusion.length; n++) {
                                if (i !== n && fusion[i]._id === fusion[n]._id) {
                                    fusion.splice(n, 1);
                                    n--;
                                }
                            }
                        }
                        console.log("fusion:")
                        console.log(fusion)
                        this.setState({ askResult: fusion })
                        console.log("this.state.askResult: " + this.state.askResult)
                    }
                })
                .catch(err => console.log(err))
        }
    }

    putButtonOrNot(nameAndId) {
        console.log("ho chiamato la funzione")
        let arr1 = this.state.firstAthletesList;
        for (let x = 0; x < arr1.length; x++) {
            if (arr1[x].name + " ~ " + arr1[x]._id === nameAndId) {
                return (
                    <input type="button"
                        className="btn btn-outline-success ml-4"
                        value="Add"
                        onClick={() => { this.onAddSuggestedAthleteId(nameAndId) }} />
                )
            }
        } return;
    }

    showSuggestedAthletes() {

        if (this.state.conditions.length === 0) return;

        if (this.state.conditions.length > 0 && this.state.askResult.length === 0) {
            return (
                <div className="container mt-3 py-3 text-dark rounded">
                    <b>No Suggested Athletes</b>
                </div>
            )
        }

        if (this.state.askResult.length > 0) {
            return (
                <div>
                    <div className="container mt-3 py-3 text-dark rounded">
                        <b>Suggested Athletes:</b>
                        <button type="button"
                            className="btn btn-outline-success mt-n2 mr-3 float-right"
                            onClick={() => { this.onAddAllSuggestedAthletesId() }}>
                            Add All
                        </button>
                    </div>

                    {this.state.askResult.map((currentResult, index) => {
                        return (
                            <div className=" bg-light p-3 mb-2" key={currentResult._id}>
                                <em>{currentResult.name + " ~ " + currentResult._id}</em>
                                {this.putButtonOrNot(currentResult.name + " ~ " + currentResult._id)}
                            </div>
                        )
                    })
                    }
                </div>
            )
        }
    }

    newConditionsList() {
        if (this.state.conditions.length === 0) {
            try {
                document.getElementById("linkSelection").style.display = "none";
            } catch (error) {
                //console.log("errore con lenght pari a 0! "+error)
            }
        } else {
            try {
                document.getElementById("linkSelection").style.display = "block";
            } catch (error) {
                //console.log("errore con lenght diversa da 0! "+error)
            }
        }

        return this.state.conditions.map((currentCondition, index) => {
            return (
                <span>
                    <div
                        type="text"
                        className="p-3 mb-2 bg-light"
                        key={currentCondition.type + currentCondition.value1}>
                        {index === 0 ? ("    ") : (<b><em>{currentCondition.link + " "}</em></b>)}
                        <em>{currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}</em>
                        <button type="button" className="btn btn-outline-danger btn-sm ml-4" onClick={() => { this.onRemoveCondition(currentCondition.type, currentCondition.op, currentCondition.value1, currentCondition.value2) }}>Remove</button>
                    </div>
                </span>
            )
        })
    }


    /////////////////////////
    /* TEMPORAL CONDITIONS */
    /////////////////////////

    onChangeTemporalItem(e) {
        if (e.target.value === this.state.currentTemporalValue1) {
            this.setState({
                currentTemporalValue1: ""
            })
        }
        this.setState({
            currentTemporalItem: e.target.value
        })
    }

    onChangeTemporalOperator(e) {
        if (e.target.value === "starts between" || e.target.value === "ends between") {
            document.getElementById("selectTemporalVal2").style.display = "block";
        } else {
            document.getElementById("selectTemporalVal2").style.display = "none";
            this.setState({
                currentTemporalValue2: ""
            })
        }
        this.setState({
            currentTemporalOp: e.target.value
        })
    }

    onChangeValue1TemporalCondition(e) {
        if (e.target.value === this.state.currentTemporalValue2) {
            this.setState({
                currentTemporalValue2: ""
            })
        }
        this.setState({
            currentTemporalValue1: e.target.value
        })
    }

    onChangeValue2TemporalCondition(e) {
        this.setState({
            currentTemporalValue2: e.target.value
        })
    }

    onChangeTemporalLink(e) {
        this.setState({
            currentTemporalLink: e.target.value
        })
    }

    onAddTemporalCondition() {
        // CREARE COMPONENTI DELLA CONDIZIONE TEMPORALE
        if (this.state.currentTemporalItem === "select temporal item") {
            alert("You have to choose temporal item to make comparison!")
            return;
        }
        if (this.state.currentTemporalValue1 === "") {
            alert("Insert at least one value in the temporal condition!")
            return;
        }
        if ((this.state.currentTemporalOp === "starts between" || this.state.currentTemporalOp === "ends between") && (this.state.currentTemporalValue1 === "" || this.state.currentTemporalValue2 === "")) {
            alert("If you select between operation, you must also insert two values!")
            return;
        }
        let newTemporalCondition = {
            temporalLink: this.state.currentTemporalLink,
            temporalOperator: this.state.currentTemporalOp,
            temporalItem: this.state.currentTemporalItem,
            temporalValue1: this.state.currentTemporalValue1,
            temporalValue2: this.state.currentTemporalValue2
        }
        console.log(newTemporalCondition);
        //AGGIORNARE LO STATE DELLE CONDIZIONI
        this.setState({
            temporalConditions: this.state.temporalConditions.concat(newTemporalCondition)
        })
    }

    onRemoveTemporalCondition(a, b, c, d) {
        var temporalConditionsCopy = [...this.state.temporalConditions];
        for (let i = 0; i < temporalConditionsCopy.length; i++) {
            if (temporalConditionsCopy[i].temporalItem === a && temporalConditionsCopy[i].temporalOperator === b && temporalConditionsCopy[i].temporalValue1 === c && temporalConditionsCopy[i].temporalValue2 === d) {
                temporalConditionsCopy.splice(i, 1);
                this.setState({ temporalConditions: temporalConditionsCopy });
            }
        }
    }

    newTemporalConditionsList() {
        if (this.state.temporalConditions.length === 0) {
            try {
                document.getElementById("temporalLinkSelection").style.display = "none";
            } catch (error) {
                //console.log("errore con lenght pari a 0! "+error)
            }
        } else {
            try {
                document.getElementById("temporalLinkSelection").style.display = "block";
            } catch (error) {
                //console.log("errore con lenght diversa da 0! "+error)
            }
        }

        return this.state.temporalConditions.map((currentTemporalCondition, index) => {
            return (
                <span>
                    <div
                        type="text"
                        className="p-3 mb-2 bg-light"
                        key={currentTemporalCondition.temporalItem + currentTemporalCondition.temporalOperator + currentTemporalCondition.temporalValue1 + currentTemporalCondition.temporalValue2}>
                        {index === 0 ? ("    ") : (<b><em>{currentTemporalCondition.temporalLink + " "}</em></b>)}
                        <em>{`"` + currentTemporalCondition.temporalItem + `" `}<b>{currentTemporalCondition.temporalOperator}</b>{` "` + currentTemporalCondition.temporalValue1 + `" ` + (currentTemporalCondition.temporalValue2 === "" ? "" : (`and "` + currentTemporalCondition.temporalValue2 + `"`))}</em>
                        <button type="button" className="btn btn-outline-danger btn-sm ml-4" onClick={() => { this.onRemoveTemporalCondition(currentTemporalCondition.temporalItem, currentTemporalCondition.temporalOperator, currentTemporalCondition.temporalValue1, currentTemporalCondition.temporalValue2) }}>Remove</button>
                    </div>
                </span>
            )
        })
    }

    onSubmit(e) {
        e.preventDefault();

        let suggestedAthletesId = [];

        if (this.state.conditions.length === 0) {
            alert("Insert at least one condition!");
            return;
        }

        try {
            //TOLGO IL LINK DALLA PRIMA CONDITION, PERCHÈ NON SERVE
            let conditions = [...this.state.conditions];
            let condition = conditions[0];
            condition.link = "";
            conditions[0] = condition;
            this.setState({ conditions });

            //TOLGO IL NOME DAGLI ATHLETES ID
            let athletesId = [...this.state.athletesId];
            for (let p = 0; p < athletesId.length; p++) {
                let athID = athletesId[p];
                if (athID.indexOf("~") !== -1)
                    athID = athID.substring(athID.indexOf("~") + 2);
                athletesId[p] = athID;
            }
            this.state.athletesId = athletesId;


            for (let x = 0; x < this.state.askResult.length; x++) {
                let str = this.state.askResult[x].name + " ~ " + this.state.askResult[x]._id;
                suggestedAthletesId.push(str);
            }
            this.state.suggestedAthletesId = suggestedAthletesId;

        } catch (error) {
            console.log("errore onSubmit");
        }

        try {
            //TOLGO IL LINK DALLA PRIMA TEMPORAL CONDITION, PERCHÈ NON SERVE
            let temporalConditions = [...this.state.temporalConditions];
            let temporalCondition = temporalConditions[0];
            temporalCondition.temporalLink = "";
            temporalConditions[0] = temporalCondition;
            this.setState({ temporalConditions });
        } catch (error) {
            console.log("errore onSubmit");
        }


        //SE IL NOME NON È GIÀ SETTATO
        if (this.state.name === "") {
            //SE VOGLIO CHE VENGA SETTATO UN NOME GENERATO AUTOMATICAMENTE
            if (window.confirm(`Name not setted. 
Do you want to automatically set name?`)) {
                let arrRules = [...this.state.alreadyExistingRules]
                let numberRule = -1;
                for (let x = 0; x < arrRules.length; x++) {
                    let nomeRule = arrRules[x].name;
                    if (nomeRule.indexOf("Automatic_Rule_Name_") > -1) {
                        let n = nomeRule.substr(20)
                        numberRule = parseInt(n) + 1;
                    }
                }
                if (numberRule === -1) numberRule = 0
                let nuovoNome = "Automatic_Rule_Name_" + numberRule;
                this.state.name = nuovoNome; //IL METODO THIS.SETSTATE PER QUALCHE MOTIVO NON FUNZIONA!!! DA RISOLVERE POSSIBILMENTE!

                const rule = {
                    name: this.state.name,
                    athletesId: this.state.athletesId,
                    suggestedAthletesId: this.state.suggestedAthletesId,
                    conditions: this.state.conditions,
                    temporalConditions: this.state.temporalConditions,
                    message: this.state.message
                }

                axios.post('/rules/update/' + this.props.match.params.id, rule)
                    .then(res => alert("Rule updated!"))
            } else {//ALTRIMENTI ESCO COSÌ L'UTENTE PUÒ SETTARE IL NOME CHE VUOLE
                return;
            }
        } else {
            //SE IL NOME È GIÀ SETTATO
            const rule = {
                name: this.state.name,
                athletesId: this.state.athletesId,
                suggestedAthletesId: this.state.suggestedAthletesId,
                conditions: this.state.conditions,
                temporalConditions: this.state.temporalConditions,
                message: this.state.message
            }

            axios.post('/rules/update/' + this.props.match.params.id, rule)
                .then(res => {
                    alert("Rule updated!");
                })
        }
        this.controllaNomi();
    }


    //////////////////////////////
    /*----------RENDER----------*/
    //////////////////////////////

    render() {
        return (
            <div>
                <h3 className="mb-4">Edit rule</h3>
                <form onSubmit={this.onSubmit}>


                    <div className="h4 text-center mb-3 p-3 rounded text-white bg-info">1 ~ General settings</div>
                    <div className="form-group">
                        <h6><label>Rule Name</label></h6>
                        <input type="text"
                            className="col-sm-12 col-md-12 col-lg-12 col-xl-12 form-control mb-3"
                            value={this.state.name}
                            onChange={this.onChangeName} />

                        <h6><label>Express Athletes ID</label></h6>
                        {this.newAthletesList()}
                        <div type="text"
                            className="mb-2 form-inline mb-3">
                            <select required
                                className="form-control col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 mr-4 mb-3 mb-sm-0"
                                ref={this.myRef}>
                                <option
                                    value="noneSelected">
                                    You can choose an athlete if you want
                                    </option>
                                {
                                    this.state.firstAthletesList.map(
                                        currentAthlete => {
                                            return <option
                                                key={currentAthlete._id}
                                                value={currentAthlete.name + " ~ " + currentAthlete._id}>{currentAthlete.name + " ~ " + currentAthlete._id}
                                            </option>
                                        }
                                    )
                                }
                            </select>
                            <button type="button"
                                className="btn btn-success"
                                onClick={() => { this.onAddAthleteId() }}>
                                Add
                            </button>
                            <button type="button"
                                className="btn btn-outline-success ml-4"
                                onClick={() => { this.onAddAllAthletesId() }}>
                                Add All
                            </button>
                            <button type="button"
                                className="btn btn-outline-danger ml-4"
                                onClick={() => { this.onRemoveAllAthletesId() }}>
                                Remove All
                            </button>
                        </div>

                        <h6><label>Message</label></h6>
                        <textarea className="col-sm-12 col-md-12 col-lg-12 col-xl-12 form-control mb-3"
                            id="formControlTextarea1"
                            required
                            rows="4"
                            value={this.state.message}
                            onChange={this.onChangeMessage}></textarea>
                    </div>


                    <div className="h4 text-center mt-5 mb-3 p-3 rounded text-white bg-info">2 ~ Conditions</div>

                    <div className="form-group">
                        <h6><label>Setted Conditions</label></h6>
                        {this.newConditionsList()}
                        <span id="linkSelection">
                            <select className="form-control col-4 col-sm-4 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                                id="selectLink"
                                title="Scegli una opzione"
                                defaultValue="and"
                                onChange={this.onChangelink}>
                                <option value="and">AND</option>
                                <option value="or">OR</option>
                            </select>
                        </span>
                        <div className="form-inline mt-2">
                            <select className="form-control col-sm-12 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                                id="selectCondition"
                                title="Scegli una opzione"
                                onChange={this.onChangeType}>
                                <option value="Calories Intake (Breakfast)">Calories Intake - Breakfast (Kcal)</option>
                                <option value="Calories Intake (Lunch)">Calories Intake - Lunch (Kcal)</option>
                                <option value="Calories Intake (Dinner)">Calories Intake - Dinner (Kcal)</option>
                                <option value="Calories Intake (Snacks)">Calories Intake - Snacks (Kcal)</option>
                                <option value="Carbs (g)">Carbs (g)</option>
                                <option value="Fat (g)">Fat (g)</option>
                                <option value="Protein (g)">Protein (g)</option>
                                <option value="Cholesterol (mg)">Cholesterol (mg)</option>
                                <option value="Sodium (mg)">Sodium (mg)</option>
                                <option value="Sugars (g)">Sugars (g)</option>
                                <option value="Fibre (g)">Fibre (g)</option>
                                <option value="Mood">Mood</option>
                                <option value="Sleep minutes">Sleep minutes</option>
                                <option value="Sleep latency">Sleep latency (minutes)</option>
                                <option value="Sleep awakening">Sleep awakenings (number)</option>
                                <option value="Activity duration">Activity duration (minutes)</option>
                                <option value="Activity distance">Activity distance (km)</option>
                                <option value="Burned calories">Burned calories (Kcal)</option>
                                <option value="Steps">Steps (number)</option>
                            </select> <span className="mr-4">is</span>
                            <select className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mr-4 my-2"
                                id="selectOp"
                                onChange={this.onChangeOperator}>
                                <option value="higher than"> &gt; higher than</option>
                                <option value="lower than"> &lt; lower than</option>
                                <option value="between"> &gt; &lt; between</option>
                                <option value="equal to"> = equal to</option>
                                <option value="not equal to"> &ne; not equal to</option>
                            </select>
                            {/* primo valore */}
                            <input type="number"
                                className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mr-4 my-2"
                                id="selectVal1"
                                value={this.state.value1}
                                onChange={this.onChangeValue1Condition}
                            ></input>
                            {/* secondo valore */}
                            <input type="number"
                                className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mr-4 my-2"
                                id="selectVal2"
                                value={this.state.value2}
                                onChange={this.onChangeValue2Condition}
                            ></input>
                            {/*primo valore nel caso si parli di mood */}
                            <select className="form-control col-sm-12 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                                id="selectValMood"
                                title="Scegli una opzione"
                                onChange={this.onChangeValue1Condition}>
                                <option value="Really Bad">Really Bad</option>
                                <option value="Bad">Bad</option>
                                <option value="Normal">Normal</option>
                                <option value="Good">Good</option>
                                <option value="Really Good">Really Good</option>
                            </select>
                            {/*secondo valore nel caso si parli di mood */}
                            <select className="form-control col-sm-12 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                                id="selectSecondValMood"
                                title="Scegli una opzione"
                                onChange={this.onChangeValue2Condition}>
                                <option value="Really Bad">Really Bad</option>
                                <option value="Bad">Bad</option>
                                <option value="Normal">Normal</option>
                                <option value="Good">Good</option>
                                <option value="Really Good">Really Good</option>
                            </select>

                            <button type="button"
                                className="btn btn-success mr-4 my-2"
                                onClick={() => { this.onAddCondition() }}>
                                Add
                            </button>
                        </div>
                        {this.showSuggestedAthletes()}
                    </div>


                    <div className="h4 text-center mt-5 mb-3 p-3 rounded text-white bg-info">3 ~ Temporal conditions</div>

                    <div className="form-group mb-3">
                        <h6><label>Temporal Conditions</label></h6>
                        {this.newTemporalConditionsList()}
                        <span id="temporalLinkSelection">
                            <select className="form-control col-4 col-sm-4 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                                id="selectTemporalLink"
                                title="Scegli una opzione"
                                defaultValue="and"
                                onChange={this.onChangeTemporalLink}>
                                <option value="and">AND</option>
                                <option value="or">OR</option>
                            </select>
                        </span>
                        <div className="form-inline mt-2">
                            <select className="form-control col-sm-12 col-md-4 col-lg-4 col-xl-4 mr-4 my-2"
                                id="selectTemporalCondition"
                                title="Scegli una opzione"
                                onChange={this.onChangeTemporalItem}>
                                <option value="select temporal item">Select temporal item...</option>
                                {this.state.conditions.map(currentCondition => {
                                    return (
                                        <option value={currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                            key={currentCondition.type + currentCondition.operator + currentCondition.value1 + currentCondition.value2}>
                                            {currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                        </option>
                                    )
                                })}
                            </select>
                            <select className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mr-4 my-2"
                                id="selectOpTemporal"
                                onChange={this.onChangeTemporalOperator}>
                                <option value="starts with"> starts with</option>
                                <option value="starts before"> starts before</option>
                                <option value="starts after"> starts after</option>
                                <option value="starts between"> starts between</option>
                                <option value="ends with"> ends with</option>
                                <option value="ends before"> ends before</option>
                                <option value="ends after"> ends after</option>
                                <option value="ends between"> ends between</option>
                            </select>
                            {/* primo valore */}
                            <select
                                className="form-control col-sm-12 col-md-4 col-lg-4 col-xl-4 mr-4 my-2"
                                id="selectTemporalVal1"
                                title="Choose first element"
                                onChange={this.onChangeValue1TemporalCondition}>
                                <option value="">Select first element...</option>
                                {(this.state.conditions.filter(el => el.type + " is " + el.operator + " " + el.value1 + (el.value2 === "" ? "" : (" and " + el.value2)) !== this.state.currentTemporalItem)).map(currentCondition => {
                                    return (
                                        <option value={currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                            key={currentCondition.type + currentCondition.operator + currentCondition.value1 + currentCondition.value2}>
                                            {currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                        </option>
                                    )
                                })}
                            </select>
                            {/* secondo valore */}
                            <select
                                className="form-control col-sm-12 col-md-4 col-lg-4 col-xl-4 mr-4 my-2"
                                id="selectTemporalVal2"
                                title="select second element"
                                onChange={this.onChangeValue2TemporalCondition}>
                                <option value="">Select second element...</option>
                                {(this.state.conditions.filter(el => el.type + " is " + el.operator + " " + el.value1 + (el.value2 === "" ? "" : (" and " + el.value2)) !== this.state.currentTemporalItem && el.type + " is " + el.operator + " " + el.value1 + (el.value2 === "" ? "" : (" and " + el.value2)) !== this.state.currentTemporalValue1)).map(currentCondition => {
                                    return (
                                        <option value={currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                            key={currentCondition.type + currentCondition.operator + currentCondition.value1}>
                                            {currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                        </option>
                                    )
                                })}
                            </select>
                            <button type="button"
                                className="btn btn-success mr-4 my-2"
                                onClick={() => { this.onAddTemporalCondition() }}>
                                Add
                            </button>
                        </div>
                    </div>


                    <div className="my-4 text-center">
                        <input type="submit"
                            value="Update Rule"
                            className="btn btn-primary btn-lg">
                        </input>
                    </div>

                </form>
            </div>
        )
    }
}
