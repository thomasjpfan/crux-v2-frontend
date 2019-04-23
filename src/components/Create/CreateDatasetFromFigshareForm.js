import React, { Component } from 'react'
import { Form, Button, Label, Modal, Header, Icon, Progress, Message, List, Divider } from 'semantic-ui-react'
import AddDatasetToCrux from './AddDatasetToCrux'
import { withRouter } from 'react-router-dom'
import { capitalizeFirstLetter } from './utils'
import CategorySearch from '../views/CategorySearch'


class CreateDatasetFromFigshareForm extends Component {

  state = {
    name: this.props.name,
    description: this.props.description,
    tags: this.props.tags,
    tasks: [],
    confirmCreateModalOpen: false,
    createDatasetModalOpen: false,
    errorMessage: "",
    errorFormLabel: ""
  }

  removeTag = (id) => (e) => {
    this.setState({
      tags: [
        ...this.state.tags.slice(0, id),
        ...this.state.tags.slice(id + 1, this.state.tags.length)
      ]
    })
  }
  addTaskKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.target.length === 0) {
        return
      }
      this.setState({
        tasks: [...this.state.tasks, capitalizeFirstLetter(e.target.value)],
      })
      e.target.value = ''
    }
  }

  validateForm = () => {
    if (this.state.name === "") {
      this.setState({
        errorMessage: 'Please add a name',
        errorFormLabel: 'name'
      })
      return
    }
    if (this.state.description === "") {
      this.setState({
        errorMessage: 'Please add a description',
        errorFormLabel: 'description'
      })
      return
    }
    if (this.state.tags.length === 0) {
      this.setState({
        errorMessage: 'Please add a tag',
        errorFormLabel: 'tags'
      })
      return
    }
    if (this.state.tasks.length === 0) {
      this.setState({
        errorMessage: 'Please add a task',
        errorFormLabel: 'tasks'
      })
      return
    }
    this.setState({
      confirmCreateModalOpen: true,
      errorMessage: '',
      errorFormLabel: '',
    })
  }

  createDataset = (e, createSingleDatasetOnFigshare) => {
    // Error check
    this.setState({
      confirmCreateModalOpen: false,
      createDatasetModalOpen: true,
      errorMessage: ''
    })
    createSingleDatasetOnFigshare()
      .then(({ data: { createDataset: { dataset: { id } } } }) => {
        this.setState({
          createDatasetModalOpen: false,
        })
        this.props.history.push(`/dataset/${id}`)

      })
      .catch((e) => {
        this.setState({
          createDatasetModalOpen: false,
          errorMessage: 'Error adding dataset to Crux'
        })
      })
  }

  removeTask = (id) => (e) => {
    e.preventDefault()
    this.setState({
      tasks: [
        ...this.state.tasks.slice(0, id),
        ...this.state.tasks.slice(id + 1, this.state.tasks.length)
      ]
    })
  }

  render() {
    const { tasks, confirmCreateModalOpen, createDatasetModalOpen, errorMessage, tags, name, description, errorFormLabel } = this.state
    const { figshareID } = this.props

    return (
      <Form error={errorMessage !== ""}>
        <Form.Input label='Name' value={name} onChange={(e, { value }) => this.setState({ name: value })} error={errorFormLabel === 'name'} />
        <Form.TextArea label='Description' value={description} onChange={(e, { value }) => this.setState({ description: value })} rows={10} error={errorFormLabel
          === 'description'} />
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
        <Form.Input label='Tasks' onKeyDown={this.addTaskKeyDown} error={errorFormLabel === 'tasks'} />
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
        <Modal
          trigger={<Button primary type='button' onClick={this.validateForm}>Create Dataset</Button>}
          open={confirmCreateModalOpen}
          onClose={() => this.setState({ confirmCreateModalOpen: false })}
          size='large' >
          <Header content='Are you sure you want to create this dataset?' />
          <Modal.Actions>
            <Button color='red' onClick={() => this.setState({ confirmCreateModalOpen: false })}>
              <Icon name='remove' />No
            </Button>
            <AddDatasetToCrux
              name={name}
              description={description}
              tags={tags.map(({ title }) => title)}
              figshareID={figshareID}
              tasks={tasks}
            >
              {(createSingleDatasetOnFigshare) => (<Button color='green' onClick={(e) => this.createDataset(e, createSingleDatasetOnFigshare)}>
                <Icon name='checkmark' />Yes
                </Button>)
              }
            </AddDatasetToCrux>
          </Modal.Actions>
        </Modal>
        <Message
          error
          header='Unable to Create Dataset'
          content={errorMessage}
        />
        <Modal
          open={createDatasetModalOpen}
          onClose={() => this.setState({ createDatasetModalOpen: false })}
          closeOnDimmerClick={false}
          size='large' >
          <Modal.Content>
            <Header content='Creating Dataset...' />
            <Progress percent={100} indicating color='blue' />
          </Modal.Content>
        </Modal>
      </Form>)
  }
}


export default withRouter(CreateDatasetFromFigshareForm)
