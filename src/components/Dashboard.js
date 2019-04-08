import React, { Component } from 'react';
import { Header, Container, Divider } from 'semantic-ui-react';
import CardList from './CardList'
import MainHeader from './MainHeader'
import Paging from './Paging'

class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <MainHeader>
          <Container>
            <Header as='h1'>Dashboard</Header>
          </Container>
        </MainHeader >
        <Container>
          <Header as='h1'>Datasets</Header>
          <CardList></CardList>
          <Divider hidden></Divider>
          <Paging></Paging>
          <Header as='h1'>Analysis</Header>
          <CardList></CardList>
          <Divider hidden></Divider>
          <Paging></Paging>
        </Container>
      </React.Fragment>
    )
  }
}

export default Dashboard;
