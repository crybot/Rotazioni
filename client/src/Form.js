import React from 'react';
import { useState } from 'react';
import InputGroup from './InputGroup'
import { Button, Typography, TextField} from '@material-ui/core';
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
}

function SplitTable(props) {

  function weekday(n) {
    return {0: 'LUNEDÌ', 1: 'MARTEDÌ', 2: 'MERCOLEDÌ',                          
      3: 'GIOVEDÌ', 4: 'VENERDÌ', 5: 'SABATO',                          
      6: 'DOMENICA'}[(n-1) % 7]    
  }

  const numbers = Array.from({length:props.days},(v,k)=>k+1)
  const split = props.split
  const rows = numbers.map((n) => 
    <tr key={n.toString()}> 
      <td align="left"> 
        <Typography>
          {weekday(n)}
        </Typography>
      </td>
      <td>
        <Typography>
          {split && n <= split.length ? split[n-1].join(' & ') : ''}
        </Typography>
      </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
  );

  return (
    <table align="center">
      <tr> 
        <th> </th>
        <th>
          <Typography>
            ROTAZIONE I 
          </Typography>
        </th>
        <th>
          <Typography>
            ROTAZIONE II
          </Typography>
        </th>
        <th>
          <Typography>
            ROTAZIONE III
          </Typography>
        </th>
        <th>
          <Typography>
            RICHIAMO
          </Typography>
        </th>
      </tr>
      {rows}
    </table>
  );

}

function Form(props) {
  const classes = useStyles();
  const [state, setState] = useState(defaultState)
  const [split, setSplit] = useState(null)

  const handleChange = (event) => {
    setState({
      // Computed property names
      // keys of the objects are computed dynamically
      ...state,
      [event.target.name] : (event.target.value != null
        ? event.target.value // `value` is not defined for Checkbox
        : event.target.checked)
    })
  }

  const handleSubmit = async (event) => {
    var form_data = new FormData();

    for ( var key in state ) {
      form_data.append(key, state[key]);
    }

    var requestOptions = {
      method: 'POST',
      body: form_data,
      redirect: 'follow'
    };

    fetch("http://127.0.0.1:5000/solve", requestOptions)
      .then(response => response.json())
      .then(json => setSplit(json.split))
      .catch(error => console.log('error', error));
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
        onClick={handleSubmit} align="left" variant="outlined"
        style={{color: "#c01f25", width: "10%", height: "6ch"}}>
        <strong>GENERA</strong> </Button>
      <SplitTable days={state.days} split={split}/>

    </div>
  );
}

export default Form
