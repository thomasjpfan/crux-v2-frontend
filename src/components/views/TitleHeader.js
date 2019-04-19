import React from 'react'
import MainHeader from './MainHeader'
import { Container, Header } from 'semantic-ui-react'

const TitleHeader = props => {
  return (
    <MainHeader>
      <Container>
        <Header as='h1' content={props.title} />
      </Container>
    </MainHeader>
  )
}

export default TitleHeader
