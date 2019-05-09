import React, { Component, Fragment } from "react";
import { Button, Divider } from "semantic-ui-react";
import SearchableMyAnalysisCardList from "../CardList/SearchableMyAnalysisCardList";
import SearchableMyDatasetCardList from "../CardList/SearchableMyDatasetCardList";
import LoginFirstButton from "../views/LoginFirstButton";

class DashboardDisplay extends Component {
  state = {
    tabIndex: 0
  };

  tabSwitch = idx => () => {
    this.setState({
      tabIndex: idx
    });
  };

  render() {
    let mainDisplay;
    if (this.state.tabIndex === 0) {
      mainDisplay = <SearchableMyDatasetCardList />;
    } else if (this.state.tabIndex === 1) {
      mainDisplay = <SearchableMyAnalysisCardList />;
    }
    return (
      <Fragment>
        <Button.Group widths="3" color="blue" size="large">
          <Button
            active={this.state.tabIndex === 0}
            onClick={this.tabSwitch(0)}
          >
            My Datasets
          </Button>
          <Button
            active={this.state.tabIndex === 2}
            onClick={this.tabSwitch(1)}
          >
            My Analysis
          </Button>
          <LoginFirstButton to="/createdataset">
            Create New Dataset
          </LoginFirstButton>
        </Button.Group>
        <Divider hidden />
        {mainDisplay}
      </Fragment>
    );
  }
}

export default DashboardDisplay;
