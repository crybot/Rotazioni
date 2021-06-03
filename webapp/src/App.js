import './App.css';
import InputGroup from './InputGroup'
import {Typography, TextField, Checkbox} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Form from './Form'

function App() {
  const numbers = [...Array(14).keys()]

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="App-title1"> GENERATORE DI SPLIT </h2>
        <h1 className="App-title2"> ROTAZIONI </h1>
      </header>
      <body>
        <Form/>
      </body>
    </div>
  );
}

export default App;
