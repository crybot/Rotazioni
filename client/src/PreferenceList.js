import React from 'react';
import { List, ListItem, ListItemText, 
  ListItemIcon, Checkbox, 
  Typography, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '80%',
    margin: '0px',
  },
}));

// TODO: export
function mapGroupInv(group) {
  return {
    'petto': 'chest',
    'schiena': 'back',
    'gambe': 'legs',
    'braccia': 'arms',
    'spalle': 'delts'
  }[group.toLowerCase()]
}

export default function PreferenceList(props) {
  const classes = useStyles();
  const items = props.items

  const handleToggle = (event) => {
    // TODO:
  }

  return (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        <Typography>Allenabile Insieme:</Typography>
        <Grid container>
          {
            items.map((item) => {
            const valueId = props.name + '_' + mapGroupInv(item)
              return (
                <Grid item xs={6}>
                  <ListItem 
                    key={item}
                    role="listitem" button
                    onClick={handleToggle}>
                    <Checkbox
                      name={valueId}
                      onChange={props.onChange}
                      checked={props.value[valueId]}/>
                    <ListItemText primary={item}/>
                  </ListItem>
                </Grid>
              );
            })
          }
        </Grid>
      </List>
    </Paper>
  );

}
