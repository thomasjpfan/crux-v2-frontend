import React, { Fragment } from "react";
import { Query } from "react-apollo";
import { Loader, Message, Container } from "semantic-ui-react";
import EditAnalysisForm from "./Edit/EditAnalysisForm";
import { GET_SINGLE_ANALYSIS } from "./SingleAnalysisPage";

const EditSingleAnalysis = props => {
  const {
    params: { analysisId }
  } = props.match;
  return (
    <Fragment>
      <Query query={GET_SINGLE_ANALYSIS} variables={{ id: analysisId }}>
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <Container>
                <Loader active inline="centered" />
              </Container>
            );
          }
          if (error) {
            return (
              <Container>
                <Message negative>
                  <Message.Header>Error loading analysis</Message.Header>
                </Message>
              </Container>
            );
          }

          const { analysis } = data;
          return <EditAnalysisForm analysis={analysis} />;
        }}
      </Query>
    </Fragment>
  );
};

export default EditSingleAnalysis;
