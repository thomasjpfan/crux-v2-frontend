import React, { Component } from 'react'
import { Form, Segment, Label, Modal, Button, Icon, Header, Message } from 'semantic-ui-react'
import categoryOptions from '../categoryOptions'


class CreateDatasetNotOnFigshareForm extends Component {
  constructor(props) {
    super(props)
    this.fileInput = React.createRef()
  }

  state = {
    title: '',
    licenseValue: '1',
    description: '',
    taskValue: "",
    tasks: [],
    tags: [],
    confirmCreateModalOpen: false,
    errorMessage: '',
    file: ''
  }

  addTaskOnChange = (e, { value }) => {
    this.setState({
      taskValue: value
    })
  }

  addTaskKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value.length === 0) {
        return
      }
      this.setState({
        tasks: [...this.state.tasks, e.target.value],
        taskValue: ""
      })
    }
  }

  removeTask = (e, { content }) => {
    e.preventDefault()
    this.setState({
      tasks: this.state.tasks.filter((v) => v !== content)
    })
  }

  selectTag = (e, { value }) => {
    this.setState({
      tags: value
    })
  }

  openConfirmation = () => {
    // validate form
    if (this.state.title === '') {
      this.setState({ errorMessage: 'Please add a title' })
      return
    }
    if (this.state.description === '') {
      this.setState({ errorMessage: 'Please add a description' })
      return
    }
    if (this.state.tags.length === 0) {
      this.setState({ errorMessage: 'Please add a tags' })
      return
    }
    if (this.state.tasks.length === 0) {
      this.setState({ errorMessage: 'Please add a task' })
      return
    }
    if (this.fileInput.current.files.length === 0) {
      this.setState({ errorMessage: 'Please choose a file' })
      return
    }
    this.setState({ confirmCreateModalOpen: true })
  }

  createDataset = () => {
    // create dataset on figshare
  }

  render() {
    const { licenseValue, tasks, confirmCreateModalOpen, errorMessage } = this.state
    const hasErrorMessage = errorMessage !== ""
    return (<Segment>
      <Form size='large' error={hasErrorMessage}>
        <Form.Input label='Title' placeholder="Crux's Next Top Dataset" onChange={(e, { value }) => this.setState({ title: value })} />
        <Form.TextArea label='Description' placeholder='Description' onChange={(e, { value }) => this.setState({ description: value })} />
        <Form.Dropdown
          label='Tags'
          fluid
          multiple
          search
          selection
          options={categoryOptions}
          onChange={this.selectTag}
        />
        <Form.Group inline>
          <label>License</label>
          <Form.Radio
            label='CC BY 4.0'
            value='1'
            checked={licenseValue === '1'}
            onChange={() => this.setState({ licenseValue: '1' })}
          />
          <Form.Radio
            label='Apache 2.0'
            value='2'
            checked={licenseValue === '2'}
            onChange={() => this.setState({ licenseValue: '2' })}
          />
        </Form.Group>
        <Form.Input label='Tasks' onKeyDown={this.addTaskKeyDown} onChange={this.addTaskOnChange} />
        {tasks.length > 0 &&
          <div className='spaced tags-container form-tasks'>
            {tasks.map((name, id) => (
              <Label color='black' size='large' key={id} content={name} onRemove={this.removeTask} />
            ))}
          </div>
        }
        <input type="file" className="fileUploader" ref={this.fileInput} />
        <Modal
          trigger={<Button primary type='button' onClick={this.openConfirmation}>Create Dataset</Button>}
          open={confirmCreateModalOpen}
          onClose={() => this.setState({ confirmCreateModalOpen: false })}
          size='large' >
          <Header content='Are you sure you want to create this dataset?' />
          <Modal.Actions>
            <Button color='red' onClick={() => this.setState({ confirmCreateModalOpen: false })} inverted>
              <Icon name='remove' />No
            </Button>
            <Button color='green' onClick={this.createDataset} inverted>
              <Icon name='checkmark' />Yes
            </Button>
          </Modal.Actions>
        </Modal>
        <Message
          error
          header='Unable to Upload Dataset'
          content={errorMessage}
        />
      </Form>
    </Segment>)
  }
}

export default CreateDatasetNotOnFigshareForm
