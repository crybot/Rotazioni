import { Typography, Tooltip } from '@material-ui/core';

export default function InputTooltip({children, ...props}) {
  const title = (<Typography variant="body2"> {props.title} </Typography>);

  return (
    <Tooltip
      {...props}
      enterDelay={props.enterDelay || 400}
      enterNextDelay={props.enterNextDelay || 400}
      title={(props.title && title) || ""}
      arrow>
      {children}
    </Tooltip>
  )

}
