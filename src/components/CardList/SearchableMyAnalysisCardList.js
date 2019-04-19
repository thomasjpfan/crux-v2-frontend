import React, { Component, Fragment } from 'react'
import { Input, Divider } from 'semantic-ui-react'
import AnalysesCardList from './AnalysesCardList'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import NotLoggedInMessage from '../views/NotLoggedInMessage'

const GET_USER_ANALYSES = gql`
  query analyses($after: String, $first: Int, $name: String, $username: String){
    analyses(after: $after, first: $first, name_Icontains: $name, createdBy_Username: $username) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          name
          description
          id
        }
      }
    }
  }
`

class SearchableMyAnalysesCardList extends Component {
  state = {
    inputQuery: "",
    searchQuery: "",
    loading: false
  }

  setQueryDebounced = debounce(500, () => {
    this.setState({
      searchQuery: this.state.inputQuery,
      loading: false
    })
  })

  changeQuery = (e, { value }) => {
    this.setState({
      inputQuery: value,
      loading: true
    }, () => {
      this.setQueryDebounced()
    })
  }


  render() {
    if (!this.props.loggedIn) {
      return <NotLoggedInMessage />
    }
    return (<Fragment>
      <Input icon='search' iconPosition='left' placeholder='Search for title...' fluid onChange={this.onChange} />
      <Divider hidden />
      <AnalysesCardList query={GET_USER_ANALYSES} additionalVariables={{ name: this.state.query, username:  }} cardsPerPage={5} />
    </Fragment >)

  }
}

const mapStateToProps = ({ user }) => (
  {
    loggedIn: user.loggedIn,
    username: user.username,
  }
)

export default connect(mapStateToProps)(SearchableMyAnalysesCardList)
