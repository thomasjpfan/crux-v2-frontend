import React from 'react'
import gql from 'graphql-tag'
import DatasetsCardList from './DatasetsCardList'


const GET_ALL_DATASETS = gql`
  query datasets($after: String, $first: Int){
    datasets(after: $after, first: $first) {
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

const AllDatasetCardList = props => {
  return <DatasetsCardList query={GET_ALL_DATASETS} cardsPerPage={3} />
}

export default AllDatasetCardList
