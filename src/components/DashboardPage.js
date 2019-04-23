import React, { Fragment } from 'react'
import { Header, Container } from 'semantic-ui-react'
import MainHeader from './views/MainHeader'
import { connect } from 'react-redux'
import NotLoggedInMessage from './views/NotLoggedInMessage'
import DashboardDisplay from './views/DashboardDisplay'


const DashboardPage = (props) => {
  let mainContent
  let dashboardMessage
  if (props.loggedIn) {
    mainContent = (<DashboardDisplay />)
    dashboardMessage = `My Dashboard`
  } else {
    mainContent = (<NotLoggedInMessage />)
    dashboardMessage = 'Dashboard'
  }

  return (<Fragment>
    <MainHeader>
      <Container>
        <Header as='h1'>{dashboardMessage}</Header>
      </Container>
    </MainHeader >
    <Container>
      {mainContent}
    </Container>
  </Fragment>)
}

const mapStateToProps = ({ user }) => {
  return {
    loggedIn: user.loggedIn,
  }
}

export default connect(mapStateToProps)(DashboardPage);
