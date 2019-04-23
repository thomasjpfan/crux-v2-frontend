import React from 'react'
import { Query } from 'react-apollo'
import { Loader, Message, Container } from 'semantic-ui-react'
import SingleAnalysisDisplay from './views/SingleAnalysisDisplay'
import gql from 'graphql-tag'
import { ANALYSIS_FRAGMENT } from './fragments'

const GET_SINGLE_ANALYSIS = gql`
query analysis($id: ID!){
  analysis(id:$id) {
    ...analysisNode
  }
}
${ANALYSIS_FRAGMENT}
`

const SingleAnalysisPage = props => {
  const { params: { analysisId } } = props.match
  return (<Query query={GET_SINGLE_ANALYSIS} variables={{ id: analysisId }}>
    {({ data, loading, error }) => {
      if (loading) {
        return <Container>
          <Loader active inline='centered' />
        </Container>
      }
      if (error) {
        return <Container>
          <Message negative header='Error loading analysis' />
        </Container>
      }

      const { analysis } = data
      return <SingleAnalysisDisplay
        title={analysis.name}
        tags={analysis.dataset.tags.edges}
        figshareId={analysis.figshareId}
        dataset={analysis.dataset}
        task={analysis.task}
        description={analysis.description}
      />
    }}</Query>)
}

export default SingleAnalysisPage;
