import React, { Component } from "react";
import {
  Form,
  Button,
  Modal,
  Header,
  Icon,
  Message,
  Progress,
  Divider,
  Label
} from "semantic-ui-react";
import AddAnalysisToCrux from "./AddAnalysisToCrux";
import { withRouter } from "react-router-dom";
import CategorySearch from "../views/CategorySearch";

class CreateAnalysisFromFigshareForm extends Component {
  state = {
    name: this.props.name,
    description: this.props.description,
    taskID: this.props.taskID,
    tags: this.props.tags,
    confirmCreateModalOpen: false,
    createAnalysisModalOpen: false,
    errorMessage: "",
    errorFormLabel: ""
  };

  removeTag = id => e => {
    this.setState({
      tags: [
        ...this.state.tags.slice(0, id),
        ...this.state.tags.slice(id + 1, this.state.tags.length)
      ]
    });
  };

  createAnalysis = (e, createSingleAnalysisFromFigshare) => {
    // Create dataset in modal
    this.setState({
      confirmCreateModalOpen: false,
      createAnalysisModalOpen: true,
      errorMessage: ""
    });
    createSingleAnalysisFromFigshare()
      .then(({ data: { createAnalysis: { analysis: { id } } } }) => {
        this.setState({
          createAnalysisModalOpen: false
        });
        this.props.history.push(`/analysis/${id}`);
      })
      .catch(e => {
        this.setState({
          createAnalysisModalOpen: false,
          errorMessage: "Error adding analysis to Crux"
        });
      });
  };

  validateForm = () => {
    if (this.state.name === "") {
      this.setState({
        errorMessage: "Please add a name",
        errorFormLabel: "name"
      });
      return;
    }
    if (this.state.description === "") {
      this.setState({
        errorMessage: "Please add a description",
        errorFormLabel: "description"
      });
      return;
    }
    if (this.state.tags.length === 0) {
      this.setState({
        errorMessage: "Please add a tag",
        errorFormLabel: "tags"
      });
      return;
    }
    this.setState({
      confirmCreateModalOpen: true,
      errorMessage: "",
      errorFormLabel: ""
    });
  };

  render() {
    const {
      description,
      tags,
      confirmCreateModalOpen,
      taskID,
      name,
      errorMessage,
      createAnalysisModalOpen,
      errorFormLabel
    } = this.state;
    const { taskOptions, figshareID, datasetID } = this.props;

    return (
      <Form error={errorMessage !== ""}>
        <Form.Input
          label="Name"
          value={name}
          onChange={(e, { value }) => this.setState({ name: value })}
          error={errorFormLabel === "name"}
        />
        <Form.TextArea
          label="Description"
          value={description}
          onChange={(e, { value }) => this.setState({ description: value })}
          rows={16}
          error={errorFormLabel === "description"}
        />
        <CategorySearch
          handleSelect={result => {
            this.setState({ tags: [...this.state.tags, result] });
          }}
          currentItems={tags}
        />
        {tags.length > 0 && (
          <div className="spaced tags-container ">
            <Divider hidden />
            {tags.map(({ title }, id) => {
              return (
                <Label
                  size="large"
                  color="blue"
                  key={id}
                  content={`Tag: ${title}`}
                  onRemove={this.removeTag(id)}
                />
              );
            })}
            <Divider hidden />
          </div>
        )}
        {taskOptions.length > 0 && (
          <Form.Dropdown
            label="Task"
            value={taskID}
            fluid
            selection
            options={taskOptions}
            onChange={(e, { value }) => this.setState({ taskID: value })}
          />
        )}
        <Modal
          trigger={
            <Button primary type="button" onClick={this.validateForm}>
              Create Analysis
            </Button>
          }
          open={confirmCreateModalOpen}
          onClose={() => this.setState({ confirmCreateModalOpen: false })}
          size="large"
        >
          <Header content="Are you sure you want to create this analysis?" />
          <Modal.Actions>
            <Button
              color="red"
              onClick={() => this.setState({ confirmCreateModalOpen: false })}
            >
              <Icon name="remove" />
              No
            </Button>
            <AddAnalysisToCrux
              name={name}
              description={description}
              tags={tags.map(({ title }) => title)}
              figshareID={figshareID}
              taskID={taskID === "NO TASK" ? "" : taskID}
              datasetID={datasetID}
            >
              {createSingleAnalysisFromFigshare => {
                return (
                  <Button
                    color="green"
                    onClick={e =>
                      this.createAnalysis(e, createSingleAnalysisFromFigshare)
                    }
                  >
                    <Icon name="checkmark" />
                    Yes
                  </Button>
                );
              }}
            </AddAnalysisToCrux>
          </Modal.Actions>
        </Modal>
        <Message
          error
          header="Unable to Create Analysis"
          content={errorMessage}
        />
        <Modal
          open={createAnalysisModalOpen}
          onClose={() => this.setState({ createAnalysisModalOpen: false })}
          closeOnDimmerClick={false}
          size="large"
        >
          <Modal.Content>
            <Header content="Creating Analysis..." />
            <Progress percent={100} indicating color="blue" />
          </Modal.Content>
        </Modal>
      </Form>
    );
  }
}

export default withRouter(CreateAnalysisFromFigshareForm);
