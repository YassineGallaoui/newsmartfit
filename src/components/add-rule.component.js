import React, {Component} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusSquare, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
let exampleText=`You should:
        - first tip
        - second tip
        - ...
        `

export default class AddRule extends Component{
    constructor(props){
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
        this.onSubmit = this.onSubmit.bind(this);

        this.myRef=React.createRef();
        this.myRef2=React.createRef();
        
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

    onAddAthleteId(){
        let newUserFull = this.myRef.current.value;
        let userId=newUserFull.substring(newUserFull.indexOf("~ ")+2);
        if(newUserFull==="noneSelected") {
            window.alert("No one is selected");
            return;
        }
        this.setState({
            athletesId: this.state.athletesId.concat(newUserFull)
        })
        let arr1=this.state.firstAthletesList;
        for(let j=0; j<arr1.length; j++){
            if(arr1[j]._id===userId) {
                arr1.splice(j, 1)
                break;
            }
        }
    }

    onRemoveAthleteId(e){
        var athletesIDCopy = [...this.state.athletesId];
        var index = athletesIDCopy.indexOf(e)
        if (index !== -1) {
            athletesIDCopy.splice(index, 1);
            this.setState({athletesId: athletesIDCopy});
        }
        let f= e.substring(e.indexOf("~ ")+2);
        axios.get('/athletes/'+f)
            .then(response => {
                this.setState({ firstAthletesList: this.state.firstAthletesList.concat(response.data) })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    onChangeName(e){
        this.setState({
            name: e.target.value
        })
    }

    onChangeMessage(e){
        this.setState({
            message: e.target.value
        })
    }

    onChangeType(e){
        this.setState({
            currentType: e.target.value
        })
    }

    onChangeOperator(e){
        if(e.target.value==="between")
            document.getElementById("selectVal2").style.display="block";
        else {
            document.getElementById("selectVal2").style.display="none";
            this.setState({
                currentValue2: ""
            })
        }
        this.setState({
            currentOp: e.target.value
        })
        console.log("Valore ricevuto: "+e);
        console.log("Valore settato: "+this.state.currentOp);
    }

    onChangeValue1Condition(e){
        this.setState({
            currentValue1: e.target.value
        })
    }

    onChangeValue2Condition(e){
        this.setState({
            currentValue2: e.target.value
        })
    }

    onChangelink(e){
        this.setState({
            currentLink: e.target.value
        })
        console.log("hai cambiato valore del link ed è: "+e.target.value)
        console.log("il valore nello state è: "+this.state.currentLink)
    }

    onAddCondition(e){
        // CREARE COMPONENTI DELLA CONDIZIONE
        if(this.state.currentValue1===""){
            alert("Insert at least one value in the condition!")
            return;
        }
        if(this.state.currentOp==="between" && (this.state.currentValue1==="" || this.state.currentValue2==="")){
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
        console.log(newCondition);
        //AGGIORNARE LO STATE DELLE CONDIZIONI
        this.setState({
            conditions: this.state.conditions.concat(newCondition)
        })
    }

    onRemoveCondition(a,b,c,d){
        var conditionsCopy = [...this.state.conditions];
        for(let i=0; i<conditionsCopy.length; i++){
            if(conditionsCopy[i].type===a && conditionsCopy[i].op===b && conditionsCopy[i].value1===c && conditionsCopy[i].value2===d){
                conditionsCopy.splice(i, 1);
                this.setState({conditions: conditionsCopy});
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

    newAthletesList(){
        return this.state.athletesId.map(currentathleteId => {
            return (
                <div
                type="text"
                className="p-3 mb-2 bg-light"
                key={currentathleteId}>
                    <FontAwesomeIcon icon={faMinusSquare} className="mr-3" size="lg" color="OrangeRed" onClick={()=> {this.onRemoveAthleteId(currentathleteId)}}/>
                    <em className="">{currentathleteId}</em>
                </div>
            )
        })
    }

    newConditionsList(){
        if(this.state.conditions.length===0){
            try {
                document.getElementById("linkSelection").style.display="none";
            } catch (error) {
                //console.log("errore con lenght pari a 0! "+error)
            }
        } else {
            try {
                document.getElementById("linkSelection").style.display="block";
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
                    key={currentCondition.type+currentCondition.value1}>
                        <FontAwesomeIcon icon={faMinusSquare} className="mr-3" size="lg" color="OrangeRed" onClick={()=> {this.onRemoveCondition(currentCondition.type, currentCondition.op, currentCondition.value1, currentCondition.value2)}}/>
                        {index===0? ("    "):(<b><em>{currentCondition.link+" "}</em></b>)}
                        <em className="">{currentCondition.type+" is "+currentCondition.operator+" "+currentCondition.value1+(currentCondition.value2===""? "":(" and "+currentCondition.value2))}</em>
                    </div>
                </span>
            )
        })
    }

    onSubmit(e){
        e.preventDefault();

        try {
            let conditions = [...this.state.conditions];
            let condition = conditions[0];
            condition.link = "";
            conditions[0] = condition;
            this.setState({conditions});    
            console.log(this.state.name);
            console.log(this.state.conditions);
            console.log(this.state.message);

            let athletesId = [...this.state.athletesId];            
            for(let p=0; p<athletesId.length; p++){
                let athID = athletesId[p];
                athID = athID.substring(athID.indexOf("~")+2);
                athletesId[p] = athID;
            }
            console.log(athletesId)
            this.state.athletesId=athletesId;
            console.log("Questa regola è destinata a queste persone: "+this.state.athletesId)
        } catch (error) {
            console.log("nessuna rule settata");
        }

        if(this.state.name===""){
            if (window.confirm(`Name not setted. 
Do you want to automatically set name?`)) {
                let arrRules=[...this.state.alreadyExistingRules]
                let numberRule=-1;
                for(let x=0; x<arrRules.length; x++){
                    let nomeRule=arrRules[x].name;
                    console.log(nomeRule);
                    if(nomeRule.indexOf("Automatic_Rule_Name_")>-1){
                        let n=nomeRule.substr(20)
                        numberRule=parseInt(n)+1;
                    }
                }
                if(numberRule===-1) numberRule=0
                let nuovoNome="Automatic_Rule_Name_"+numberRule;
                this.state.name=nuovoNome; //IL METODO THIS.SETSTATE PER QUALCHE MOTIVO NON FUNZIONA!!! DA RISOLVERE POSSIBILMENTE!
                console.log("il nome è: "+this.state.name);
                        
                const rule = {
                    name: this.state.name,
                    athletesId: this.state.athletesId,
                    conditions: this.state.conditions,
                    message: this.state.message
                }

                console.log(rule);
                
                axios.post('/rules/add/', rule)
                .then(res => console.log(res.data))
                
                alert("Rule added!");
                console.log("il nome è: "+this.state.name);

              } else {
                return;
              }
        } else {
            const rule = {
                name: this.state.name,
                athletesId: this.state.athletesId,
                conditions: this.state.conditions,
                message: this.state.message
            }

            console.log(rule);
            
            axios.post('/rules/add/', rule)
            .then(res => console.log(res.data))
            
            alert("Rule added!");
            console.log("il nome è: "+this.state.name);
        }
    }

    render() {
        return(
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
                        className="mb-2 form-inline ">
                            <select required
                                className="form-control col-sm-12 col-md-6 col-lg-6 col-xl-6  mr-3"
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
                                                value={currentAthlete.name+" ~ "+currentAthlete._id}>{currentAthlete.name +" ~ "+ currentAthlete._id}
                                                </option> 
                                        }
                                    )
                                }
                            </select>
                            <button type="button"
                                class="btn btn-success mx-3"
                                onClick={()=> {this.onAddAthleteId()}}>
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
                            <select className="form-control col-sm-12 col-md-3 col-lg-3 col-xl-3 mr-3"
                                id="selectLink"
                                title="Scegli una opzione"
                                defaultValue="and"
                                onChange={this.onChangelink}>
                                <option value="and">AND</option>
                                <option value="or">OR</option>
                            </select>
                        </span>
                        <div className="form-inline mt-4">
                            <select className="form-control col-sm-12 col-md-3 col-lg-3 col-xl-3 mr-3"
                                id="selectCondition"
                                title="Scegli una opzione"
                                onChange={this.onChangeType}>
                                <option value="Calories Intake (All Day)">Calories Intake - All Day</option>
                                <option value="Calories Intake (Breakfast)">Calories Intake - Breakfast</option>
                                <option value="Calories Intake (Lunch)">Calories Intake - Lunch</option>
                                <option value="Calories Intake (Dinner)">Calories Intake - Dinner</option>
                                <option value="Carbs (g)">Carbs (g)</option>
                                <option value="Fat (g)">Fat (g)</option>
                                <option value="Protein (g)">Protein (g)</option>
                                <option value="Cholesterol (mg)">Cholesterol (mg)</option>
                                <option value="Sodium (mg)">Sodium (mg)</option>
                                <option value="Sugars (g)">Sugars (g)</option>
                                <option value="Fibre (g)">Fibre (g)</option>
                                <option value="Mood">Mood</option>
                                <option value="Bed exits">Bed exits</option>
                                <option value="Sleep hours">Sleep hours</option>
                                <option value="Sleep latency">Sleep latency</option>
                                <option value="Sleep awakening">Sleep awakening</option>
                                <option value="Burned calories">Burned calories</option>
                                <option value="Activity duration">Activity duration</option>
                                <option value="Activity distance">Activity distance</option>
                                <option value="Steps">Steps</option>
                            </select> is
                            <select className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mx-3"
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
                                required
                                className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mx-3"
                                id="selectVal1"
                                value={this.state.value1}
                                onChange={this.onChangeValue1Condition}
                                ></input>
                            {/* secondo valore */}
                            <input type="number"
                                className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mx-3"
                                id="selectVal2"
                                value={this.state.value2}
                                onChange={this.onChangeValue2Condition}
                                ></input>
                            <button type="button"
                                class="btn btn-success mx-3"
                                onClick={()=> {this.onAddCondition()}}>
                                Add
                            </button>
                        </div>
                        <div className="mt-3 bg-warning text-dark rounded">
                        </div>
                    </div>

                    <div className="h4 text-center mt-4 p-3 rounded text-white bg-info">3 ~ Temporal conditions</div>
                    
                    <div className="my-4">
                        <input type="submit"
                        value="Create Rule"
                        className="btn btn-primary">
                        </input>
                    </div>
                </form>
            </div>
        )
    }
}