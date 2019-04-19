import React, { Component } from 'react'
import { Modal, Menu, Button, Icon } from 'semantic-ui-react'
import { FIGSHARE_AUTH_STATE_STORAGE_KEY, FIGSHARE_AUTH_URL } from '../../Config'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logoutAction } from '../../redux/user'


class UserItem extends Component {

  state = {
    modalOpen: false
  }

  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })

  handleLogout = () => {
    this.props.logout()
    this.setState({ modalOpen: false })
    this.props.history.push("/")
  }

  render() {
    if (this.props.loggedIn) {
      return (<Modal
        trigger={<Menu.Item onClick={this.handleOpen}>Logout</Menu.Item>}
        size='tiny'
        open={this.state.modalOpen}
        onClose={this.handleClose}>
        <Modal.Header>Are you sure you want to logout?</Modal.Header>
        <Modal.Actions>
          <Button color='red' onClick={this.handleClose}>
            <Icon name='checkmark' />No
          </Button>
          <Button color='green' onClick={this.handleLogout}>
            <Icon name='checkmark' />Yes
          </Button>
        </Modal.Actions>
      </Modal>)
    }
    return (<Modal
      trigger={<Menu.Item onClick={this.handleOpen}>Login</Menu.Item>}
      size='tiny'
      open={this.state.modalOpen}
      onClose={this.handleClose}>
      <Modal.Header>Login To Crux</Modal.Header>
      <Modal.Content>
        <a href={FIGSHARE_AUTH_URL}
          onClick={(e) => {
            e.preventDefault()
            let stateString = Math.random().toString(36).substring(7)
            localStorage.setItem(FIGSHARE_AUTH_STATE_STORAGE_KEY, stateString)
            let figshareCallback = `${FIGSHARE_AUTH_URL}&state=${stateString}`
            window.open(figshareCallback, "_self")
          }}><Button type='Login' content="Login With Figshare" fluid primary></Button></a>
      </Modal.Content>
    </Modal>)
  }
}

const mapStateToProps = ({ user }) => (
  {
    loggedIn: user.loggedIn,
  }
)

const mapDispatchToProps = (dispatch) => (
  {
    logout: () => (
      dispatch(logoutAction())
    )
  }
)

const UserItemDisplay = connect(mapStateToProps, mapDispatchToProps)(UserItem)

export default withRouter(UserItemDisplay);
