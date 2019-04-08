import React from 'react'
import { Container, Header } from 'semantic-ui-react'
import MainHeader from './MainHeader'

const HeroHeader = () => (
  <MainHeader>
    <Container text>
      <Header as='h1'>
        Welcome.
      </Header>
      <Header as='h3'>
        CRUX represents a community-driven approach to accelerating data-driven innovation. The goal is to provide real-world applications and data sets to data scientists, while providing subject matter experts from academia, corporate and government sectors access to Big Data expertise.
      </Header>
    </Container>
  </MainHeader>
)

export default HeroHeader;
