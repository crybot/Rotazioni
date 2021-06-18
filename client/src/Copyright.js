import { Typography, Link } from '@material-ui/core';

export default function Copyright() {
  return (
    <Typography style={{marginTop: '30vh'}} variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/crybot">
        Marco Pampaloni
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
