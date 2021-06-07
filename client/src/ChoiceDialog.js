import { Paper, Dialog, DialogTitle, List, ListItem, ListItemText, Typography } from '@material-ui/core';

export default function SimpleDialog(props) {
  const { onClose, selectedValue, open, items } = props;

  const handleClose = () => {
    // onClose(selectedValue);
    onClose(null);
  };

  const handleListItemClick = (value) => {
    // onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Indicare il gruppo muscolare</DialogTitle>
      <List>
        {
          items.map((item) =>
            <ListItem button key={item}>
              <ListItemText primary={
                <Typography align="center" variant="body1">
                  {item.toUpperCase()}
                </Typography>
                }/>
            </ListItem>)
        }
      </List>
    </Dialog>
  );
}
