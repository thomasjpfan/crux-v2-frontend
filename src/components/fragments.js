import gql from "graphql-tag";

const DATASET_FRAGMENT = gql`
  fragment datasetNode on DatasetNode {
    id
    name
    description
    figshareId
    createdBy {
      username
    }
    analysisSet {
      edges {
        node {
          id
          name
          task {
            id
            name
          }
        }
      }
    }
    taskSet {
      edges {
        node {
          id
          name
        }
      }
    }
    tags {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const ANALYSIS_FRAGMENT = gql`
  fragment analysisNode on AnalysisNode {
    id
    name
    description
    figshareId
    createdBy {
      username
    }
    task {
      id
      name
    }
    dataset {
      id
      name
      figshareId
      description
      tags {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

export { DATASET_FRAGMENT, ANALYSIS_FRAGMENT };
