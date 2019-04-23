import React, { Component, Fragment } from 'react'
import { Form, Message, Button, Segment, Header } from 'semantic-ui-react'
import CreateAnalysisFromFigshareForm from './CreateAnalysisFromFigshareForm'
import ModalWebViewer from '../views/ModalWebViewer'


class CreateAnalysisFromFigshare extends Component {
  state = {
    figshareURL: "",
    figshareURLFormLoading: false,
    figshareURLFormErrorMsg: "",
    title: null,
    figshareID: null,
    tags: null,
    description: null,
  }

  loadDataFromFigshare = (e) => {
    e.preventDefault();
    // Check url starts with figshare
    const { figshareURL } = this.state
    if (!figshareURL.startsWith('https://figshare.com/articles')) {
      this.setState({ figshareURLFormErrorMsg: "URL must start with https://figshare.com/articles" })
      return
    }
    this.setState({ figshareURLFormErrorMsg: "" })

    // Get data from url
    const url = new URL(figshareURL)
    const urlPathnameSpllit = url.pathname.split("/")
    const figshareID = urlPathnameSpllit[urlPathnameSpllit.length - 1]
    const getFigshareInfoURL = `https://api.figshare.com/v2/articles/${figshareID}`

    this.setState({ figshareURLFormLoading: true })
    fetch(getFigshareInfoURL)
      .then(response => response.json())
      .then((data) => {
        const { id, title, categories, description } = data
        const tags = categories.map(({ id, title }) => ({ id, title }))
        const parsedDescription = description.replace(/(<([^>]+)>)/ig, "")

        this.setState({
          figshareURLFormLoading: false,
          tags: tags,
          figshareID: id,
          title: title,
          description: parsedDescription
        })
      })
      .catch((e) => {
        this.setState({ figshareURLFormErrorMsg: "Unable to get information from FigShare. Please confirm the url is correct" })
      })
      .finally(() => {
        this.setState({ figshareURLFormLoading: false })
      })
  }

  render() {
    const { figshareURLFormLoading, figshareURLFormErrorMsg, figshareURL, figshareID, tags, title, description } = this.state
    const { dataset, task } = this.props
    const figshareURLFormHasError = figshareURLFormErrorMsg !== ""

    let taskID
    if (task) {
      taskID = task.id
    } else {
      taskID = 'NO TASK'
    }
    const taskOptions = [...dataset.taskSet.edges.map(({ node: { id, name } }) => ({
      key: id, text: name, value: id
    })), { key: 'NO TASK', text: "No Task Selected", value: 'NO TASK' }]

    var createAnalysisForm
    if (figshareID) {
      createAnalysisForm = (<Fragment><Segment>
        <Header as='h2' content='Add Analysis from FigShare' />
        <ModalWebViewer
          buttonProps={{ secondary: true, content: 'View Analysis' }}
          title={title}
          iframeSrc={`https://widgets.figshare.com/articles/${figshareID}/embed`}
        />
      </Segment>
        <Segment>
          <CreateAnalysisFromFigshareForm
            name={title}
            description={description}
            tags={tags}
            figshareID={figshareID}
            datasetID={dataset.id}
            taskOptions={taskOptions}
            taskID={taskID}
            key={figshareID}
          /></Segment></Fragment>)
    }

    return (<Fragment><Segment>
      <Form onSubmit={this.loadDataFromFigshare} loading={figshareURLFormLoading}
        error={figshareURLFormHasError}>
        <Form.Input label='Enter Figshare URL' placeholder='https://figshare.com/articles'
          onChange={(e, { value }) => this.setState({ figshareURL: value })}
          value={figshareURL} error={figshareURLFormHasError} />
        <Message
          error
          header="Unable to load Figshare URL"
          content={figshareURLFormErrorMsg}
        />
        <Button primary>Submit</Button>
      </Form>
    </Segment>
      {createAnalysisForm}
    </Fragment>)
  }
}

export default CreateAnalysisFromFigshare
