import React, { Component } from "react";
import MainHeader from "../views/MainHeader";
import { capitalizeFirstLetter } from "../Create/utils";
import {
  Container,
  Header,
  Form,
  Segment,
  List,
  Label,
  Message,
  Modal,
  Progress
} from "semantic-ui-react";
import EditDatasetOnCrux from "./EditDatasetOnCrux";
import { withRouter } from "react-router-dom";

class EditDatasetForm extends Component {
  state = {
    description: this.props.dataset.description,
    newTasks: [],
    formErrorLabel: "",
    formErrorMessage: "",
    modalOpen: "NONE"
  };

  removeTask = id => e => {
    this.setState({
      newTasks: [
        ...this.state.newTasks.slice(0, id),
        ...this.state.newTasks.slice(id + 1, this.state.newTasks.length)
      ]
    });
  };
  addTaskKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.value.length === 0) {
        return;
      }
      this.setState({
        newTasks: [
          ...this.state.newTasks,
          capitalizeFirstLetter(e.target.value)
        ]
      });
      e.target.value = "";
    }
  };

  openConfirmation = (e, editDataset) => {
    if (this.state.description === "") {
      this.setState({
        formErrorMessage: "Please add a description",
        formErrorLabel: "description"
      });
      return;
    }

    this.setState({
      formErrorMessage: "",
      formErrorLabel: ""
    });

    editDataset()
      .then(({ data: { editDataset: { dataset: { id } } } }) => {
        this.setState({
          modalOpen: "UPDATING"
        });
        this.props.history.push(`/dataset/${id}`);
      })
      .catch(e => {
        this.setState({
          modalOpen: "NONE",
          errorMessage: "Error updating dataset on Crux"
        });
      });
  };

  render() {
    const { dataset } = this.props;
    const { id, name, taskSet } = dataset;
    const {
      description,
      newTasks,
      formErrorLabel,
      formErrorMessage,
      modalOpen
    } = this.state;

    const tasks = taskSet.edges.map(({ node: { name } }) => name);
    return (
      <>
        <MainHeader>
          <Container>
            <Header as="h1" content={`Edit: ${name}`} />
          </Container>
        </MainHeader>
        <Container>
          {tasks.length > 0 && (
            <div className="spaced tags-container ">
              {tasks.map((name, id) => (
                <Label
                  size="large"
                  color="grey"
                  key={`old-tasks-${id}`}
                  content={`Task: ${name}`}
                />
              ))}
            </div>
          )}
          <Segment>
            <Form size="large" error={formErrorMessage !== ""}>
              <Form.TextArea
                label="Edit Description"
                placeholder="Description"
                onChange={(e, { value }) =>
                  this.setState({ description: value })
                }
                value={description}
                error={formErrorLabel === "description"}
              />
              <Form.Input
                label="Add New Tasks (Press enter to add)"
                onKeyDown={this.addTaskKeyDown}
              />
              {newTasks.length > 0 && (
                <List>
                  {newTasks.map((name, id) => (
                    <List.Item key={id}>
                      <List.Content>
                        <Label
                          size="large"
                          content={`Task: ${name}`}
                          onRemove={this.removeTask(id)}
                        />
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              )}
              <EditDatasetOnCrux
                datasetId={id}
                description={description}
                tasks={newTasks}
              >
                {editDataset => (
                  <Form.Button
                    color="green"
                    onClick={e => this.openConfirmation(e, editDataset)}
                  >
                    Update Dataset
                  </Form.Button>
                )}
              </EditDatasetOnCrux>
              <Message
                error
                header="Unable to Edit Dataset"
                content={formErrorMessage}
              />
            </Form>
          </Segment>
        </Container>
        <Modal
          open={modalOpen === "UPDATING"}
          onClose={() => this.setState({ modalOpen: "NONE" })}
          closeOnDimmerClick={false}
          size="large"
        >
          <Modal.Content>
            <Header content="Updating dataset" />
            <Progress percent="100" indicating />
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

export default withRouter(EditDatasetForm);
