import React, { Component, Fragment } from 'react'
import { Form, Button, Segment, Message, Header } from 'semantic-ui-react'
import CreateDatasetFromFigshareForm from './CreateDatasetFromFigshareForm'
import ModalWebViewer from '../views/ModalWebViewer'

class CreateDatasetFromFigshare extends Component {
  state = {
    figshareURL: "",
    figshareURLFormLoading: false,
    figshareURLFormErrorMsg: "",
    figshareURLResponse: null,
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
          description: parsedDescription,
          figshareURLFormLoading: false,
          tags: tags,
          figshareID: id,
          title: title,
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
    const figshareURLFormHasError = figshareURLFormErrorMsg !== ""

    var createDatasetForm
    if (figshareID) {
      createDatasetForm = (<Fragment>
        <Segment>
          <Header as='h2' content='Add Dataset from FigShare' />
          <ModalWebViewer
            buttonProps={{ secondary: true, content: 'View Data' }}
            title={title}
            iframeSrc={`https://widgets.figshare.com/articles/${figshareID}/embed`}
          />
        </Segment>
        <Segment>
          <CreateDatasetFromFigshareForm
            name={title}
            description={description}
            tags={tags}
            figshareID={figshareID}
            key={figshareID}
          /></Segment></Fragment>)
    }

    return (
      <Fragment>
        <Segment size='large'>
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
        {createDatasetForm}
      </Fragment>
    )
  }
}

export default CreateDatasetFromFigshare;
