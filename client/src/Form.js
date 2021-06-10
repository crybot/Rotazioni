import React from 'react';
import { useState, useRef } from 'react';
import { Collapse, Typography, Backdrop, CircularProgress, Button } from '@material-ui/core';
import { Icon, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { InputGroup, IntegerField } from './InputGroup'
import Alert from '@material-ui/lab/Alert';
import SplitTable from './SplitTable'
import ChoiceDialog from './ChoiceDialog'

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

// TODO: export
function mapGroupInv(group) {
  return {
    'petto': 'chest',
    'schiena': 'back',
    'gambe': 'legs',
    'braccia': 'arms',
    'spalle': 'delts'
  }[group.toLowerCase()]
}

// TODO: global config files
// const groups = ['chest', 'back', 'legs', 'arms', 'delts']
const groups = ['petto', 'schiena', 'gambe', 'braccia', 'spalle']

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
  const [openDialog, setOpenDialog] = useState(false)
  const [infeasible, setInfeasible] = useState(false)
  const [choices, setChoices] = useState([])
  const rest = useRef([])
  const selectedRow = useRef(null)

  function rotations(group, split) {
    if (!split) {
      return 0
    }

    var n = 0
    for (var day of split) {
      if (day) {
        n = day.includes(group) ? n + 1 : n
      }
    }
    return n
  }


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
    // TODO: handle infeasible problem by triggering an alert
    if (!isInputValid()) {
      return
    }

    var form_data = new FormData();
    for ( var key in state ) {
      form_data.append(key, state[key]);
    }
    form_data.append('rest', JSON.stringify(rest.current))
    form_data.append('choices', JSON.stringify(choices.map(e => Array.from(e))))

    var requestOptions = {
      method: 'POST',
      body: form_data,
      redirect: 'follow'
    };

    setLoading(true)

    const api_url = process.env.REACT_APP_FLASK_IP ? process.env.REACT_APP_FLASK_IP : 'http://localhost:5000/solve'
    fetch(api_url, requestOptions)
      .then(response => response.json())
      .then(json => {
        if(!json.split) {
          setInfeasible(true)
          return setSplit(recomputeSplit(choices))
        }
        setInfeasible(false)
        return setSplit(json.split)
      })
      .then(_ => setLoading(false))
      .catch(error => console.log('error', error));
  }

  const handleRowClick = (row, marked) => {
    // TODO: assert days > 0 
    setOpenDialog(true)
    selectedRow.current = row
  }

  function recomputeSplit(choices) {
    let newSplit = Array(state.days).fill().map(() => [])
    for (const day in choices) {
      newSplit[day] = Array.from(choices[day])
    }
    return newSplit
  }

  const handleCloseDialog = (value) => {
    // TODO: assert days > 0 
    setOpenDialog(false)

    let row = selectedRow.current - 1
    let newChoices = choices
    selectedRow.current = null

    if (!value) {
      return
    }

    if (!newChoices[row]) {
      newChoices[row] = new Set()
    }

    if (value === 'rest') {
      rest.current[row] = true
      newChoices[row] = new Set()
      setChoices(newChoices)
      setSplit(recomputeSplit(newChoices))
      return
    }

    if (value === 'clear') {
      rest.current[row] = false
      newChoices[row] = new Set()
      setChoices(newChoices)
      setSplit(recomputeSplit(newChoices))
      return
    }

    let newValue = mapGroupInv(value).toUpperCase()

    if (rotations(newValue, newChoices.map( e => Array.from(e) )) < 3) {
      rest.current[row] = false
      newChoices[row].add(newValue)
      setSplit(recomputeSplit(newChoices))
      setChoices(newChoices)
    }

  }


  return (
    <div>
      <Collapse in={infeasible}>
        <Alert
          id="menu"
          severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setInfeasible(false)
              }}>
              <Icon>
                close
              </Icon>
            </IconButton>
          }>
          <Typography variant="body1">
              I vincoli imposti non consentono di generare una split
          </Typography>
        </Alert>
      </Collapse>
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
      <ChoiceDialog items={groups.concat(['rest'])} onClose={handleCloseDialog} open={openDialog}>
      </ChoiceDialog>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="secondary"/>
      </Backdrop>

      <SplitTable selectedRow={selectedRow.current} rest={rest.current} handleClick={handleRowClick} days={state.days} split={split}/>

    </div>
  );
}

export default Form
