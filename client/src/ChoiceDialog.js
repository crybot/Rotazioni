import { Dialog, DialogTitle } from '@material-ui/core';
import { Button, Typography } from '@material-ui/core';
import { Chip, Divider, Box, Grid, Paper } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { globalStyles } from './theme'
import { mapGroup } from './groups'
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';

function ClickableChip(props) {
  const selected = props.selected
  const theme = useTheme()

  return(
    <Chip
      disabled={props.disabled}
      className={props.className}
      variant={selected ? "default" : "outlined"}
      style={{backgroundColor: (selected ? theme.palette.secondary.main : undefined)}}
      onClick={props.onClick}
      label={props.label}
      icon={selected ? <DoneIcon color="secondary"/> : <AddIcon/>}
    />
  );

}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3.0),
    paddingTop: theme.spacing(1.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

export default function ChipDialog(props) {
  const classes = {...globalStyles(), ...useStyles()}
  const [selected, setSelected] = useState({})
  const [rest, setRest] = useState(props.rest || false)
  const [richiami, setRichiami] = useState({})

  useEffect(() => {
    var newSelected = {}
    if (props.selected) {
      for (const item of props.selected) {
        newSelected[mapGroup(item)] = true
      }

    }
    setSelected(newSelected)
  }, [props])

  useEffect(() => {
    var newRichiami = {}
    if (props.richiami) {
      for (const item of props.richiami) {
        newRichiami[mapGroup(item)] = true
      }

    }
    setRichiami(newRichiami)
  }, [props])

  useEffect(() => {
    var newRest = false
    if (props.rest) {
      newRest = props.rest
    }
    setRest(newRest)
  }, [props])

  const handleSave = () => {
    props.onClose({'rotations': selected, 'richiami': richiami, 'rest': rest});
  }

  const handleClose = () => {
    props.onClose(null);
  }

  const handleChipClick = (item) => {
    setSelected({...selected, [item]: !selected[item]})
  }

  const handleRichiamiClick = (item) => {
    setRichiami({...richiami, [item]: !richiami[item]})
  }

  const handleRestClick = () => {
    setRest(!rest)
  }

  const theme = useTheme()

  const makeChipGroup = (onClick, selected) => {
    return props.items.map((item) =>
      <Grid item>
        <ClickableChip
          disabled={rest}
          onClick={() => onClick(item)}
          selected={selected(item)}
          className={classes.chip}
          label={item.toUpperCase()}
        />
      </Grid>
    )
  }

  return (
    <Dialog onClose={handleClose} open={props.open}>
      <Paper style={{backgroundColor: theme.palette.background.default}}>
        <Grid container justify="center" className={classes.root}>
          <Grid item xs={12}>
            <DialogTitle align="center">ROTAZIONI</DialogTitle>
          </Grid>
          {
            makeChipGroup(item => handleChipClick(item), item => selected[item])
          }
        </Grid>
        <Box align="center">
          <Divider variant="middle"/>
        </Box>
        <Grid container justify="center" className={classes.root}>
          <Grid item xs={12}>
            <DialogTitle align="center">RICHIAMI</DialogTitle>
          </Grid>
          {
            makeChipGroup(item => handleRichiamiClick(item), item => richiami[item])
          }
        </Grid>
        <Box align="center">
          <Divider variant="middle"/>
        </Box>
        <Box align="center" marginTop="20px">
          <ClickableChip
            onClick={handleRestClick}
            selected={rest}
            className={classes.chip}
            label={"REST"}
          />
        </Box>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Box align="center">
              <Button
                className={classes.button}
                style={{width: "90%"}}
                variant="outlined"
                onClick={handleSave}
              >
                <Typography>
                  <strong>
                    SALVA
                  </strong>
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Dialog>
  );
}

