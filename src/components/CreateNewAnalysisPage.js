import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { compose, withApollo, Query } from "react-apollo";
import MainHeader from "./views/MainHeader";
import {
  Header,
  Container,
  Message,
  Loader,
  Segment,
  Label
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import NotLoggedInMessage from "./views/NotLoggedInMessage";
import gql from "graphql-tag";
import AlreadyOnFigshare from "./Create/AlreadyOnFigshare";
import CreateAnalysisNotOnFigshareForm from "./Create/CreateAnalysisNotOnFigshareForm";
import CreateAnalysisFromFigshare from "./Create/CreateAnalysisFromFigshare";
import categories from "./Categories";

const GET_SINGLE_DATASET_QUICK = gql`
  query singleDatasetInfo($id: ID!, $taskId: ID!, $includeTask: Boolean!) {
    dataset(id: $id) {
      id
      name
      figshareId
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
    task(id: $taskId) @include(if: $includeTask) {
      id
      name
    }
  }
`;

const CreateNewAnalysisPage = props => {
  const [onFigshare, setOnFigshare] = useState(false);

  const headerElm = (
    <MainHeader>
      <Container>
        <Header as="h1" content="Create New Analysis" />
      </Container>
    </MainHeader>
  );

  if (!props.loggedIn) {
    return (
      <Fragment>
        {headerElm}
        <Container>
          <NotLoggedInMessage />
        </Container>
      </Fragment>
    );
  }

  const urlQuery = new URLSearchParams(props.location.search);
  const datasetId = urlQuery.get("datasetId");
  const taskId = urlQuery.get("taskId") || "";

  if (datasetId === "") {
    return (
      <Fragment>
        {headerElm}
        <Container>
          <Message
            warning
            header="Invalid dataset. Navigate to the dataset and try again"
          />
        </Container>
      </Fragment>
    );
  }

  const includeTask = taskId !== "";
  return (
    <Fragment>
      {headerElm}
      <Container>
        <Query
          query={GET_SINGLE_DATASET_QUICK}
          variables={{
            id: datasetId,
            includeTask: includeTask,
            taskId: taskId
          }}
        >
          {({ data, loading, error }) => {
            if (loading) {
              return <Loader active inline="centered" />;
            }
            if (error) {
              return (
                <Message negative header="Error loading dataset information" />
              );
            }

            const { dataset, task } = data;
            let taskMessage;
            if (task) {
              taskMessage = `Task: ${task.name}`;
            } else {
              taskMessage = `No task selected`;
            }
            let createAnalysisForm;
            if (onFigshare) {
              createAnalysisForm = (
                <CreateAnalysisFromFigshare dataset={dataset} task={task} />
              );
            } else {
              const tags = dataset.tags.edges.map(({ node: { name } }) => name);
              let dataSetTags = categories.filter(({ title }) =>
                tags.includes(title)
              );
              createAnalysisForm = (
                <CreateAnalysisNotOnFigshareForm
                  dataset={dataset}
                  task={task}
                  defaultTags={dataSetTags}
                />
              );
            }
            return (
              <Segment.Group>
                <Segment>
                  <Header as="h2" content={dataset.name} />
                  <Label
                    size="large"
                    content={taskMessage}
                    style={{ "margin-right": "16px" }}
                  />
                  <Link to={`/dataset/${dataset.id}`}>
                    <Label color="black" size="large" content="View Dataset" />
                  </Link>
                </Segment>
                <AlreadyOnFigshare
                  title="Analysis already on FigShare?"
                  yesPrimary={onFigshare}
                  onNo={() => setOnFigshare(false)}
                  onYes={() => setOnFigshare(true)}
                />
                {createAnalysisForm}
              </Segment.Group>
            );
          }}
        </Query>
      </Container>
    </Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  loggedIn: user.loggedIn
});

export default connect(mapStateToProps)(
  compose(
    withRouter,
    withApollo
  )(CreateNewAnalysisPage)
);
