import React from 'react';
import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import '@fontsource/roboto';

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
        <Grid alignItems="center" style={{width: "80%"}} container spacing={3}>
          <Grid item xs>
            <Typography component="h1" style={{marginLeft:"65%"}}
              variant="overline" align="left"> {props.name}:</Typography>
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
