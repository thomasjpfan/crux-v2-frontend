import React from 'react'
import gql from 'graphql-tag'
import AnalysesCardList from './AnalysesCardList'


const GET_ANALYSES = gql`
  query analyses($after: String, $first: Int){
    analyses(after: $after, first: $first) {
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

const AllAnalysesCardList = props => {
  return <AnalysesCardList query={GET_ANALYSES} cardsPerPage={1} />
}

export default AllAnalysesCardList
