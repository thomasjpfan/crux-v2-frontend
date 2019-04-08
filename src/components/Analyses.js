import React, { Component } from 'react';
import {
  Container, Header, Button, Divider
} from 'semantic-ui-react'
import MainHeader from './MainHeader'
import CardList from './CardList'
import Paging from './Paging'


class Analyses extends Component {
  render() {
    return (
      <React.Fragment>
        <MainHeader>
          <Container>
            <Header as='h1'>Analyses</Header>
          </Container>
        </MainHeader >
        <Container>
          <Button.Group widths='3' color='blue' size='large'>
            <Button active>All</Button>
            <Button>My Analyses</Button>
            <Button>New Analysis</Button>
          </Button.Group>
          <Divider hidden></Divider>
          <CardList></CardList>
          <Divider hidden></Divider>
          <Paging></Paging>
        </Container>
      </React.Fragment>
    )
  }
}

export default Analyses;
