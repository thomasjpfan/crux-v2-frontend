import React, { Component } from 'react'
import { Mutation, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { GET_DATASETS } from '../CardList/SearchableDatasetCardList'
import { GET_USER_DATASETS } from '../CardList/SearchableMyDatasetCardList'


const CREATE_DATASET_FROM_FIGSHARE = gql`
mutation createSingleDatasetOnFigshare(
  $name: String!, $description: String!, $tags: [String!]!, $tasks: [String!]!, $figshareID: Int!) {
      createDataset(input:
    {
      name: $name,
    	description: $description,
      tags: $tags,
      figshareId: $figshareID,
      tasks: $tasks
    }){
      dataset {
        id
      }
    }
  }
`

class AddDatasetToCrux extends Component {

  render() {
    const { name, description, tags, figshareID, tasks, cruxUID } = this.props
    return (
      <Mutation
        mutation={CREATE_DATASET_FROM_FIGSHARE}
        variables={{
          name: name,
          description: description,
          tags: tags,
          figshareID: figshareID,
          tasks: tasks
        }}
        refetchQueries={[{
          query: GET_DATASETS,
        }, {
          query: GET_USER_DATASETS,
          variables: {
            createdBy: cruxUID
          }
        }]}
      >
        {this.props.children}
      </Mutation >
    )
  }
}

const mapStateToProps = ({ user }) => (
  {
    cruxUID: user.cruxUID,
  }
)

export default connect(mapStateToProps)(withApollo(AddDatasetToCrux))
