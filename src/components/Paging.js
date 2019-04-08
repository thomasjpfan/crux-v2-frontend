import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class Paging extends Component {
  render() {
    return (
      <div className='pagination-buttons'>
        <Button content='Previous' icon='left arrow' labelPosition='left' />
        <Button content='Next' icon='right arrow' labelPosition='right' />
      </div>
    )
  }
}

export default Paging;
