import React, { Fragment } from 'react'
import MainHeader from './views/MainHeader'
import { Header, Container, Message } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import NotLoggedInMessage from './views/NotLoggedInMessage'
import CreateAnalysisOnFigshare from './Create/CreateAnalysisOnFigshare'

const CreateNewAnalysisPage = props => {
  const headerElm = (<MainHeader>
    <Container>
      <Header as='h1' content='Create New Analysis' />
    </Container>
  </MainHeader>)
  if (!props.loggedIn) {
    return (
      <Fragment>
        {headerElm}
        <Container>
          <NotLoggedInMessage />
        </Container>
      </Fragment>)
  }

  const urlQuery = new URLSearchParams(props.location.search)
  const datasetId = urlQuery.get('datasetId')

  if (datasetId === "") {
    return (
      <Fragment>
        {headerElm}
        <Container>
          <Message
            warning
            header='Invalid dataset. Navigate to the dataset and try again'
          />
        </Container>
      </Fragment>
    )
  }

  return (
    <Fragment>
      {headerElm}
    </Fragment>
  )
}

const mapStateToProps = ({ user }) => (
  {
    loggedIn: user.loggedIn,
  }
)
export default connect(mapStateToProps)(withRouter(CreateNewAnalysisPage))
