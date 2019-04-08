import React from 'react'
import { Menu, Container } from 'semantic-ui-react'
import logo from '../logo.png'
import {
  Link,
} from 'react-router-dom'
import LoginModal from './Login'

const NavBar = () => (
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
          Dashboard
          </Menu.Item>
      </Link>
      <Link to='/datasets'>
        <Menu.Item>
          Datasets
          </Menu.Item>
      </Link>
      <Link to='/Analyses'>
        <Menu.Item>
          Analyses
          </Menu.Item>
      </Link>
      <LoginModal></LoginModal>
    </Container>
  </Menu >
)

export default NavBar;
