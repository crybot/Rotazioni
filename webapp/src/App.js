import './App.css';
import InputGroup from './InputGroup'
import {Typography, TextField, Checkbox} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Form from './Form'

function App() {
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
        <Form/>
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
