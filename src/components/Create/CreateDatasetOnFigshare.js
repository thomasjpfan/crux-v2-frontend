import React, { Component, Fragment } from 'react'
import { Form, Button, Segment, Message, Header } from 'semantic-ui-react'
import FigshareAxios from '../../FigshareAxios'
import CreateDatasetOnFigshareForm from './CreateDatasetOnFigshareForm'

class CreateDatasetOnFigshare extends Component {
  state = {
    figshareURL: "https://figshare.com/articles/Activated_Carbon-Loaded_Polydimethylsiloxane_Membranes_for_the_Pervaporation_of_1-Butanol_from_Aqueous_Solutions/7482851",
    figshareURLFormLoading: false,
    figshareURLFormErrorMsg: "",
    figshareURLResponse: null
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
    const getFigshareInfoURL = `/articles/${figshareID}`

    this.setState({ figshareURLFormLoading: true })
    FigshareAxios.get(getFigshareInfoURL)
      .then((r) => {
        this.setState({ figshareURLResponse: r.data, figshareURLFormLoading: false })
      })
      .catch((e) => {
        this.setState({ figshareURLFormErrorMsg: "Unable to get information from FigShare. Please confirm the url is correct" })
      })
      .finally(() => {
        this.setState({ figshareURLFormLoading: false })
      })
  }

  render() {
    const { figshareURLFormLoading, figshareURLFormErrorMsg, figshareURL, figshareURLResponse } = this.state

    const figshareURLFormHasError = figshareURLFormErrorMsg !== ""

    var createDatasetForm
    if (figshareURLResponse) {
      const tags = figshareURLResponse.categories.map(({ id }) => id)

      createDatasetForm = (<Segment>
        <Header as='h2' content='Add Dataset from FigShare' />
        <CreateDatasetOnFigshareForm
          name={figshareURLResponse.title}
          defaultDescription={figshareURLResponse.description.replace(/(<([^>]+)>)/ig, "")}
          defaultTags={tags}
          figshareID={figshareURLResponse.id}
          formLoading={figshareURLFormLoading}
          setFormLoading={(v) => this.setState({ figshareURLFormLoading: v })}
        /></Segment>)
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

export default CreateDatasetOnFigshare;
