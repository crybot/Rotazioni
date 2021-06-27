import { Dialog, DialogTitle, List, ListItem} from '@material-ui/core';
import { ListItemText, Typography } from '@material-ui/core';
import { Divider, Box, Grid, Icon, IconButton } from '@material-ui/core';

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

export default function SimpleDialog(props) {
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
    // TODO: do not wrap text
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
