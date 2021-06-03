import React from 'react';
import { useState } from 'react';
import InputGroup from './InputGroup'
import { Typography, TextField} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '15ch',
    },
  },
}));

const defaultState = {
  days: 14,
  rest_days: 5,
  max_consecutive_work: 3,
  max_consecutive_rest: 2,

  chest_rest_min: 3,
  chest_rest_max: 10,
  chest_rotations: 3,
  back_rest_min: 3,
  back_rest_max: 10,
  back_rotations: 3,
  legs_rest_min: 4,
  legs_rest_max: 10,
  legs_rotations: 2,
  arms_rest_min: 3,
  arms_rest_max: 10,
  arms_rotations: 3,
  delts_rest_min: 3,
  delts_rest_max: 10,
  delts_rotations: 3
}

function Form(props) {
  const classes = useStyles();
  const [state, setState] = useState(defaultState)

  const handleChange = (event) => {
    setState({
      // Computed property names
      // keys of the objects are computed dynamically
      ...state,
      [event.target.name] : event.target.value
    })
  }

  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField name="days" value={state.days} label="Giorni Microciclo"
          onChange={handleChange}/>
        <TextField name="rest_days" value={state.rest_days} label="Giorni di Riposo"
          onChange={handleChange}/>
        <TextField name="max_consecutive_work" value={state.max_consecutive_work} label="Max
          Workout Consecutivi" onChange={handleChange}/>
        <TextField name="max_consecutive_rest" value={state.max_consecutive_rest} label="Max
          Riposo Consecutivi" onChange={handleChange}/>
      </form>
      <InputGroup name="chest" value={state} label="PETTO" onChange={handleChange}/>
      <InputGroup name="back" value={state} label="SCHIENA" onChange={handleChange}/>
      <InputGroup name="legs" value={state} label="GAMBE" onChange={handleChange}/>
      <InputGroup name="arms" value={state} label="BRACCIA" onChange={handleChange}/>
      <InputGroup name="delts" value={state} label="SPALLE" onChange={handleChange}/>
    </div>
  );
}

export default Form
