import React from "react";
import { Mutation, withApollo } from "react-apollo";
import { GET_DATASETS } from "../CardList/SearchableDatasetCardList";
import { GET_USER_DATASETS } from "../CardList/SearchableMyDatasetCardList";
import { GET_SINGLE_DATASET } from "../SingleDatasetPage";
import gql from "graphql-tag";
import { connect } from "react-redux";

const EDIT_DATASET = gql`
  mutation editDataset(
    $datasetId: ID!
    $description: String!
    $tasks: [String!]!
  ) {
    editDataset(
      input: { datasetId: $datasetId, description: $description, tasks: $tasks }
    ) {
      dataset {
        id
      }
    }
  }
`;

const EditDatasetOnCrux = props => (
  <Mutation
    mutation={EDIT_DATASET}
    variables={{
      datasetId: props.datasetId,
      description: props.description,
      tasks: props.tasks
    }}
    refetchQueries={[
      {
        query: GET_DATASETS
      },
      {
        query: GET_SINGLE_DATASET,
        variables: {
          id: props.datasetId
        }
      },
      {
        query: GET_USER_DATASETS,
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

export default connect(mapStateToProps)(withApollo(EditDatasetOnCrux));
