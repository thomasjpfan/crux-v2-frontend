import React, { Component, Fragment } from 'react'
import { Form, Segment, Label, Modal, Button, Icon, Header, Message, List, Progress, Divider } from 'semantic-ui-react'
import { capitalizeFirstLetter } from './utils'
import CategorySearch from '../views/CategorySearch'
import AddDatasetToCrux from './AddDatasetToCrux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { MD5Promise } from './utils'

class CreateDatasetNotOnFigshareForm extends Component {
  fileInput = React.createRef()

  state = {
    title: '',
    licenseValue: 1,
    description: '',
    tasks: [],
    tags: [],


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
  }

  addTaskKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.target.value.length === 0) {
        return
      }
      this.setState({
        tasks: [...this.state.tasks, capitalizeFirstLetter(e.target.value)],
      })
      e.target.value = ''
    }
  }

  removeTask = (id) => (e) => {
    this.setState({
      tasks: [
        ...this.state.tasks.slice(0, id),
        ...this.state.tasks.slice(id + 1, this.state.tasks.length)
      ]
    })
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
    if (this.state.tasks.length === 0) {
      this.setState({
        formErrorMessage: 'Please add a task',
        formErrorLabel: 'tasks'
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

  createDatasetOnFigshare = (e) => {
    this.setState({
      modalOpen: 'CREATE',
      createStatus: 'Creating dataset...',
      createProgress: 10,
      newFileHash: '',
      newFigshareID: '',
      newUploadURL: ''
    })

    // Create article on figshare
    const {
      title,
      description,
      licenseValue,
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
              license: licenseValue,
              defined_type: 'dataset',
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
          `https://api.figshare.com/v2/account/articles/${newFigshareID}/files`,
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

  updateCruxWithDataset = (createDatasetOnCrux) => () => {
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
        return createDatasetOnCrux()
      })
      .then(({ data: { createDataset: { dataset: { id } } } }) => {
        this.setState({
          modalOpen: 'NONE',
        })
        this.props.history.push(`/dataset/${id}`)
      })
      .catch((e) => {
        this.resetState()
        this.setState({
          formErrorMessage: 'Unable to create dataset'
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
    const { licenseValue, tasks, formErrorMessage, title, tags, formErrorLabel, description, createStatus, createProgress, createErrorMessage, newFigshareID, uploadToFigshareSucess, modalOpen } = this.state

    return (<Segment>
      <Form size='large' error={formErrorMessage !== ""}>
        <Form.Input label='Title' placeholder="Crux's Next Top Dataset" onChange={(e, { value }) => this.setState({ title: value })} value={title} error={formErrorLabel === 'title'} />
        <Form.TextArea label='Description' placeholder='Description' onChange={(e, { value }) => this.setState({ description: value })} error={formErrorLabel === 'description'} value={description} />
        <CategorySearch
          handleSelect={(result) => { this.setState({ tags: [...this.state.tags, result] }) }}
          currentItems={tags}
        />
        {tags.length > 0 &&
          <div className='spaced tags-container '>
            <Divider hidden />
            {tags.map(({ title }, id) => {
              return (
                <Label size='large' color='blue' key={id} content={`Tag: ${title}`} onRemove={this.removeTag(id)} />);
            })}
            <Divider hidden />
          </div>
        }
        <Form.Group inline>
          <label>License</label>
          <Form.Radio
            label='CC BY 4.0'
            value={1}
            checked={licenseValue === 1}
            onChange={() => this.setState({ licenseValue: 1 })}
          />
          <Form.Radio
            label='Apache 2.0'
            value={7}
            checked={licenseValue === 7}
            onChange={() => this.setState({ licenseValue: 7 })}
          />
        </Form.Group>
        <Form.Input label='Tasks' onKeyDown={this.addTaskKeyDown} error={formErrorLabel === 'tasks'} />
        {tasks.length > 0 &&
          <List>
            {tasks.map((name, id) => (
              <List.Item key={id}>
                <List.Content >
                  <Label size='large' color='blue' content={`Task: ${name}`} onRemove={this.removeTask(id)} />
                </List.Content>
              </List.Item>
            ))}
          </List>
        }
        <input type="file" className="fileUploader" ref={this.fileInput} />
        <Form.Button primary onClick={this.openConfirmation}>Create Dataset</Form.Button>
        <Message
          error
          header='Unable to Upload Dataset'
          content={formErrorMessage}
        />
      </Form>
      <Modal
        open={modalOpen === 'CONFIRM CREATE'}
        onClose={() => this.setState({ modalOpen: 'NONE' })}
        size='large' >
        <Header content='Are you sure you want to create this dataset?' />
        <Modal.Actions>
          <Button color='red' onClick={() => this.setState({ modalOpen: 'NONE' })}>
            <Icon name='remove' />No
            </Button>
          <Button color='green' onClick={this.createDatasetOnFigshare}>
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
          <Modal.Actions>
            <Message size='large' header='Finished data upload to figshare' color='green' />
            <Button color='red' onClick={() => this.cancelUpload(() => { })} content='Cancel and try again' />
            <Button color='black' onClick={this.viewData} content='Preview Data' />
            <AddDatasetToCrux
              name={title}
              description={description}
              tags={tags.map(({ title }) => title)}
              tasks={tasks}
              figshareID={newFigshareID}
            >
              {(createDatasetOnCrux) => (
                <Button primary onClick={this.updateCruxWithDataset(createDatasetOnCrux)} content='Finish uploading' />
              )}
            </AddDatasetToCrux>
          </Modal.Actions>
        }
      </Modal>
    </Segment >)
  }
}

const mapStateToProps = ({ user }) => (
  {
    figshareToken: user.figshareAccessToken,
  }
)

export default withRouter(connect(mapStateToProps)(CreateDatasetNotOnFigshareForm))
