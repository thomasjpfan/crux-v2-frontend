import React, { Component } from 'react';
import NavBar from './components/NavBar'
import HeroHeader from './components/HeroHeader'
import { Switch, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import CardList from './components/CardList'
import { Container } from 'semantic-ui-react'
import Datasets from './components/Datasets'
import Analyses from './components/Analyses'
import SignUp from './components/SignUp'
import Figshare from './components/Figshare'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <div>
        <NavBar></NavBar>
        <Switch>
          <Route exact path='/dashboard' component={Dashboard}>
          </Route>
          <Route exact path='/' render={() => (
            <div>
              <HeroHeader></HeroHeader>
              <Container>
                <CardList name='Datasets'></CardList>
              </Container>
            </div>
          )}></Route>
          <Route path='/datasets' component={Datasets}></Route>
          <Route path='/analyses' component={Analyses}></Route>
          <Route path='/signup' component={SignUp}></Route>
          <Route path='/oauth/figshare' render={
            props => <Figshare {...props} />
          }></Route>
        </Switch>
      </div >
    )
  }
}

export default App;
