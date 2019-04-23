import React from 'react';
import { Redirect } from 'react-router-dom';
import { withApollo, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { Message, Container } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { FIGSHARE_AUTH_STATE_STORAGE_KEY } from '../../Config'
import { loginAction } from '../../redux/user'

const CRUX_LOGIN = gql`
  mutation socialAuth($accessToken: String!) {
    socialAuth(input:{provider: "figshare", accessToken: $accessToken}){
      social {
        user {
          id
          username
        }
      }
      token
    }
  }
`

const Figshare = props => {
  const urlQuery = new URLSearchParams(props.location.search)
  const access_token = urlQuery.get('access_token')
  const url_state = urlQuery.get('state')
  const local_url_state = localStorage.getItem(FIGSHARE_AUTH_STATE_STORAGE_KEY)

  if (url_state !== local_url_state || !access_token) {
    return (<Container>
      <Message floating header="Error logging in to figshare. Please try again" negative />
    </Container>)
  }

  props.socialAuth({
    variables: {
      accessToken: access_token,
    }
  }).then(({ data }) => {
    const { social, token } = data.socialAuth
    const { id, username } = social.user
    props.onLogin(access_token, token, username, id)
  })

  return <Redirect to="/dashboard" />
}

const mapDispatchToProps = (dispatch) => (
  {
    onLogin: (figshare_token, crux_token, username, cruxUID) => (
      dispatch(loginAction(figshare_token, crux_token, username, cruxUID))
    ),
  }
)

const FigshareDisplay = connect(() => ({}), mapDispatchToProps)(Figshare)

export default compose(
  withApollo,
  graphql(CRUX_LOGIN, { name: 'socialAuth' })
)(FigshareDisplay)
