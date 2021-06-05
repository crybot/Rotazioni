import './App.css';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Form from './Form'
import Copyright from './Copyright'

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Oswald',
    ].join(','),
  },
  palette: {
    secondary: {
      main: '#c01f25', // shade of dark red
    }
  },
  overrides: {
    MuiCheckbox: {
      root: {
        transform: 'scale(0.8)',
      }
    }
  },
  props: {
    MuiCheckbox: {
      size: "small",
    },
    MuiTextField: {
      inputProps: {style: {fontSize: 15}}, // font size of input text
      InputLabelProps: {style: {fontSize: 15}}, // font size of input label
    },
  },

});

const useStyles = makeStyles({
  title1: {
    color: theme.palette.secondary.main,
    fontSize: '30px',
    marginTop: '0',
    textAlign: 'right',
    paddingRight: '3vw',
  },

  title2: {
    color: theme.palette.secondary.main,
    fontSize: '60px',
  },
});

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <Typography>
            <h2 className={classes.title1}> GENERATORE DI SPLIT </h2>
            <h1 className={classes.title2}> ROTAZIONI </h1>
          </Typography>
        </header>
        <body>
          <center>
            <Form/>
          </center>
        </body>
        <footer>
          <Copyright/>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
