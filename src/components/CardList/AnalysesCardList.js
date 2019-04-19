import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import { Loader, Message } from 'semantic-ui-react'
import CardList from '../views/CardList'


const AnalysesCardList = props => {
  return (<Fragment>
    <Query query={props.query} variables={{ first: props.cardsPerPage, ...props.additionalVariables }}>
      {({ data, loading, error, fetchMore }) => {
        if (loading) {
          return <Loader active inline='centered' />
        }
        if (error) {
          // Show error message
          return <Message negative>
            <Message.Header>Error loading Analyses</Message.Header>
          </Message>
        }

        const { analyses } = data
        return (<CardList
          items={analyses}
          loading={loading}
          activeMoreButton={analyses.pageInfo.hasNextPage}
          showMoreContent='Show More Analyses'
          noDataContent='No Analyses'
          rooturi='/analysis'
          showMore={() => {
            if (!analyses.pageInfo.hasNextPage) {
              return
            }
            fetchMore({
              variables: {
                after: analyses.pageInfo.endCursor,
                first: props.cardsPerPage,
                ...props.additionalVariables
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                const newEdges = fetchMoreResult.analyses.edges
                const pageInfo = fetchMoreResult.analyses.pageInfo
                return newEdges.length ? {
                  analyses: {
                    __typename: previousResult.analyses.__typename,
                    edges: [...previousResult.analyses.edges, ...newEdges],
                    pageInfo
                  }
                } : previousResult
              }
            })
          }}
        />)
      }}
    </Query>
  </Fragment>)
}


export default AnalysesCardList
