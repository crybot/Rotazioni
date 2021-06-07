import { Icon, IconButton, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';

function weekday(n) {
  return {0: 'LUNEDÌ', 1: 'MARTEDÌ', 2: 'MERCOLEDÌ',                          
    3: 'GIOVEDÌ', 4: 'VENERDÌ', 5: 'SABATO',                          
    6: 'DOMENICA'}[(n-1) % 7]    
}

const useStyles = (theme) => makeStyles({
  // buttonCol: {
  //   width: '10px',
  //   border: 'none',
  // },
});


function SplitCell(props) {
  const theme = useTheme();

  return (
    <td style={{backgroundColor: (props.marked ? theme.palette.secondary.main : '')}}> 
      <Typography variant="body1" align="center">
        {props.groups.join(' & ')} 
      </Typography>
    </td>
  );
}

function SplitRow(props) {
  const classes = useStyles()
  const [marked, setMarked] = useState(false)
  const handleClick = () => {
    setMarked(!marked)
    props.handleClick(props.row, !marked)
  }
  const cols = props.cols
  const n = props.row

  return (
    <tr key={n.toString()}
      onClick={handleClick}>
      <td align="right" style={{width: '10px', border: 'none'}}> 
        <IconButton size="small">
          <Icon>
            add_box
          </Icon>
        </IconButton>
      </td>
      <td align="left"> 
        <Typography variant="body1">
          {weekday(n)}
        </Typography>
      </td>
      <SplitCell marked={marked} groups={cols[0]}/>
      <SplitCell marked={marked} groups={cols[1]}/>
      <SplitCell marked={marked} groups={cols[2]}/>
      <SplitCell marked={marked} groups={[]}/>
    </tr>
  );
}

function SplitTable(props) {
  const classes = useStyles()

  function makeRows() {
    const groups = {'CHEST': 0, 'BACK':0, 'LEGS':0, 'ARMS':0, 'DELTS':0}
    const numbers = Array.from({length:props.days},(v,k)=>k+1)
    const split = props.split

    const rows = numbers.map((n) => {
      var cols = [[], [], []]

      if (split != null && n <= split.length) {
        for (var group in groups) {
          if (split[n-1].includes(group)) {
            cols[groups[group]].push(group)
            groups[group] += 1
          }
        }
      }
      return (<SplitRow key={n.toString()} handleClick={props.handleClick} row={n} cols={cols} />);
    });

    return rows
  }

  return (
    <table align="center">
      <tbody>
        <tr> 
          <th style={{width: '10px', border: 'none'}}> </th> {/* Button */}
          <th> </th> {/* Day */}
          <th>
            <Typography variant="body1">
              ROTAZIONE I 
            </Typography>
          </th>
          <th>
            <Typography variant="body1">
              ROTAZIONE II
            </Typography>
          </th>
          <th>
            <Typography variant="body1">
              ROTAZIONE III
            </Typography>
          </th>
          <th>
            <Typography variant="body1">
              RICHIAMO
            </Typography>
          </th>
        </tr>
        {makeRows()}
      </tbody>
    </table>
  );

}

export default SplitTable
