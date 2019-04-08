import React, { Component } from 'react';

class MainHeader extends Component {
  render() {
    return (
      <div className="main-header">
        {this.props.children}
      </div>
    )
  }
}

export default MainHeader;
