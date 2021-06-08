import { Icon, IconButton, Paper, Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';

export default function SimpleDialog(props) {
  const { onClose, selectedValue, open, items } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleDeleteClick = () => {
    onClose('clear')
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Indicare il Gruppo Muscolare</DialogTitle>
      <List>
        {
          items.map((item) =>
            <ListItem onClick={() => handleListItemClick(item)} button key={item}>
              <ListItemText primary={
                <Typography align="center" variant="body1">
                  {item.toUpperCase()}
                </Typography>
                }/>
            </ListItem>)
        }
        <ListItem onClick={handleDeleteClick} button key="cancel">
          <ListItemIcon>
            <Icon>
              delete
            </Icon>
          </ListItemIcon>
          <ListItemText primary={
            <Typography align="right" variant="body1">
              Ripristina
            </Typography>
            }/>
        </ListItem>
      </List>
    </Dialog>
  );
}
