import React, { Component } from 'react'
import { Mutation, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { GET_ANALYSES } from '../CardList/SearchableAnalysesCardList'
import { GET_USER_ANALYSES } from '../CardList/SearchableMyAnalysisCardList'
import { connect } from 'react-redux'

const CREATE_ANALYSIS_FROM_FIGSHARE = gql`
mutation createSingleAnalysisFromFigshare(
  $name: String!,
  $description: String!,
  $tags: [String!]!,
  $taskID: ID,
  $datasetID: ID!,
  $figshareID: Int!)
{
  createAnalysis(input:
    {
      name: $name,
    	description: $description,
      tags: $tags,
      figshareId: $figshareID,
      datasetId: $datasetID
      taskId: $taskID,
    })
  {
    analysis
    {
      id
    }
  }
}
`

class AddAnalysisToCrux extends Component {

  render() {
    const { name, description, tags, figshareID, taskID, cruxUID, datasetID } = this.props
    return (
      <Mutation
        mutation={CREATE_ANALYSIS_FROM_FIGSHARE}
        variables={{
          name: name,
          description: description,
          tags: tags,
          figshareID: figshareID,
          datasetID: datasetID,
          taskID: taskID,
        }}
        refetchQueries={
          [{
            query: GET_ANALYSES
          }, {
            query: GET_USER_ANALYSES,
            variables: {
              createdBy: cruxUID
            }
          }]}>
        {this.props.children}
      </Mutation>
    )
  }
}

const mapStateToProps = ({ user }) => (
  {
    cruxUID: user.cruxUID,
  }
)

export default connect(mapStateToProps)(withApollo(AddAnalysisToCrux))
