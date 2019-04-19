import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const LinkButton = (props) => {
  const {
    history,
    location,
    match,
    staticContext,
    to,
    onClick,
    ...rest
  } = props
  return (
    <Button
      {...rest}
      onClick={(event) => {
        onClick && onClick(event)
        history.push(to)
      }}
    />
  )
}

export default withRouter(LinkButton)
