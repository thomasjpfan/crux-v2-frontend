import React, { Component } from "react";
import { Modal, Button, Label } from "semantic-ui-react";

class ModalWebViewer extends Component {
  state = {
    modalOpen: false,
    width: 0,
    height: 0
  };

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  render() {
    const { innerHeight } = window;
    const iframeHeight = innerHeight * 0.8;

    return (
      <Modal
        trigger={
          <Button onClick={this.handleOpen} {...this.props.buttonProps} />
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="fullscreen"
        className="webmodal"
      >
        <Modal.Header>{this.props.title}</Modal.Header>
        <Modal.Content>
          <iframe
            title={this.props.title}
            src={this.props.iframeSrc}
            width="100%"
            height={`${iframeHeight}px`}
            frameBorder={0}
          />
        </Modal.Content>
        <Modal.Actions>
          <Label size="large" color="green" className="dataset-helper-label">
            Click tab above Figshare to View
          </Label>
          <Button negative onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ModalWebViewer;
