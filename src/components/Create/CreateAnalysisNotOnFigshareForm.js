import React, { Component, Fragment } from 'react'
import { Form, Segment, Modal, Button, Icon, Header, Message, List, Label, Progress } from 'semantic-ui-react'
import CategorySearch from '../views/CategorySearch'
import AddAnalysisToCrux from './AddAnalysisToCrux'
import { MD5Promise } from './utils'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

class CreateAnalysisNotOnFigshareForm extends Component {
  fileInput = React.createRef()

  state = {
    title: '',
    description: '',
    tags: this.props.defaultTags,

    modalOpen: 'NONE',

    createStatus: '',
    createErrorMessage: '',
    createProgress: 0,

    formErrorMessage: '',
    formErrorLabel: '',

    newFigshareID: '',
    newFileHash: '',
    newUploadURL: '',

    uploadToFigshareSucess: false,
  }

  removeTag = (id) => (e) => {
    this.setState({
      tags: [
        ...this.state.tags.slice(0, id),
        ...this.state.tags.slice(id + 1, this.state.tags.length)
      ]
    })
  }

  openConfirmation = () => {
    // validate form
    if (this.state.title === '') {
      this.setState({
        formErrorMessage: 'Please add a title',
        formErrorLabel: 'title'
      })
      return
    }
    if (this.state.description === '') {
      this.setState({
        formErrorMessage: 'Please add a description',
        formErrorLabel: 'description'
      })
      return
    }
    if (this.state.tags.length === 0) {
      this.setState({
        formErrorMessage: 'Please add a tags',
        formErrorLabel: ''
      })
      return
    }
    if (this.fileInput.current.files.length === 0) {
      this.setState({
        formErrorMessage: 'Please choose a file',
        formErrorLabel: ''
      })
      return
    }
    this.setState({
      modalOpen: 'CONFIRM CREATE',
      formErrorMessage: '',
      formErrorLabel: ''
    })
  }

  createAnalysisOnFigshare = (e) => {
    // create dataset on figshare
    this.setState({
      modalOpen: 'CREATE',
      createStatus: 'Creating analysis...',
      createProgress: 10,
      newFileHash: '',
      newFigshareID: '',
      newUploadURL: ''
    })

    // Create article on figshare
    const {
      title,
      description,
      tags,
    } = this.state

    const file = this.fileInput.current.files[0]
    const keywords = tags.map(({ title }) => title)
    const tagIds = tags.map(({ id }) => id)
    const figshareToken = this.props.figshareToken
    const authHeader = new Headers({ 'Authorization': `token ${figshareToken}` })

    MD5Promise(file)
      .then(data => {
        this.setState({
          newFileHash: data.hash,
          createProgress: 20
        })
        return fetch(
          'https://api.figshare.com/v2/account/articles', {
            method: 'POST',
            body: JSON.stringify({
              title: title,
              description: description,
              keywords: keywords,
              license: 3,
              defined_type: 'code',
              categories: tagIds
            }),
            headers: authHeader
          })
      })
      .then(response => response.json())
      .then(data => {
        const locationParts = data.location.split("/")
        const newFigshareID = locationParts[locationParts.length - 1]
        this.setState({
          createProgress: 30,
          newFigshareID: newFigshareID
        })

        const { newFileHash } = this.state
        return fetch(
          `https://api.figshare.com/v2//account/articles/${newFigshareID}/files`,
          {
            method: "POST",
            body: JSON.stringify({
              md5: newFileHash,
              name: file.name,
              size: file.size
            }),
            headers: authHeader
          }
        )
      })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          createProgress: 40,
        })
        const location = data.location
        return fetch(location, { headers: authHeader })
      })
      .then(response => response.json())
      .then((data) => {
        const uploadURL = data.upload_url
        this.setState({
          newUploadURL: uploadURL,
          newFileID: data.id
        })
        return fetch(uploadURL)
      }).then(response => response.json())
      .then((data) => {
        this.setState({
          createProgress: 50,
        })
        const newUploadURL = this.state.newUploadURL
        const parts = data.parts
        const partsPromises = parts.map(({ startOffset, endOffset, partNo }) => {
          return fetch(`${newUploadURL}/${partNo}`,
            {
              method: 'PUT',
              body: file.slice(startOffset, endOffset + 1)
            })
        })
        return Promise.all(partsPromises)
      })
      .then(() => {
        const { newFigshareID, newFileID } = this.state
        this.setState({
          createProgress: 60
        })
        return fetch(`https://api.figshare.com/v2/account/articles/${newFigshareID}/files/${newFileID}`,
          {
            method: 'POST',
            headers: authHeader
          })
      })
      .then(() => {
        const { newFigshareID } = this.state
        this.setState({
          createProgress: 70
        })
        return fetch(`https://api.figshare.com/v2/account/articles/${newFigshareID}/private_links`,
          {
            method: 'POST',
            headers: authHeader
          })
      })
      .then(response => response.json())
      .then(data => {
        const locationParts = data.location.split("/")
        const newPrivateID = locationParts[locationParts.length - 1]
        this.setState({
          newPrivateURL: `https://figshare.com/s/${newPrivateID}`
        })
      })
      .then((data) => {
        this.setState({
          uploadToFigshareSucess: true,
          createProgress: 80
        })
      })
      .catch((errorMsg) => {
        this.setState({
          createErrorMessage: errorMsg
        })
      })
  }

  updateCruxWithAnalysis = (createAnalysisOnCrux) => () => {
    const figshareToken = this.props.figshareToken
    const { newFigshareID } = this.state
    const authHeader = new Headers({ 'Authorization': `token ${figshareToken}` })

    fetch(`https://api.figshare.com/v2/account/articles/${newFigshareID}/publish`,
      { method: "POST", headers: authHeader })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Unable to publish")
      })
      .then(() => {
        this.setState({ createProgress: 80 })
        return createAnalysisOnCrux()
      })
      .then(({ data: { createAnalysis: { analysis: { id } } } }) => {
        this.setState({
          modalOpen: 'NONE',
        })
        this.props.history.push(`/analysis/${id}`)
      })
      .catch((e) => {
        this.resetState()
        this.setState({
          formErrorMessage: 'Unable to create analysis'
        })
      })
  }

  resetState = () => {
    this.setState({
      createStatus: '',
      createErrorMessage: '',
      createProgress: 0,

      modalOpen: 'NONE',

      formErrorMessage: '',
      formErrorLabel: '',

      newFigshareID: '',
      newFileHash: '',
      newUploadURL: '',
      newPrivateURL: '',
      newFileID: '',

      uploadToFigshareSucess: false,
    })
  }

  cancelUpload = (cleanUp) => {
    const { newFigshareID } = this.state

    if (newFigshareID === '') {
      this.resetState()
      cleanUp()
      return
    }

    const figshareToken = this.props.figshareToken
    const authHeader = new Headers({ 'Authorization': `token ${figshareToken}` })
    fetch(`https://api.figshare.com/v2/account/articles/${newFigshareID}`,
      { method: 'DELETE', headers: authHeader })
      .then(() => {
        this.resetState()
        cleanUp()
      }).catch(() => {
        this.resetState()
        cleanUp()
      })
  }

  viewData = () => {
    const { newPrivateURL } = this.state
    window.open(newPrivateURL)
  }

  render() {
    const { title, description, tags, newFigshareID, formErrorMessage, formErrorLabel, modalOpen, createStatus, createErrorMessage, createProgress, uploadToFigshareSucess } = this.state
    const { dataset, task } = this.props

    let taskID
    if (task) {
      taskID = task.id
    } else {
      taskID = ''
    }

    return (<Segment>
      <Form size='large' error={formErrorMessage !== ""}>
        <Form.Input label='Title' placeholder="Crux's Next Top Analysis" onChange={(e, { value }) => this.setState({ title: value })} error={formErrorLabel === 'title'} value={title} />
        <Form.TextArea label='Description' placeholder='Tell me more' onChange={(e, { value }) => this.setState({ description: value })} error={formErrorLabel === 'description'} value={description} />
        <CategorySearch
          handleSelect={(result) => { this.setState({ tags: [...this.state.tags, result] }) }}
        />
        {tags.length > 0 &&
          <List>
            {tags.map(({ title }, id) => {
              return (<List.Item key={id}>
                <List.Content>
                  <Label size='large' color='blue' content={`Tag: ${title}`} onRemove={this.removeTag(id)} />
                </List.Content>
              </List.Item>);
            })}
          </List>
        }
        <input type="file" className="fileUploader" ref={this.fileInput} />
        <Button primary type='button' onClick={this.openConfirmation}>Create Analysis</Button>
        <Message
          error
          header='Unable to Upload Analysis'
          content={formErrorMessage}
        />
      </Form>
      <Modal
        open={modalOpen === 'CONFIRM CREATE'}
        onClose={() => this.setState({ modalOpen: 'NONE' })}
        size='large' >
        <Header content='Are you sure you want to create this Analysis?' />
        <Modal.Actions>
          <Button color='red' onClick={() => this.setState({ modalOpen: 'NONE' })}>
            <Icon name='remove' />No
            </Button>

          <Button color='green' onClick={this.createAnalysisOnFigshare}>
            <Icon name='checkmark' />Yes</Button>
        </Modal.Actions>
      </Modal>
      <Modal
        open={modalOpen === 'CREATE'}
        onClose={() => this.setState({ modalOpen: 'NONE' })}
        closeOnDimmerClick={false}
        size='large' >
        <Modal.Content>
          <Header content={createStatus} />
          <Progress percent={createProgress} indicating />
          {
            createErrorMessage.length > 0 &&
            <Fragment>
              <Message error size='large' header={createErrorMessage} />
              <Button color='red' onClick={() => this.cancelUpload(() => { })}>
                <Icon name='remove' />Cancel and try again
            </Button>
            </Fragment>
          }
        </Modal.Content>
        {
          uploadToFigshareSucess &&
          <Fragment>
            <Modal.Actions>
              <Message size='large' header='Finished data upload to figshare' color='green' />
              <Button color='red' onClick={() => this.cancelUpload(() => { })} content='Cancel and try again' />
              <Button color='black' onClick={this.viewData} content='Preview Analysis' />
              <AddAnalysisToCrux
                name={title}
                description={description}
                tags={tags.map(({ title }) => title)}
                figshareID={newFigshareID}
                taskID={taskID}
                datasetID={dataset.id}
              >
                {(createAnalysisOnCrux) => (
                  <Button primary onClick={this.updateCruxWithAnalysis(createAnalysisOnCrux)} content='Finish uploading' />
                )}
              </AddAnalysisToCrux>
            </Modal.Actions>
          </Fragment>
        }
      </Modal>
    </Segment>)
  }
}

const mapStateToProps = ({ user }) => (
  {
    figshareToken: user.figshareAccessToken,
  }
)

export default withRouter(connect(mapStateToProps)(CreateAnalysisNotOnFigshareForm))
