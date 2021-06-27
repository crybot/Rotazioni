import { makeStyles } from '@material-ui/core/styles';

export const globalStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '18ch',
    },
  },
  button: {
    color: theme.palette.secondary.main,
    marginRight: "20px",
    marginLeft: "20px",
    width: "12%",
    height: "8ch"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

