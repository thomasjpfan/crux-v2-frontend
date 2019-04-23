import { debounce } from "throttle-debounce";
import React, { Component, Fragment } from 'react'
import { Input, Divider } from 'semantic-ui-react'
import gql from 'graphql-tag'
import AnalysesCardList from './AnalysesCardList'

const GET_ANALYSES = gql`
  query analyses($after: String, $name: String){
    analyses(after: $after, first: 10, name_Icontains: $name) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          name
          description
        }
      }
    }
  }
`

class SearchableAnalysesCardList extends Component {
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
    return (<Fragment>
      <Input icon='search' iconPosition='left' placeholder='Search for title...' fluid onChange={this.changeQuery} loading={this.state.loading} />
      <Divider hidden />
      <AnalysesCardList query={GET_ANALYSES} additionalVariables={{ name: this.state.searchQuery }} />
    </Fragment >)
  }
}

export { GET_ANALYSES }
export default SearchableAnalysesCardList
