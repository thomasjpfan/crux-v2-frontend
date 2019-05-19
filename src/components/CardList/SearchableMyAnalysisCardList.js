import { debounce } from "throttle-debounce";
import React, { Component, Fragment } from "react";
import { Input, Divider } from "semantic-ui-react";
import AnalysesCardList from "./AnalysesCardList";
import gql from "graphql-tag";
import { connect } from "react-redux";
import NotLoggedInMessage from "../views/NotLoggedInMessage";

const GET_USER_ANALYSES = gql`
  query analyses($after: String, $name: String, $createdBy: ID) {
    analyses(
      after: $after
      first: 10
      name_Icontains: $name
      createdBy: $createdBy
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          name
          description
          id
        }
      }
    }
  }
`;

class SearchableMyAnalysesCardList extends Component {
  state = {
    inputQuery: "",
    searchQuery: "",
    loading: false
  };

  setQueryDebounced = debounce(500, () => {
    this.setState({
      searchQuery: this.state.inputQuery,
      loading: false
    });
  });

  changeQuery = (e, { value }) => {
    this.setState(
      {
        inputQuery: value,
        loading: true
      },
      () => {
        this.setQueryDebounced();
      }
    );
  };

  render() {
    if (!this.props.loggedIn) {
      return <NotLoggedInMessage />;
    }
    return (
      <Fragment>
        <Input
          icon="search"
          iconPosition="left"
          placeholder="Search for title..."
          fluid
          onChange={this.changeQuery}
          loading={this.state.loading}
        />
        <Divider hidden />
        <AnalysesCardList
          query={GET_USER_ANALYSES}
          additionalVariables={{
            name: this.state.searchQuery,
            createdBy: this.props.cruxUID
          }}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  loggedIn: user.loggedIn,
  cruxUID: user.cruxUID
});

export { GET_USER_ANALYSES };
export default connect(mapStateToProps)(SearchableMyAnalysesCardList);
