import React, { Component, Fragment } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';


class CardList extends Component {
  state = {
    items: [],
  }

  componentDidMount() {
    this.setState({
      items: [
        {
          header: 'Titanic',
          description: 'Analyze deaths on the Titanic'
        },
        {
          header: 'Youtube',
          description: 'Analyze user behavior patterns on https://www.youtube.com'
        },
        {
          header: 'Wine',
          description: 'Wine is yumm'
        },
      ]
    })
  }

  render() {
    return (
      <Fragment>
        <Grid stackable columns={2} stretched>
          {this.state.items.map(({ header, description }, i) => (
            <Grid.Column key={i}>
              <Segment>
                <Header as='h3' dividing>{header}</Header>
                <p className='card-description'>{description}</p>
              </Segment>
            </Grid.Column>
          ))}
        </Grid>
      </Fragment>
    )
  }
}


export default CardList;
