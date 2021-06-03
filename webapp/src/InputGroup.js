import React from 'react';
import {TextField} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
      width: '25ch',
    },
  }
}));

function InputGroup(props) {
  const classes = useStyles();
  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off">
        {/* <label>{props.name}:</label> */}
        <TextField label="Min Recupero" variant="outlined"/>
        <TextField label="Max Recupero" variant="outlined"/>
        <TextField label="Rotazioni" variant="outlined"/>
      </form>
    </div>
  );
}

export default InputGroup;
