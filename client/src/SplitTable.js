import {Grid, Paper, TableRow, Typography} from '@material-ui/core';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import InputTooltip from './InputTooltip'
import { mapGroup } from './groups'

function weekday(n) {
  return {0: 'LUNEDÌ', 1: 'MARTEDÌ', 2: 'MERCOLEDÌ',                          
    3: 'GIOVEDÌ', 4: 'VENERDÌ', 5: 'SABATO',                          
    6: 'DOMENICA'}[(n-1) % 7]    
}


function SplitCell(props) {
  const theme = useTheme();
  const color = theme.palette.type === 'dark' ? 'dark' : 'main'

  return (
    <td style={{backgroundColor: (props.rest ? theme.palette.secondary[color] : '')}}>
      <Typography variant="body1" align="center">
        {props.groups.map(g => g.toUpperCase()).join(' & ')} 
      </Typography>
    </td>
  );
}

const useStyles = makeStyles({
  pointer: {
    cursor: 'pointer'
  },
})

function SplitRow(props) {
  const handleClick = () => {
    props.handleClick(props.row)
  }
  const cols = props.cols
  const n = props.row
  const classes = useStyles()

  return (
    <InputTooltip
      enterDelay={600}
      enterNextDelay={600}
      placement="top"
      title="Clicca sulla riga selezionata per impostare un vincolo">
      <TableRow key={n.toString()}
        hover
        className={classes.pointer}
        selected={props.selected}
        onClick={handleClick}>
        <td align="left"> 
          <Typography variant="body1">
            {weekday(n)}
          </Typography>
        </td>
        <SplitCell rest={props.rest} groups={cols[0]}/>
        <SplitCell rest={props.rest} groups={cols[1]}/>
        <SplitCell rest={props.rest} groups={cols[2]}/>
        <SplitCell rest={props.rest} groups={cols[3]}/>
      </TableRow>
    </InputTooltip>
  );
}

function SplitTable(props) {

  function makeRows() {
    const groups = {'CHEST': 0, 'BACK':0, 'LEGS':0, 'ARMS':0, 'DELTS':0}
    const numbers = Array.from({length:props.days},(v,k)=>k+1)
    const split = props.split
    const richiami = props.richiami

    return numbers.map((n) => {
      const cols = [[], [], [], []];

      if (split != null && n <= split.length) {
        for (const group in groups) {
          if (split[n-1] && split[n - 1].includes(group)) {
            cols[groups[group]].push(mapGroup(group))
            groups[group] += 1
          }
        }
      }
      if (richiami != null && n <= richiami.length) {
        for (const group in groups) {
          if (richiami[n-1] && richiami[n - 1] && richiami[n - 1].includes(group)) {
            cols[3].push(mapGroup(group))
          }
        }
      }
      return (<SplitRow
        key={n.toString()}
        selected={props.selectedRow === n}
        rest={props.rest ? props.rest[n - 1] : false}
        handleClick={props.handleClick}
        row={n}
        cols={cols}/>);
    })
  }

  return (
    <Grid container spacing={0} justify="center" alignItems="center">
      <Grid item xs={11} md={8}>
        <Paper elevation={0} style={{width: '100%', marginTop: "6vh", marginBottom: "5vh"}}>
          <table>
            <tbody>
              <tr> 
                <th> </th>{/* Day */}
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
        </Paper>
      </Grid>
    </Grid>

  );

}

export default SplitTable
