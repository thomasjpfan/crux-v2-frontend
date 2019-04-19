import React from 'react'
import { Segment, Button, Header } from 'semantic-ui-react'

const AlreadyOnFigshare = props => {
  return (
    <Segment>
      <Header as='h3'>{props.title}
        <Button.Group className='create-dataset-header-button'>
          <Button primary={!props.yesPrimary} onClick={props.onNo}>No</Button>
          <Button.Or />
          <Button primary={props.yesPrimary} onClick={props.onYes}>Yes</Button>
        </Button.Group>
      </Header>
    </Segment>)
}

export default AlreadyOnFigshare
