import React from 'react';
import { useState, useRef } from 'react';
import { Backdrop, CircularProgress, Button, TextField} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InputGroup from './InputGroup'
import SplitTable from './SplitTable'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '15ch',
    },
  },
  button: {
    color: theme.palette.secondary.main,
    width: "10%",
    height: "6ch"
  },
}));

const defaultPreferences = {
  'chest': ['arms', 'delts'],
  'back': ['arms', 'delts'],
  'legs': [],
  'arms': ['back', 'chest', 'delts'],
  'delts': ['back', 'chest', 'arms']
}

function makeDefaultPreference(group) {
  var preference = {}
  for (var other of defaultPreferences[group]) {
    const name = group + '_preference_' + other 
    preference[name] = true
  }
  return preference
}

const defaultState = {
  days: 14,
  rest_days: 5,
  max_consecutive_work: 3,
  max_consecutive_rest: 2,

  chest_rest_min: 3,
  chest_rest_max: 10,
  chest_rotations: 3,
  chest_after_rest: false,
  back_rest_min: 3,
  back_rest_max: 10,
  back_rotations: 3,
  back_after_rest: false,
  legs_rest_min: 4,
  legs_rest_max: 10,
  legs_after_rest: true,
  legs_rotations: 2,
  arms_rest_min: 3,
  arms_rest_max: 10,
  arms_rotations: 3,
  arms_after_rest: false,
  delts_rest_min: 3,
  delts_rest_max: 10,
  delts_rotations: 3,
  delts_after_rest: false,
  ...makeDefaultPreference('chest'),
  ...makeDefaultPreference('back'),
  ...makeDefaultPreference('legs'),
  ...makeDefaultPreference('arms'),
  ...makeDefaultPreference('delts'),
}


function Form(props) {
  const classes = useStyles();
  const [state, setState] = useState(defaultState)
  const [split, setSplit] = useState(null)
  const [loading, setLoading] = useState(false)
  const rest = useRef([])

  const handleChange = (event) => {
    setState({
      // Computed property names
      // keys of the objects are computed dynamically
      ...state,
      [event.target.name] : (event.target.type === 'checkbox'
        ? event.target.checked // `value` is not defined for Checkbox
        : event.target.value)
    })
  }

  const handleSubmit = async (event) => {
    var form_data = new FormData();

    for ( var key in state ) {
      form_data.append(key, state[key]);
    }
    form_data.append('rest', JSON.stringify(rest.current))
    console.log(rest.current)

    var requestOptions = {
      method: 'POST',
      body: form_data,
      redirect: 'follow'
    };

    setLoading(true)

    fetch("http://127.0.0.1:5000/solve", requestOptions)
      .then(response => response.json())
      .then(json => setSplit(json.split))
      .then(_ => setLoading(false))
      .catch(error => console.log('error', error));
  }

  const handleCellClick = (row, marked) => {
    rest.current[row-1] = marked // (row-1 because in the API days start from 0)
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
      <Button
        onClick={handleSubmit} align="left" variant="outlined" className={classes.button}>
        <strong>GENERA</strong>
      </Button>
      <br/>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="secondary"/>
      </Backdrop>

      <SplitTable handleClick={handleCellClick} days={state.days} split={split}/>

    </div>
  );
}

export default Form
