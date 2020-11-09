import React, { Component } from 'react';
import axios from 'axios';
import Emoji from 'a11y-react-emoji'
let exampleText = `You should:
        - first tip
        - second tip
        - ...
        `

export default class AddRule extends Component {
    constructor(props) {
        super(props);

        this.onAddAthleteId = this.onAddAthleteId.bind(this);
        this.onRemoveAthleteId = this.onRemoveAthleteId.bind(this);
        this.onAddCondition = this.onAddCondition.bind(this);
        this.onRemoveCondition = this.onRemoveCondition.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeOperator = this.onChangeOperator.bind(this);
        this.onChangeValue1Condition = this.onChangeValue1Condition.bind(this);
        this.onChangeValue2Condition = this.onChangeValue2Condition.bind(this);
        this.onChangelink = this.onChangelink.bind(this);
        //this.filterAthletes = this.filterAthletes.bind(this);
        this.onChangeTemporalItem = this.onChangeTemporalItem.bind(this);
        this.onChangeTemporalOperator = this.onChangeTemporalOperator.bind(this);
        this.onChangeValue1TemporalCondition = this.onChangeValue1TemporalCondition.bind(this);
        this.onChangeValue2TemporalCondition = this.onChangeValue2TemporalCondition.bind(this);
        this.onChangeTemporalLink = this.onChangeTemporalLink.bind(this);
        this.onAddTemporalCondition = this.onAddTemporalCondition.bind(this);
        this.onRemoveTemporalCondition = this.onRemoveTemporalCondition.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

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
            currentOp: 'equal to',
            currentType: 'Calories Intake (All Day)',
            currentValue1: '',
            currentValue2: '',
            temporalConditions: [],
            currentTemporalLink: 'and',
            currentTemporalOp: 'starts with',
            currentTemporalItem: 'select temporal item',
            currentTemporalValue1: '',
            currentTemporalValue2: '',
            message: exampleText,
            alreadyExistingRules: [{}] //REGOLE GIÀ ESISTENTI PER POTER SETTARE IL NOME AUTOMATICO, SE SERVE
        }
    }

    componentDidMount() {
        axios.get('/athletes/')
            .then(response => {
                this.setState({ firstAthletesList: response.data, permanentAthletesList: response.data })
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

    onAddAthleteId() {
        let newUserFull = this.myRef.current.value;
        let userId = newUserFull.substring(newUserFull.indexOf("~ ") + 2);
        if (newUserFull === "noneSelected") {
            window.alert("No one is selected");
            return;
        }
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
    }

    /*     componentDidUpdate(prevProps, prevState) {
            if (prevState.conditions !== this.state.conditions) {
                this.filterAthletes();
            }
          }
    
        filterAthletes(){
            console.log("sono dentro la funzione")
            //QUA CERCO DI CAPIRE QUALI ATLETI RIENTRANO NELLE CONDIZIONI RICHIESTE.
            let condizioni=this.state.conditions;
            let atleti=this.state.permanentAthletesList;
            for(let j=0; j<atleti.length; j++){        
                for(let i=0; i<condizioni.length; i++){
                    let tipo=condizioni[i].type;
                    let operatore=condizioni[i].operator;
                    let valore1=condizioni[i].value1;
                    let valore2=condizioni[i].value2;
                    let link=condizioni[i].link;
                    console.log(tipo+" "+operatore+" "+valore1+" "+valore2+" "+link);
                    let whereToSearch="";
                    let comparison="";
                    // WHERE TO SEARCH
                        //CASO 1
                    if(tipo==="Calories Intake (All Day)"||tipo==="Calories Intake (Breakfast)"||tipo==="Calories Intake (Lunch)"||tipo==="Calories Intake (Dinner)"||tipo==="Carbs (g)"||tipo==="Fat (g)"||tipo==="Protein (g)"||tipo==="Cholesterol (mg)"||tipo==="Sodium (mg)"||tipo==="Sugars (g)"||tipo==="Fibre (g)")
                        whereToSearch="mfp";
                        //CASO 2
                    if(tipo==="Mood") whereToSearch="mood";
                        //CASO 3
                    if(tipo==="Bed exits"||tipo==="Sleep hours"||tipo==="Sleep latency"||tipo==="Sleep awakening") whereToSearch="sleep";
                        //CASO 4
                    if(tipo==="Burned calories"||tipo==="Activity duration"||tipo==="Activity distance"||tipo==="Steps") whereToSearch="activity";
                        //VEDIAMO COSA È USCITO FUORI
                    console.log("lo switch ha dato questo risultato: "+whereToSearch)
                    
                    // WHAT IS THE OPERATOR?
                    if(tipo==="equal to")           comparison="===";
                    if(tipo==="not equal to")       comparison="!==";
                    if(tipo==="higher than")        comparison=">";
                    if(tipo==="lower than")         comparison="<";
                    if(tipo==="between")            comparison="><";
    
                    //THE FIRST VALUE
                    let val1=parseFloat(valore1)
    
                    //THE SECOND VALUE
                    let val2=null;
                    if(valore2!=="") val2=parseFloat(valore2)
                    
                    // ===> ORA VALUTO SE LA CONDIZIONE IN QUESTIONE È VERA O MENO! <=== //
    
                    
                }
            }
        } */


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
                    conditions: this.state.conditions,
                    temporalConditions: this.state.temporalConditions,
                    message: this.state.message
                }

                axios.post('/rules/add/', rule)
                    .then(res => alert("Rule added!"))
            } else {//ALTRIMENTI ESCO COSÌ L'UTENTE PUÒ SETTARE IL NOME CHE VUOLE
                return;
            }
        } else {
            //SE IL NOME È GIÀ SETTATO
            const rule = {
                name: this.state.name,
                athletesId: this.state.athletesId,
                conditions: this.state.conditions,
                temporalConditions: this.state.temporalConditions,
                message: this.state.message
            }

            axios.post('/rules/add/', rule)
                .then(res => {
                    alert("Rule added!");
                })
        }

    }

    render() {
        return (
            <div>
                <h3 className="mb-4">Create new rule</h3>
                <form onSubmit={this.onSubmit}>

                    <div className="h4 text-center p-3 rounded text-white bg-info">1 ~ General settings</div>
                    <div className="form-group">
                        <h6><label>Rule Name</label></h6>
                        <input type="text"
                            className="col-sm-12 col-md-12 col-lg-12 col-xl-12 form-control"
                            value={this.state.name}
                            onChange={this.onChangeName}
                        ></input>
                    </div>

                    <div className="form-group">
                        <h6><label>Express Athletes ID</label></h6>
                        {this.newAthletesList()}
                        <div
                            type="text"
                            className="mb-2 form-inline">
                            <select required
                                className="form-control col-8 col-sm-6 col-md-6 col-lg-6 col-xl-6 mr-4"
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
                                class="btn btn-success"
                                onClick={() => { this.onAddAthleteId() }}>
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <h6><label>Message</label></h6>
                        <textarea className="col-sm-12 col-md-12 col-lg-12 col-xl-12 form-control"
                            id="formControlTextarea1"
                            required
                            rows="4"
                            value={this.state.message}
                            onChange={this.onChangeMessage}></textarea>
                    </div>


                    <div className="h4 text-center mt-5 p-3 rounded text-white bg-info">2 ~ Conditions</div>

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
                                <option value="Calories Intake (All Day)">Calories Intake - All Day (Kcal)</option>
                                <option value="Calories Intake (Breakfast)">Calories Intake - Breakfast (Kcal)</option>
                                <option value="Calories Intake (Lunch)">Calories Intake - Lunch (Kcal)</option>
                                <option value="Calories Intake (Dinner)">Calories Intake - Dinner (Kcal)</option>
                                <option value="Carbs (g)">Carbs (g)</option>
                                <option value="Fat (g)">Fat (g)</option>
                                <option value="Protein (g)">Protein (g)</option>
                                <option value="Cholesterol (mg)">Cholesterol (mg)</option>
                                <option value="Sodium (mg)">Sodium (mg)</option>
                                <option value="Sugars (g)">Sugars (g)</option>
                                <option value="Fibre (g)">Fibre (g)</option>
                                <option value="Mood">Mood</option>
                                <option value="Sleep hours">Sleep hours</option>
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
                                <option value="equal to"> = equal to</option>
                                <option value="not equal to"> &ne; not equal to</option>
                                <option value="between"> &gt; &lt; between</option>
                                <option value="higher than"> &gt; higher than</option>
                                <option value="lower than"> &lt; lower than</option>
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
                                class="btn btn-success mr-4 my-2"
                                onClick={() => { this.onAddCondition() }}>
                                Add
                            </button>
                        </div>
                        <div className="mt-3 bg-warning text-dark rounded">
                        </div>
                    </div>


                    <div className="h4 text-center mt-5 p-3 rounded text-white bg-info">3 ~ Temporal conditions</div>

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
                                class="btn btn-success mr-4 my-2"
                                onClick={() => { this.onAddTemporalCondition() }}>
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="my-4 text-center">
                        <input type="submit"
                            value="Create Rule"
                            className="btn btn-primary btn-lg">
                        </input>
                    </div>
                </form>
            </div>
        )
    }
}
