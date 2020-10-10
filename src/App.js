import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"


import Header from "./components/header.component"
import Navbar from "./components/navbar.component"
import AthletesList from "./components/athletes-list.component"
import DetailsAthlete from "./components/details-athlete.component"
import RulesList from "./components/rules-list.component"
import AddRules from "./components/add-rules.component"
import UpdateRule from "./components/update-rule.component"


function App() {
  return (
      <Router>
        <Header></Header>
        <Navbar></Navbar>
        <br/>
        <Switch>
          <Route exact path="/rules/add" component={AddRules}/>
          <Route exact path="/rules/update/:id" component={UpdateRule}/>
          <Route exact path="/rules" component={RulesList}/>
          <Route exact path="/:id" component={DetailsAthlete}/>
          <Route exact path="/" component={AthletesList}/>
        </Switch>
      </Router>
  );
}

export default App;