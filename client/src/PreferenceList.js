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

export default function PreferenceList(props) {
  const classes = useStyles();
  const items = props.items
  const handleToggle = (event) => {

  }

  return (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        <Typography>Allenabile Insieme:</Typography>
        <Grid container>
          {
            items.map((item) => {
              return (
                <Grid item xs={6}>
                  <ListItem 
                    key={item}
                    role="listitem" button
                    onClick={handleToggle}>
                    <Checkbox/>
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
