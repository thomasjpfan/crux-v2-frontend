import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import { Loader, Message, Container } from 'semantic-ui-react'
import SingleDatasetDisplay from './views/SingleDatasetDisplay'
import gql from 'graphql-tag'
import { DATASET_FRAGMENT } from './fragments'

const GET_SINGLE_DATASET = gql`
  query dataset($id: ID!){
    dataset(id: $id) {
      ...datasetNode
    }
  }

  ${DATASET_FRAGMENT}
`


const SingleDataset = props => {
  const { params: { datasetId } } = props.match
  return (<Fragment>
    <Query query={GET_SINGLE_DATASET} variables={{ id: datasetId }}>
      {({ data, loading, error }) => {
        if (loading) {
          return <Container>
            <Loader active inline='centered' />
          </Container>
        }
        if (error) {
          return <Container>
            <Message negative>
              <Message.Header>Error loading dataset</Message.Header>
            </Message>
          </Container>
        }

        const { dataset } = data
        return <SingleDatasetDisplay
          datasetId={datasetId}
          title={dataset.name}
          tasks={dataset.taskSet.edges}
          description={dataset.description}
          analyses={dataset.analysisSet.edges}
          figshareId={dataset.figshareId}
          tags={dataset.tags.edges}
        />
      }}</Query></Fragment>)
}

export default SingleDataset;
