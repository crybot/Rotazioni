import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '30ch',
    },
  }
}));

function InputGroup(props) {
  const classes = useStyles();
  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid style={{width: "80%"}} container spacing={3}>
          <Grid item xs>
            <label>{props.name}:</label>
          </Grid>
          <Grid item xs>
            <TextField defaultValue="3" label="Min Recupero" variant="outlined"/>
          </Grid>
          <Grid item xs>
            <TextField defaultValue="6" label="Max Recupero" variant="outlined"/>
          </Grid>
          <Grid item xs>
            <TextField defaultValue="3" label="Rotazioni" variant="outlined"/>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default InputGroup;
