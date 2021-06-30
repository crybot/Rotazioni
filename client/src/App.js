import './App.css';
import { IconButton, Icon, Grid, CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { usePersistedState } from './persistence'
import Form from './Form'
import Copyright from './Copyright'

var defaultTheme = {
  typography: {
    fontFamily: [
      'Oswald',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#067BC2',
    },
    secondary: {
      main: '#c01f25', // shade of dark red
    },
    tertiary: {
      main: '#48AD72',
      dark: '#30734C',
    },
    highlight: {
      main: '#E98A15',
      dark: '#E08515',
    }
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


function App() {
  const [darkMode, setDarkMode] = usePersistedState('darkMode', false)

  defaultTheme.palette.type = darkMode ? 'dark' : 'light'
  const theme = createMuiTheme(defaultTheme);
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

    button: {
      color: '#565656',
    }
  });
  const classes = useStyles();


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <div className="App">
          <header className="App-header">
            <Grid container spacing={0}>
              <Grid item xs={1} align="left">
                <IconButton className={classes.button} onClick={() => setDarkMode(!darkMode)}>
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
