import { React, useState } from 'react';
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

function IntegerField(props) {
  const classes = useStyles();
  const [state, setState] = useState({'error': false})

  function validateInput(value) {
    if (!value || isNaN(value)) {
      return false
    } 
    if (value < (props.min || 1)) {
      return false
    }
    return true
  }

  function handleChange(event) {
    props.onChange(event)
    const error = !validateInput(event.target.value)
    if (props.onError) {
      props.onError(event.target.name, error)
    }
    setState({'error': error})
  }

  return (
    <TextField
      className={classes.textField}
      name={props.name}
      error={state.error}
      value={props.value}
      label={props.label}
      variant={props.variant || "outlined"}
      onChange={handleChange}/>);

}

export default function InputGroup(props) {
  const groups = ['PETTO', 'SCHIENA', 'GAMBE', 'BRACCIA', 'SPALLE']
  const classes = useStyles();

  return (
    <Grid className={classes.grid} alignItems="center" container spacing={1}>

      <Grid item xs={12} md={1}>
        <Typography
          component="h1" 
          variant="body1">
          {props.label}:
        </Typography>
      </Grid>

      <Grid item xs={12} md={2}>
        <IntegerField
          onError={props.onError}
          name={props.name + '_rest_min'}
          value={props.value[props.name + '_rest_min']} label="Min Recupero"
          onChange={props.onChange}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <IntegerField
          onError={props.onError}
          name={props.name + '_rest_max'} 
          value={props.value[props.name + '_rest_max']} label="Max Recupero"
          onChange={props.onChange}/>
      </Grid>

      <Grid item xs={12} md={2}>
        <IntegerField
          onError={props.onError}
          name={props.name + '_rotations'} 
          value={props.value[props.name + '_rotations']} label="Rotazioni"
          onChange={props.onChange}/>
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
          labelPlacement="end"
          label={<Typography variant="body1">Dopo Rest Day</Typography>}/>
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

export { InputGroup, IntegerField }
