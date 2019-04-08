import React, { Component } from 'react';
import {
  Container, Header, Button, Divider
} from 'semantic-ui-react'
import MainHeader from './MainHeader'
import CardList from './CardList'
import Paging from './Paging'

class Datasets extends Component {
  render() {
    return (
      <React.Fragment>
        <MainHeader>
          <Container>
            <Header as='h1'>Datasets</Header>
          </Container>
        </MainHeader >
        <Container>
          <Button.Group widths='3' color='blue' size='large'>
            <Button active>All</Button>
            <Button>My Datasets</Button>
            <Button>New Dataset</Button>
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

export default Datasets;
