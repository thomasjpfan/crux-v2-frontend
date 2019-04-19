import React from 'react'
import { Message } from 'semantic-ui-react'

const NotLoggedInMessage = () => {
  return (<Message
    warning
    header='You must Login to proceed!'
    content='Click on login at the top of this page'
  />)
}

export default NotLoggedInMessage
