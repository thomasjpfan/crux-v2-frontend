import React from 'react'
import { Menu, Container } from 'semantic-ui-react'
import logo from '../../logo.png'
import {
  Link,
} from 'react-router-dom'
import UserItem from './UserItem'
import { connect } from 'react-redux'

const NavBar = props => (
  <Menu stackable size='large' className="nav-bar">
    <Container>
      <Link to='/'>
        <Menu.Item header>
          <img src={logo} style={{ width: '4.5em' }}
            alt='logo' className="logo" />
          CRUX
          </Menu.Item>
      </Link>
      <Link to='/dashboard'>
        <Menu.Item>
          {props.loggedIn ? `${props.username}'s Dashboard` : 'Dashboard'}
        </Menu.Item>
      </Link>
      <Link to='/datasets'>
        <Menu.Item>
          Datasets
          </Menu.Item>
      </Link>
      <Link to='/analyses'>
        <Menu.Item>
          Analyses
          </Menu.Item>
      </Link>
      <UserItem />
    </Container>
  </Menu >
)

const mapStateToProps = ({ user }) => (
  {
    username: user.username,
    loggedIn: user.loggedIn
  }
)

export default connect(mapStateToProps)(NavBar);
