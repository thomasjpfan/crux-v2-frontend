import React from 'react'
import gql from 'graphql-tag'
import AnalysesCardList from './AnalysesCardList'
import { connect } from 'react-redux'
import NotLoggedInMessage from '../views/NotLoggedInMessage'


const GET_ANALYSES = gql`
  query analyses($after: String, $first: Int, $username: String!){
    analyses(after: $after, first: $first, createdBy_Username: $username) {
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

const MyAnalysesCardList = props => {
  if (props.loggedIn) {
    return <AnalysesCardList query={GET_ANALYSES} additionalVariables={{ username: props.username }} cardsPerPage={1} />
  }

  // Not logged in
  return <NotLoggedInMessage />
}

const mapStateToProps = ({ user }) => (
  {
    loggedIn: user.loggedIn,
    username: user.username,
  }
)

export default connect(mapStateToProps)(MyAnalysesCardList)
