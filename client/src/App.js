import './App.css';
import InputGroup from './InputGroup'
import {Typography, TextField, Checkbox} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Form from './Form'
import Copyright from './Copyright'

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Oswald',
      'regular',
    ].join(','),
  },});

function App() {
  const numbers = [...Array(14).keys()]

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <Typography>
            <h2 className="App-title1"> GENERATORE DI SPLIT </h2>
            <h1 className="App-title2"> ROTAZIONI </h1>
          </Typography>
        </header>
        <body>
          <Form/>
        </body>
        <footer>
          <Copyright/>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
