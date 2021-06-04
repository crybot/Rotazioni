import React from 'react';
import { Checkbox, Typography, Grid, TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import '@fontsource/roboto';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '80%',
    margin: '0px',
  },
}));

function InputGroup(props) {
  const classes = useStyles();
  return (
    <Grid className={classes.grid} alignItems="center" container spacing={3}>

      <Grid item xs={12} md={1}>
        <Typography
          component="h1" 
          variant="overline">
          {props.label}:
        </Typography>
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          size="small"
          name={props.name + '_rest_min'}
          value={props.value[props.name + '_rest_min']} label="Min
          Recupero" variant="outlined" onChange={props.onChange}/>
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          size="small"
          name={props.name + '_rest_max'} 
          value={props.value[props.name + '_rest_max']} label="Max
          Recupero" variant="outlined" onChange={props.onChange}/>
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          size="small"
          name={props.name + '_rotations'} 
          value={props.value[props.name + '_rotations']} label="Rotazioni"
          variant="outlined" onChange={props.onChange}/>
      </Grid>
      <Grid item xs={12} md={2}>
        <FormControlLabel 
          control={
            <Checkbox 
              name={props.name + '_after_rest'}
              checked={props.value[props.name + '_after_rest']}
              onChange={props.onChange}
            />
          }
          label="Dopo Rest Day" />
      </Grid>

    </Grid>
  );
}

export default InputGroup;
