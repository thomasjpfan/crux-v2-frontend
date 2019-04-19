import React, { Component } from 'react'
import { Form, Button, Label, Modal, Header, Icon } from 'semantic-ui-react'
import categoryOptions from '../categoryOptions'


class CreateDatasetOnFigshareForm extends Component {
  state = {
    description: this.props.defaultDescription,
    tags: this.props.defaultTags,
    tasks: [],
    taskValue: "",
    confirmCreateModalOpen: false
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

  createDataset = () => {
    this.setState({
      confirmCreateModalOpen: false
    })
    this.props.setFormLoading(true)
  }

  removeTask = (e, { content }) => {
    e.preventDefault()
    this.setState({
      tasks: this.state.tasks.filter((v) => v !== content)
    })
  }

  dropDownChagne = (e, { value }) => {
    this.setState({ tags: value })
  }

  render() {
    const { description, tags, tasks, taskValue, confirmCreateModalOpen } = this.state
    return (
      <Form loading={this.props.formLoading}>
        <Form.Input label='Name' readOnly value={this.props.name} />
        <Form.TextArea label='Description' value={description} onChange={(e, { value }) => this.setState({ description: value })} rows={10} />
        <Form.Dropdown
          label='Tags'
          defaultValue={tags}
          fluid
          multiple
          search
          selection
          options={categoryOptions}
          onChange={this.dropDownChagne}
        />
        <Form.Input label='Tasks' onKeyDown={this.addTaskKeyDown} onChange={this.addTaskOnChange} value={taskValue} />
        {tasks.length > 0 &&
          <div className='spaced tags-container form-tasks'>
            {tasks.map((name, id) => (
              <Label color='black' size='large' key={id} content={name} onRemove={this.removeTask} />
            ))}
          </div>
        }

        <Modal
          trigger={<Button primary type='button' onClick={() => this.setState({ confirmCreateModalOpen: true })}>Create Dataset</Button>}
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
      </Form>)
  }
}


export default CreateDatasetOnFigshareForm
