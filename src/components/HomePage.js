import React, { Component, Fragment } from 'react'
import HeroHeader from './views/HeroHeader'
import { Container } from 'semantic-ui-react'
import SearchableDatasetCardList from './CardList/SearchableDatasetCardList'

class HomePage extends Component {
  render() {
    return (
      <Fragment>
        <HeroHeader></HeroHeader>
        <Container>
          <SearchableDatasetCardList></SearchableDatasetCardList>
        </Container>
      </Fragment>
    )
  }
}


export default HomePage;
