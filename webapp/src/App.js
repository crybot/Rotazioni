import './App.css';
import InputGroup from './InputGroup'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import {Typography, TextField, Checkbox} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function App() {
  const classes = useStyles();
  const numbers = [...Array(14).keys()]
  const rows = numbers.map((n) => 
    <tr> 
      <td align="left"> {n+1} </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
  );
  return (
    <div className="App">
      <header className="App-header">
        <h2 className="App-title1"> GENERATORE DI SPLIT </h2>
        <h1 className="App-title2"> ROTAZIONI </h1>
      </header>
      <body>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField label="Giorni Microciclo" />
          <TextField label="Giorni di Riposo" />
          <TextField label="Max Workout Consecutivi" />
          <TextField label="Max Riposo Consecutivi" />
        </form>
        <InputGroup name="PETTO"/>
        <InputGroup name="SCHIENA"/>
        <InputGroup name="GAMBE"/>
        <InputGroup name="BRACCIA"/>
        <InputGroup name="SPALLE"/>
        <table align="center">
          <tr> 
            <th> GIORNO </th>
            <th> ROTAZIONE I </th>
            <th> ROTAZIONE II </th>
            <th> ROTAZIONE III </th>
            <th> RICHIAMO </th>
          </tr>
          {rows}
        </table>
      </body>
    </div>
  );
}

export default App;
