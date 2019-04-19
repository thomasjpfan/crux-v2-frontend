import React from 'react'
import { Popup } from 'semantic-ui-react'
import { connect } from 'react-redux'
import LinkButton from './LinkButton'

const LoginFirstButton = props => {
  // dispatch is included with redux
  const { loggedIn, dispatch, ...buttonProps } = props
  return (
    <Popup trigger={<LinkButton {...buttonProps} />}
      header='Login First!'
      position='bottom center'
      disabled={loggedIn}
    />
  )
}

const mapStateToProps = ({ user }) => (
  {
    loggedIn: user.loggedIn,
  }
)

export default connect(mapStateToProps)(LoginFirstButton)
