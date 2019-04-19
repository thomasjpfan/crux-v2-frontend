import React, { Fragment } from 'react';
import { Grid, Header, Segment, Button, Divider, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const CardList = props => {
  const items = props.items.edges || []
  if (items.length !== 0) {
    return (<Fragment>
      <Grid stackable columns={2} stretched>
        {items.map(({ node }, i) => (
          <Grid.Column key={i}>
            <Segment>
              <Header as='h2'>
                <Link to={`${props.rooturi}/${node.id}`}>
                  {node.name}
                </Link>
              </Header>
              <Divider />
              <p className='card-description'>{node.description.substring(0, 300)}...</p>
            </Segment>
          </Grid.Column>
        ))}
      </Grid>
      <Divider hidden />
      <Button className="show-more-btn" content={props.showMoreContent} onClick={props.showMore} disabled={!props.activeMoreButton}></Button>
    </Fragment>)
  }
  return (
    <Message warning header={props.noDataContent} size='large' />
  )
}

export default CardList
