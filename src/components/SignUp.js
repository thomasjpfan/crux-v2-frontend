import React, { Component } from 'react';
import { Container, Form, Header } from 'semantic-ui-react';
import MainHeader from './MainHeader'

class SignUp extends Component {
  render() {
    return (
      <React.Fragment>
        <MainHeader>
          <Container>
            <Header as='h1'>Signup</Header>
          </Container>
        </MainHeader >
        <Form>
        </Form>
      </React.Fragment>
    )
  }
}

export default SignUp;
