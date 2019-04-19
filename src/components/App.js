import React, { Component } from 'react';
import NavBar from './views/NavBar'
import { Switch, Route } from 'react-router-dom';
import DatasetsPage from './DatasetsPage'
import AnalysesPage from './AnalysesPage'
import Figshare from './views/Figshare'
import HomePage from './HomePage'
import DashboardPage from './DashboardPage'
import SingleDatasetPage from './SingleDatasetPage'
import SingleAnalysisPage from './SingleAnalysisPage'
import CreateNewDatasetPage from './CreateNewDatasetPage'
import CreateNewAnalysisPage from './CreateNewAnalysisPage'

import 'semantic-ui-css/semantic.min.css'
import './App.css'


class App extends Component {
  render() {
    return (
      <div>
        <NavBar></NavBar>
        <Switch>
          <Route exact path='/dashboard' component={DashboardPage} />
          <Route path='/createdataset' component={CreateNewDatasetPage} />
          <Route path='/createanalysis' component={CreateNewAnalysisPage} />
          <Route path='/dataset/:datasetId' component={SingleDatasetPage} />
          <Route path='/analysis/:analysisId' component={SingleAnalysisPage} />
          <Route exact path='/' component={HomePage} />
          <Route path='/datasets' component={DatasetsPage} />
          <Route path='/analyses' component={AnalysesPage} />
          <Route path='/oauth/figshare' render={
            props => <Figshare {...props} />
          }></Route>
          <Route component={HomePage} />
        </Switch>
      </div >
    )
  }
}

export default App;
