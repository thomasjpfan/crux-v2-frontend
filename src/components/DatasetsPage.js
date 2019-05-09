import React, { Component } from "react";
import { Container, Header, Button, Divider } from "semantic-ui-react";
import MainHeader from "./views/MainHeader";
import SearchableDatasetCardList from "./CardList/SearchableDatasetCardList";
import SearchableMyDatasetCardList from "./CardList/SearchableMyDatasetCardList";
import LoginFirstButton from "./views/LoginFirstButton";

class DatasetsPage extends Component {
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
    if (this.state.tabIndex === 1) {
      mainDisplay = <SearchableMyDatasetCardList />;
    } else {
      mainDisplay = <SearchableDatasetCardList />;
    }
    return (
      <React.Fragment>
        <MainHeader>
          <Container>
            <Header as="h1">Datasets</Header>
          </Container>
        </MainHeader>
        <Container>
          <Button.Group widths="3" color="blue" size="large">
            <Button
              active={this.state.tabIndex === 0}
              onClick={this.tabSwitch(0)}
            >
              All
            </Button>
            <Button
              active={this.state.tabIndex === 1}
              onClick={this.tabSwitch(1)}
            >
              My Datasets
            </Button>
            <LoginFirstButton to="/createdataset">
              Create New Dataset
            </LoginFirstButton>
          </Button.Group>
          <Divider hidden />
          {mainDisplay}
        </Container>
      </React.Fragment>
    );
  }
}

export default DatasetsPage;
