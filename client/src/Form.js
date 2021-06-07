import React from 'react';
import { useState, useRef } from 'react';
import { Typography, Backdrop, CircularProgress, Button, TextField} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { InputGroup, IntegerField } from './InputGroup'
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
    width: "12%",
    height: "8ch"
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

function getGroupKeys(state, group) {
  return Object.keys(state).filter((k) => k.startsWith(`${group}_`))
}

const stateGroupKeys = {
  'chest': getGroupKeys(defaultState, 'chest'),
  'back': getGroupKeys(defaultState, 'back'),
  'legs': getGroupKeys(defaultState, 'legs'),
  'arms': getGroupKeys(defaultState, 'arms'),
  'delts': getGroupKeys(defaultState, 'delts'),
}

function getGroup(state, group) {
  const keys = stateGroupKeys[group]
  const filtered = Object.fromEntries(
    Object.entries(state).filter(
      ([key, val]) => keys.includes(key)
    )
  );
  return filtered
}



function Form(props) {
  const classes = useStyles();
  const [state, setState] = useState(defaultState)
  const [errors, setErrors] = useState({})
  const [split, setSplit] = useState(null)
  const [loading, setLoading] = useState(false)
  const rest = useRef([])

  // Return true if any input component of the Form contains errors
  const isInputValid = () => {
    return !(Object.values(errors).indexOf(true) > -1)
  }

  const handleChange = (event) => {
    console.log(event.target)
    setState({
      // Computed property names
      // keys of the objects are computed dynamically
      ...state,
      [event.target.name] : (event.target.type === 'checkbox'
        ? event.target.checked // `value` is not defined for Checkbox
        : event.target.value),
    })
  }

  // TODO: compare performance vs object destructuring (c.f. handleChange)
  const handleError = (name, error) => {
    let newErrors = errors
    newErrors[name] = error
    setErrors(newErrors)
  }


  const handleSubmit = async (event) => {
    if (!isInputValid()) {
      return
    }

    var form_data = new FormData();
    for ( var key in state ) {
      form_data.append(key, state[key]);
    }
    form_data.append('rest', JSON.stringify(rest.current))

    var requestOptions = {
      method: 'POST',
      body: form_data,
      redirect: 'follow'
    };

    setLoading(true)

    const api_url = process.env.REACT_APP_FLASK_IP ? process.env.REACT_APP_FLASK_IP : 'http://localhost:5000'
    fetch(api_url + '/solve', requestOptions)
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
        <IntegerField
          name="days" 
          value={state.days}
          label="Giorni Microciclo"
          variant="standard"
          onError={handleError}
          onChange={handleChange}/>
        <IntegerField 
          name="rest_days"
          value={state.rest_days}
          label="Giorni di Riposo"
          variant="standard"
          onError={handleError}
          onChange={handleChange}/>
        <IntegerField
          name="max_consecutive_work"
          value={state.max_consecutive_work}
          label="Max Workout Consecutivi" 
          variant="standard"
          onError={handleError}
          onChange={handleChange}/>
        <IntegerField
          name="max_consecutive_rest"
          value={state.max_consecutive_rest}
          label="Max Riposo Consecutivi"
          variant="standard"
          onError={handleError}
          onChange={handleChange}/>
      </form>
      <InputGroup 
        name="chest"
        value={getGroup(state, 'chest')}
        label="PETTO" 
        onError={handleError}
        onChange={handleChange}/>
      <InputGroup
        name="back"
        value={getGroup(state, 'back')}
        label="SCHIENA"
        onError={handleError}
        onChange={handleChange}/>
      <InputGroup
        name="legs"
        value={getGroup(state, 'legs')}
        label="GAMBE"
        onError={handleError}
        onChange={handleChange}/>
      <InputGroup
        name="arms"
        value={getGroup(state, 'arms')}
        label="BRACCIA"
        onError={handleError}
        onChange={handleChange}/>
      <InputGroup
        name="delts"
        value={getGroup(state, 'delts')}
        label="SPALLE"
        onError={handleError}
        onChange={handleChange}/>
      <Button
        disabled={!isInputValid()}
        onClick={handleSubmit} align="left" variant="outlined" className={classes.button}>
        <Typography>
          <strong>GENERA</strong>
        </Typography>
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
