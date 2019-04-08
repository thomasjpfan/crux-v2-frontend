import React from 'react'
import { Modal, Menu, Input, Button, Form, Message } from 'semantic-ui-react'
import Cookies from 'js-cookie'


const LoginModal = () => {
  return <Modal trigger={<Menu.Item>Login</Menu.Item>} size='tiny'>
    <Modal.Header>Login To Crux</Modal.Header>
    <Modal.Content>
      <Button type='Login' content="Login with Figshare" fluid primary></Button>
    </Modal.Content>
  </Modal>
}
export default LoginModal;
