import React from "react";
import { Mutation, withApollo } from "react-apollo";
import { GET_ANALYSES } from "../CardList/SearchableAnalysesCardList";
import { GET_USER_ANALYSES } from "../CardList/SearchableMyAnalysisCardList";
import { GET_SINGLE_ANALYSIS } from "../SingleAnalysisPage";
import gql from "graphql-tag";
import { connect } from "react-redux";

const EDIT_ANALYSIS = gql`
  mutation editAnalysis($analysisId: ID!, $description: String!) {
    editAnalysis(
      input: { analysisId: $analysisId, description: $description }
    ) {
      analysis {
        id
      }
    }
  }
`;

const EditAnalysisOnCrux = props => (
  <Mutation
    mutation={EDIT_ANALYSIS}
    variables={{
      analysisId: props.analysisId,
      description: props.description
    }}
    refetchQueries={[
      {
        query: GET_ANALYSES
      },
      {
        query: GET_SINGLE_ANALYSIS,
        variables: {
          id: props.analysisId
        }
      },
      {
        query: GET_USER_ANALYSES,
        variables: {
          createdBy: props.cruxUID,
          after: "",
          name: ""
        }
      }
    ]}
  >
    {props.children}
  </Mutation>
);

const mapStateToProps = ({ user }) => ({
  cruxUID: user.cruxUID
});

export default connect(mapStateToProps)(withApollo(EditAnalysisOnCrux));
