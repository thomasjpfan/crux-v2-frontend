import React, { Component } from 'react';
import {
  Container, Header, Button, Divider
} from 'semantic-ui-react'
import MainHeader from './views/MainHeader'
import SearchableAnalysesCardList from './CardList/SearchableAnalysesCardList'
import MyAnalysesCardList from './CardList/MyAnalysesCardList'


class AnalysesPage extends Component {
  state = {
    tabIndex: 0
  }

  tabSwitch = (idx) => () => {
    this.setState({
      tabIndex: idx
    })
  }

  render() {
    let mainDisplay
    if (this.state.tabIndex === 1) {
      mainDisplay = (<MyAnalysesCardList />)
    } else {
      mainDisplay = (<SearchableAnalysesCardList />)
    }

    return (
      <React.Fragment>
        <MainHeader>
          <Container>
            <Header as='h1'>Analyses</Header>
          </Container>
        </MainHeader >
        <Container>
          <Button.Group widths='2' color='blue' size='large'>
            <Button active={this.state.tabIndex === 0} onClick={this.tabSwitch(0)}>All</Button>
            <Button active={this.state.tabIndex === 1} onClick={this.tabSwitch(1)}>My Analyses</Button>
          </Button.Group>
          <Divider hidden />
          {mainDisplay}
        </Container>
      </React.Fragment>
    )
  }
}

export default AnalysesPage;
