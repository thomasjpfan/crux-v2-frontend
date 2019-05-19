import React, { Component } from "react";
import MainHeader from "../views/MainHeader";
import {
  Container,
  Header,
  Form,
  Segment,
  Message,
  Modal,
  Progress
} from "semantic-ui-react";
import EditAnalysisOnCrux from "./EditAnalysisOnCrux";
import { withRouter } from "react-router-dom";

class EditAnalysisForm extends Component {
  state = {
    description: this.props.analysis.description,
    formErrorLabel: "",
    formErrorMessage: "",
    modalOpen: "NONE"
  };

  openConfirmation = (e, editAnalysis) => {
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

    editAnalysis()
      .then(({ data: { editAnalysis: { analysis: { id } } } }) => {
        this.setState({
          modalOpen: "UPDATING"
        });
        this.props.history.push(`/analysis/${id}`);
      })
      .catch(e => {
        this.setState({
          modalOpen: "NONE",
          errorMessage: "Error updating analysis on Crux"
        });
      });
  };

  render() {
    const { analysis } = this.props;
    const { id, name } = analysis;
    const {
      description,
      formErrorLabel,
      formErrorMessage,
      modalOpen
    } = this.state;

    return (
      <>
        <MainHeader>
          <Container>
            <Header as="h1" content={`Update Analysis: ${name}`} />
          </Container>
        </MainHeader>
        <Container>
          <Segment>
            <Form size="large" error={formErrorMessage !== ""}>
              <Form.TextArea
                label="Edit Description"
                placeholder="Description"
                onChange={(e, { value }) =>
                  this.setState({ description: value })
                }
                value={description}
                rows={16}
                error={formErrorLabel === "description"}
              />
              <EditAnalysisOnCrux analysisId={id} description={description}>
                {editAnalysis => (
                  <Form.Button
                    color="green"
                    onClick={e => this.openConfirmation(e, editAnalysis)}
                  >
                    Update Analysis
                  </Form.Button>
                )}
              </EditAnalysisOnCrux>
              <Message
                error
                header="Unable to Update Analysis"
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
            <Header content="Updating analysis" />
            <Progress percent="100" indicating />
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

export default withRouter(EditAnalysisForm);
