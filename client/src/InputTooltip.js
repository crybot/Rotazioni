import { Typography, Tooltip } from '@material-ui/core';

export default function InputTooltip(props) {
  const title = (<Typography variant="body2"> {props.title} </Typography>);

  return (
    <Tooltip
      enterDelay={400}
      enterNextDelay={400}
      title={(props.title && title) || ""}
      arrow>
      {props.children}
    </Tooltip>
  )

}
