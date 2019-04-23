import { debounce } from "throttle-debounce"
import React, { Component, Fragment } from 'react'
import { Input, Divider } from 'semantic-ui-react'
import DatasetsCardList from './DatasetsCardList'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import NotLoggedInMessage from '../views/NotLoggedInMessage'


const GET_USER_DATASETS = gql`
  query datasets($after: String, $createdBy: ID, $name: String){
    datasets(after: $after, first: 10, createdBy: $createdBy, name_Icontains: $name) {
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


class SearchableMyDatasetCardList extends Component {
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
      <Input icon='search' iconPosition='left' placeholder='Search for title...' fluid onChange={this.changeQuery} loading={this.state.loading} />
      <Divider hidden />
      <DatasetsCardList query={GET_USER_DATASETS} additionalVariables={{ createdBy: this.props.cruxUID, name: this.state.searchQuery }} />
    </Fragment >)

  }
}

const mapStateToProps = ({ user }) => (
  {
    loggedIn: user.loggedIn,
    cruxUID: user.cruxUID,
  }
)

export { GET_USER_DATASETS }
export default connect(mapStateToProps)(SearchableMyDatasetCardList)
