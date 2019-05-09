import React, { Fragment } from "react";
import { Loader, Message } from "semantic-ui-react";
import { withApollo, Query } from "react-apollo";
import CardList from "../views/CardList";

const DatasetsCardList = props => {
  return (
    <Fragment>
      <Query query={props.query} variables={{ ...props.additionalVariables }}>
        {({ data, loading, error, fetchMore }) => {
          if (loading) {
            return <Loader active inline="centered" />;
          }
          if (error) {
            // Show error message
            return (
              <Message negative>
                <Message.Header>Error loading datasets</Message.Header>
              </Message>
            );
          }
          const { datasets } = data;
          return (
            <CardList
              items={datasets}
              loading={loading}
              activeMoreButton={datasets.pageInfo.hasNextPage}
              showMoreContent="Show More Datasets"
              noDataContent="Click 'Create New Dataset' to create your own dataset!"
              rooturi="/dataset"
              showMore={() => {
                if (!datasets.pageInfo.hasNextPage) {
                  return;
                }
                fetchMore({
                  variables: {
                    after: datasets.pageInfo.endCursor,
                    ...props.additionalVariables
                  },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    const newEdges = fetchMoreResult.datasets.edges;
                    const pageInfo = fetchMoreResult.datasets.pageInfo;
                    return newEdges.length
                      ? {
                          datasets: {
                            __typename: previousResult.datasets.__typename,
                            edges: [
                              ...previousResult.datasets.edges,
                              ...newEdges
                            ],
                            pageInfo
                          }
                        }
                      : previousResult;
                  }
                });
              }}
            />
          );
        }}
      </Query>
    </Fragment>
  );
};

export default withApollo(DatasetsCardList);
