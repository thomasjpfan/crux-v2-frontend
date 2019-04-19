import React, { Component, Fragment } from 'react'
import HeroHeader from './views/HeroHeader'
import { Container } from 'semantic-ui-react'
import AllDatasetsCardList from './CardList/AllDatasetsCardList'

class HomePage extends Component {
  render() {
    return (
      <Fragment>
        <HeroHeader></HeroHeader>
        <Container>
          <AllDatasetsCardList></AllDatasetsCardList>
        </Container>
      </Fragment>
    )
  }
}


export default HomePage;
