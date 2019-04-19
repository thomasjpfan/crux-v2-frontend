import { debounce } from "throttle-debounce";
import React, { Component, Fragment } from 'react'
import { Input, Divider } from 'semantic-ui-react'
import DatasetsCardList from './DatasetsCardList'
import gql from 'graphql-tag'

const GET_ALL_DATASETS = gql`
  query datasets($after: String, $first: Int, $name: String){
    datasets(after: $after, first: $first, name_Icontains: $name) {
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

class SearchableDatasetCardList extends Component {
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
      <DatasetsCardList query={GET_ALL_DATASETS} additionalVariables={{ name: this.state.searchQuery }} cardsPerPage={5} />
    </Fragment >)

  }
}

export default SearchableDatasetCardList
