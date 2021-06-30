import React from 'react';
import { useState, useRef } from 'react';
import { usePersistedState } from './persistence'
import { Collapse, Typography, Backdrop, CircularProgress, Button } from '@material-ui/core';
import { FormControlLabel, Checkbox, Icon, IconButton } from '@material-ui/core';
import InputGroup, { IntegerField } from './InputGroup'
import Alert from '@material-ui/lab/Alert';
import SplitTable from './SplitTable'
import ChoiceDialog from './ChoiceDialog'
import InputTooltip from './InputTooltip'
import ReactToPrint from 'react-to-print';
import { globalStyles } from './theme'
import { mapGroupInv } from './groups'
import './extensions'


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
  const preference = {};
  for (const other of groups.map(mapGroupInv)) {
    if (other === group) continue
    const name = group + '_preference_' + other 
    if (defaultPreferences[group].includes(other)) {
      preference[name] = true
    }
    else {
      preference[name] = false
    }
  }
  return preference
}

const defaultState = {
  days: 14,
  rest_days: 5,
  max_consecutive_work: 3,
  max_consecutive_rest: 2,
  cyclic_split: true,

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
  return Object.fromEntries(
    Object.entries(state).filter(
      ([key, val]) => keys.includes(key)
    )
  )
}


function Form(props) {
  const classes = globalStyles();
  const [state, setState] = usePersistedState('state', defaultState)
  const [errors, setErrors] = useState({})
  const [split, setSplit] = usePersistedState('split', null)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [infeasible, setInfeasible] = useState(false)
  const [choices, setChoices] = usePersistedState('choices', [])
  const [richiami, setRichiami] = usePersistedState('richiami', [])
  const [rest, setRest] = usePersistedState('rest', [])
  const selectedRow = useRef(null)

  function rotations(group, split) {
    if (!split) {
      return 0
    }

    let n = 0;
    for (const day of split) {
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
    var refName = event.target.value
    var refValue = event.target.name
    if (event.target.type === 'checkbox'
      && event.target.name.includes('preference')) {
      refName = event.target.name.split('_').reverse().join('_')
      refValue = event.target.checked
    }

    setState({
      // Computed property names
      // keys of the objects are computed dynamically
      ...state,
      [event.target.name] : (event.target.type === 'checkbox'
        ? event.target.checked // `value` is not defined for Checkbox
        : event.target.value),
      [refName] : refValue
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

    const form_data = new FormData();
    for (const key in state ) {
      form_data.append(key, state[key]);
    }
    form_data.append('rest', JSON.stringify(rest))
    form_data.append('choices', JSON.stringify(choices))
    form_data.append('richiami', JSON.stringify(richiami))

    const requestOptions = {
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
    selectedRow.current = row
    setOpenDialog(true)
  }

  function recomputeSplit(choices) {
    let newSplit = Array(state.days).fill([]);
    for (const day in choices) {
      newSplit[day] = choices[day]
    }
    return newSplit
  }

  const handleCloseDialog = (values) => {
    // TODO: assert days > 0 
    setOpenDialog(false)

    let row = selectedRow.current - 1
    // Need to copy arrays to trigger component re-render
    let newChoices = [...choices]
    let newRichiami = [...richiami]
    let newRest = [...rest]
    selectedRow.current = null

    if (!values) {
      return
    }

    if (!newChoices[row]) {
      newChoices[row] = []
    }

    if (!newRichiami[row]) {
      newRichiami[row] = []
    }


    /*
    if (values === 'clear') {
      newRest[row] = false
      setRest(newRest)
      newChoices[row] = []
      setChoices(newChoices)
      newRichiami[row] = []
      setRichiami(newRichiami)
      setSplit(recomputeSplit(newChoices))
      return
    }
    */

    if (typeof values === 'object') {
      if (values.rest) {
        newRest[row] = true
        setRest(newRest)
        newChoices[row] = []
        setChoices(newChoices)
        newRichiami[row] = []
        setRichiami(newRichiami)
        setSplit(recomputeSplit(newChoices))
        return
      }

      let items = Object.keys(values.rotations).filter((k) => values.rotations[k])
      newChoices[row] = []
      for (const item of items) {
        let newValue = mapGroupInv(item).toUpperCase()
        if (rotations(newValue, newChoices) < 3) {
          newRest[row] = false
          newChoices[row].pushIfNotPresent(newValue)
        }
      }
      let richiami = Object.keys(values.richiami).filter((k) => values.richiami[k])
      newRichiami[row] = []
      for (const item of richiami) {
        let newValue = mapGroupInv(item).toUpperCase()
        newRest[row] = false
        newRichiami[row].pushIfNotPresent(newValue)
        setRichiami(newRichiami)
      }
      setRest(newRest)
      setChoices(newChoices)
      setSplit(recomputeSplit(newChoices))

    }

  }

  const handleReset = () => {
    setChoices([])
    setRichiami([])
    setRest([])
    setSplit(recomputeSplit([]))
  }

  const componentRef = useRef();

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
          tooltip="Numero di giorni componenti il microciclo"
          value={state.days}
          label="Giorni Microciclo"
          variant="standard"
          onError={handleError}
          onChange={handleChange}/>
        <IntegerField 
          name="rest_days"
          tooltip="Numero di giorni di recupero da effettuare all'interno del microciclo"
          value={state.rest_days}
          label="Giorni di Riposo"
          variant="standard"
          onError={handleError}
          onChange={handleChange}/>
        <IntegerField
          name="max_consecutive_work"
          tooltip="Massimo numero di allenamenti consecutivi effettuabili all'interno del microciclo"
          value={state.max_consecutive_work}
          label="Max Workout Consecutivi" 
          variant="standard"
          onError={handleError}
          onChange={handleChange}/>
        <IntegerField
          name="max_consecutive_rest"
          tooltip="Massimo numero di giorni di riposo effettuabili all'interno del microciclo"
          value={state.max_consecutive_rest}
          label="Max Riposo Consecutivi"
          variant="standard"
          onError={handleError}
          onChange={handleChange}/>
        <InputTooltip
          title={
            "Specifica se la split deve essere ripetuta più volte: " +
              "se la casella viene spuntata, l'ultimo " +
              "giorno del microciclo sarà considerato precedente al primo."
          }>
          <FormControlLabel 
            control={
              <Checkbox 
                name='cyclic_split'
                checked={state.cyclic_split}
                onChange={handleChange}
              />
            }
            // disabled={state.days % 7 !== 0}
            labelPlacement="end"
            label={<Typography variant="body1">Split Ciclica</Typography>}/>
        </InputTooltip>
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

      <div ref={componentRef}>
        <SplitTable
          selectedRow={selectedRow.current}
          rest={rest}
          handleClick={handleRowClick}
          days={state.days}
          split={split}
          choices={choices}
          richiami={richiami}
        />
      </div>

      <Button
        onClick={handleReset} variant="outlined" className={classes.button}>
        <Typography>
          <strong>RIPRISTINA</strong>
        </Typography>
      </Button>

      <ReactToPrint
        trigger={() => 
          <Button
            align="left" variant="outlined" className={classes.button}>
            <Typography>
              <strong>Salva PDF</strong>
            </Typography>
          </Button>
        }
        content={() => componentRef.current}
      />

      <ChoiceDialog
        rest={rest[selectedRow.current-1]}
        selected={choices[selectedRow.current-1]}
        richiami={richiami[selectedRow.current-1]}
        items={groups}
        onClose={handleCloseDialog}
        open={openDialog}>
      </ChoiceDialog>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="secondary"/>
      </Backdrop>

    </div>
  );
}

export default Form
