import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Checkbox, Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PreferenceList from './PreferenceList'

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '90%',
    margin: '0px',
  },
  textField: {
    maxWidth: '150px',
    minWidth: '100px',
  },
}));

// TODO: export
function mapGroup(group) {
  return {
    'chest': 'PETTO',
    'back': 'SCHIENA',
    'legs': 'GAMBE',
    'arms': 'BRACCIA',
    'delts': 'SPALLE'
  }[group.toLowerCase()]
}

export default function InputGroup(props) {
  const groups = ['PETTO', 'SCHIENA', 'GAMBE', 'BRACCIA', 'SPALLE']
  const classes = useStyles();
  return (
    <Grid className={classes.grid} alignItems="center" container spacing={2}>

      <Grid item xs={12} md={1}>
        <Typography
          component="h1" 
          variant="overline">
          {props.label}:
        </Typography>
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          className={classes.textField}
          size="small"
          name={props.name + '_rest_min'}
          value={props.value[props.name + '_rest_min']} label="Min
          Recupero" variant="outlined" onChange={props.onChange}/>
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          className={classes.textField}
          size="small"
          name={props.name + '_rest_max'} 
          value={props.value[props.name + '_rest_max']} label="Max
          Recupero" variant="outlined" onChange={props.onChange}/>
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          className={classes.textField}
          size="small"
          name={props.name + '_rotations'} 
          value={props.value[props.name + '_rotations']} label="Rotazioni"
          variant="outlined" onChange={props.onChange}/>
      </Grid>
      <Grid item xs={12} md={2}>
        <FormControlLabel 
          /* style={{marginBottom: "22px"}} /* hack to make the checkbox centered */
          control={
            <Checkbox 
              name={props.name + '_after_rest'}
              checked={props.value[props.name + '_after_rest']}
              onChange={props.onChange}
            />
          }
          labelPlacement="right"
          label={<Typography variant="body2">Dopo Rest Day</Typography>}/>
      </Grid>
      <Grid item xs={12} md={3}>
        <PreferenceList
          name={props.name + '_preference'}
          value={props.value}
          onChange={props.onChange}
          items={groups.filter((e) => e !== mapGroup(props.name))}>
        </PreferenceList>
      </Grid>

    </Grid>
  );
}
