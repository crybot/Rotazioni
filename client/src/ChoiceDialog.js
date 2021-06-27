import { Dialog, DialogTitle, List, ListItem} from '@material-ui/core';
import { Button, ListItemText, Typography } from '@material-ui/core';
import { Chip, Divider, Box, Grid, Icon, IconButton } from '@material-ui/core';
import { Paper, FormControlLabel, Checkbox} from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { globalStyles } from './theme'
import { mapGroup } from './groups'
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';

function GroupList(props) {
  return (
    <List>
      {
        props.items.map((item) =>
          <ListItem onClick={() => props.onItemClick(item)} button key={item}>
            <ListItemText primary={
              <Typography align="center" variant="body1">
                {item.toUpperCase()}
              </Typography>
              }/>
          </ListItem>
        )
      }
    </List>
  )
}

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

  return (
    <Dialog onClose={handleClose} open={props.open}>
      <Paper style={{backgroundColor: theme.palette.background.default}}>
        <Grid container justify="center" className={classes.root}>
          <Grid item xs={12}>
            <DialogTitle align="center">ROTAZIONI</DialogTitle>
          </Grid>
          {
            props.items.map((item) =>
              <Grid item>
                <ClickableChip
                  disabled={rest}
                  onClick={() => handleChipClick(item)}
                  selected={selected[item]}
                  className={classes.chip}
                  label={item.toUpperCase()}
                />
              </Grid>
            )
          }
        </Grid>
        <Box align="center">
          <Divider style={{width: "85%"}}/>
        </Box>
        <Grid container justify="center" className={classes.root}>
          <Grid item xs={12}>
            <DialogTitle align="center">RICHIAMI</DialogTitle>
          </Grid>
          {
            props.items.map((item) =>
              <Grid item>
                <ClickableChip
                  disabled={rest}
                  onClick={() => handleRichiamiClick(item)}
                  selected={richiami[item]}
                  className={classes.chip}
                  label={item.toUpperCase()}
                />
              </Grid>
            )
          }
        </Grid>
        <Box textAlign="center">
          <ClickableChip
            onClick={handleRestClick}
            selected={rest}
            className={classes.chip}
            label={"REST"}
          />
        </Box>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Box textAlign="center">
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

export function SimpleDialog(props) {
  const { onClose, open, items } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleRichiamoClick = (value) => {
    onClose('richiamo_' + value)
  }

  const handleDeleteClick = () => {
    onClose('clear')
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <Grid container justify="center" alignItems="center" style={{width: "100%"}}>

        <Grid item xs={6}>
          <DialogTitle align="center">Aggiungi Rotazione</DialogTitle>
          <Divider disabled={true}/>
          <GroupList onItemClick={handleListItemClick} items={items}/>
        </Grid>

        <Grid item xs={6}>
          <DialogTitle align="center">Aggiungi Richiamo</DialogTitle>
          <Divider/>
          <GroupList onItemClick={handleRichiamoClick} items={items}/>
        </Grid>

        <Grid item xs={12}>
          <Divider/>
          <List>
            <ListItem onClick={() => handleListItemClick('rest')} button key="rest">
              <ListItemText primary={
                <Typography align="center" variant="body1">
                  REST DAY
                </Typography>
                }/>
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12}>
          <Box textAlign="right">
            <IconButton onClick={handleDeleteClick}>
              <Icon>
                delete
              </Icon>
            </IconButton>
          </Box>
        </Grid>

      </Grid>
    </Dialog>
  );
}
