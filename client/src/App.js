import './App.css';
import { IconButton, Icon, Grid, CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react'
import Form from './Form'
import Copyright from './Copyright'

var defaultTheme = {
  typography: {
    fontFamily: [
      'Oswald',
    ].join(','),
  },
  palette: {
    secondary: {
      main: '#c01f25', // shade of dark red
    },
  },
  overrides: {
    MuiCheckbox: {
      root: {
        // transform: 'scale(0.8)',
      }
    }
  },
  props: {
    MuiCheckbox: {
      size: "medium",
    },
    MuiTextField: {
      size: "medium",
      // inputProps: {style: {fontSize: 15}}, // font size of input text
      // InputLabelProps: {style: {fontSize: 15}}, // font size of input label
    },
  },
}

const useStyles = makeStyles(theme => ({
  title1: {
    color: theme.palette.secondary.dark,
    fontSize: '30px',
    marginTop: '0',
    textAlign: 'right',
    paddingRight: '3vw',
  },

  title2: {
    color: theme.palette.secondary.dark,
    fontSize: '60px',
  },
}));

function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(
    JSON.parse(localStorage.getItem(key)) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}


function App() {
  const classes = useStyles();
  const [darkMode, setDarkMode] = usePersistedState('darkMode', false)

  defaultTheme.palette.type = darkMode ? 'dark' : 'light'
  const darkTheme = createMuiTheme(defaultTheme);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>
        <div className="App">
          <header className="App-header">
            <Grid container alignItems="center">
              <Grid item xs={1} align="left">
                <IconButton color="primary" onClick={() => setDarkMode(!darkMode)}>
                  <Icon>
                    {darkMode ? "nights_stay" : "brightness_4"}
                  </Icon>
                </IconButton>
              </Grid>
              <Grid item xs={11}>
                <Typography component="span">
                  <h1 className={classes.title1}> GENERATORE DI SPLIT </h1>
                </Typography>
              </Grid>
            </Grid>
            <Typography component="span">
              <h1 className={classes.title2}> ROTAZIONI </h1>
            </Typography>
          </header>
          <center>
            <Form/>
          </center>
          <footer>
            <Copyright/>
          </footer>
        </div>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
