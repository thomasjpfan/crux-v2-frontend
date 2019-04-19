import React, { Component, Fragment } from 'react'
import { Button, Divider } from 'semantic-ui-react'
import MyAnalysesCardList from '../CardList/MyAnalysesCardList'
import SearchableMyDatasetCardList from '../CardList/SearchableMyDatasetCardList'


class DashboardDisplay extends Component {
  state = {
    tabIndex: 0
  }

  tabSwitch = (idx) => () => {
    this.setState({
      tabIndex: idx
    })
  }

  render() {
    let mainDisplay
    if (this.state.tabIndex === 0) {
      mainDisplay = (<SearchableMyDatasetCardList />)
    } else {
      mainDisplay = (<MyAnalysesCardList />)
    }
    return (
      <Fragment>
        <Button.Group widths='2' color='blue' size='large'>
          <Button active={this.state.tabIndex === 0} onClick={this.tabSwitch(0)}>My Datasets</Button>
          <Button active={this.state.tabIndex === 1} onClick={this.tabSwitch(1)}>My Analysis</Button>
        </Button.Group>
        <Divider hidden />
        {mainDisplay}
      </Fragment>
    )
  }
}

export default DashboardDisplay;
