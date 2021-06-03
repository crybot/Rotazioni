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
            <Typography
              component="h1" style={{marginLeft:"65%"}}
              variant="overline" align="left">
              {props.label}:
            </Typography>
          </Grid>

          <Grid item xs>
            <TextField
              size="small"
              name={props.name + '_rest_min'}
              value={props.value[props.name + '_rest_min']} label="Min
              Recupero" variant="outlined" onChange={props.onChange}/>
          </Grid>

          <Grid item xs>
            <TextField
              size="small"
              name={props.name + '_rest_max'} 
              value={props.value[props.name + '_rest_max']} label="Max
              Recupero" variant="outlined" onChange={props.onChange}/>
          </Grid>

          <Grid item xs>
            <TextField
              size="small"
              name={props.name + '_rotations'} 
              value={props.value[props.name + '_rotations']} label="Rotazioni"
              variant="outlined" onChange={props.onChange}/>
          </Grid>

        </Grid>
      </form>
    </div>
  );
}

export default InputGroup;
