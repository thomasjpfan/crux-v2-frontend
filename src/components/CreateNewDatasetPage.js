import React, { Fragment, Component } from 'react'
import TitleHeader from './views/TitleHeader'
import { Container, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import NotLoggedInMessage from './views/NotLoggedInMessage'
import AlreadyOnFigshare from './Create/AlreadyOnFigshare'
import CreateDatasetFromFigshare from './Create/CreateDatasetFromFigshare'
import CreateDatasetNotOnFigshareForm from './Create/CreateDatasetNotOnFigshareForm';

class CreateNewDatasetPage extends Component {
  state = {
    alreadyOnFigshare: false,
  }

  render() {
    const { alreadyOnFigshare } = this.state

    if (!this.props.loggedIn) {
      return (
        <Fragment>
          <TitleHeader title='Create New Dataset' />
          <Container>
            <NotLoggedInMessage />
          </Container>
        </Fragment>)
    }

    return (
      <Fragment>
        <TitleHeader title='Create New Dataset' />
        <Container>
          <Segment.Group>
            <AlreadyOnFigshare title='Dataset already on FigShare?'
              yesPrimary={alreadyOnFigshare}
              onNo={() => this.setState({ alreadyOnFigshare: false })}
              onYes={() => this.setState({ alreadyOnFigshare: true })} />
            {alreadyOnFigshare ? (
              <CreateDatasetFromFigshare />
            ) : (<CreateDatasetNotOnFigshareForm />)}
          </Segment.Group>
        </Container>
      </Fragment>
    )
  }
}

const mapStateToProps = ({ user }) => (
  {
    loggedIn: user.loggedIn,
  }
)

export default connect(mapStateToProps)(CreateNewDatasetPage)
