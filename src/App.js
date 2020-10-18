import React from 'react';
import {HashRouter as Router, Switch, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import Header from "./components/header.component"
import Navbar from "./components/navbar.component"
import AthletesList from "./components/athletes-list.component"
import RulesList from "./components/rules-list.component"
import DetailsAthlete from "./components/details-athlete.component"
import AddRule from "./components/add-rule.component"
import UpdateRule from "./components/update-rule.component"

function App() {
  return (
      <Router>
        <Header></Header>
        <Navbar></Navbar>
        <br/>
        <Switch>
          <Route exact path="/rules/update/:id" component={UpdateRule}/>
          <Route exact path="/rules/add" component={AddRule}/>
          <Route exact path="/rules" component={RulesList}/>
          <Route exact path="/:id" component={DetailsAthlete}/>
          <Route exact path="/" component={AthletesList}/>
        </Switch>
      </Router>
  );
}

export default App;