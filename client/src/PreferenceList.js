import React from 'react';
import { List, ListItem, ListItemText, 
  ListItemIcon, Checkbox, 
  Typography, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  grid: {
    margin: '0px',
  },
  paper: {
    maxWidth: '25ch'
  }
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

  return (
    <Paper className={classes.paper} variant="outlined">
      <List dense component="div" role="list">
        <Typography variant="body2">Allenabile Insieme:</Typography>
        <Grid className={classes.grid} container spacing={0}>
          {
            items.map((item) => {
            const valueId = props.name + '_' + mapGroupInv(item)
              return (
                <Grid item xs={6}>
                  <ListItem 
                    name={valueId}
                    key={item}
                    role="listitem">
                    <Checkbox
                      name={valueId}
                      onChange={props.onChange}
                      checked={props.value[valueId]}/>
                    <ListItemText primary={<Typography variant="overline">{item}</Typography>}/>
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
