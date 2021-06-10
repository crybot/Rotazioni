import {TableRow, Typography} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';

function weekday(n) {
  return {0: 'LUNEDÌ', 1: 'MARTEDÌ', 2: 'MERCOLEDÌ',                          
    3: 'GIOVEDÌ', 4: 'VENERDÌ', 5: 'SABATO',                          
    6: 'DOMENICA'}[(n-1) % 7]    
}

// TODO: export
function mapGroup(group) {
  return {
    'chest': 'PETTO',
    'back': 'SCHIENA',
    'legs': 'GAMBE',
    'arms': 'BRACCIA',
    'delts': 'SPALLE'
  }[group.toLowerCase()]
}

function SplitCell(props) {
  const theme = useTheme();

  return (
    <td style={{backgroundColor: (props.rest ? theme.palette.secondary.main : '')}}>
      <Typography variant="body1" align="center">
        {props.groups.join(' & ')} 
      </Typography>
    </td>
  );
}

function SplitRow(props) {
  const handleClick = () => {
    props.handleClick(props.row)
  }
  const cols = props.cols
  const n = props.row

  return (
    <TableRow key={n.toString()}
      hover
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
      <SplitCell rest={props.rest} groups={[]}/>
    </TableRow>
  );
}

function SplitTable(props) {

  function makeRows() {
    const groups = {'CHEST': 0, 'BACK':0, 'LEGS':0, 'ARMS':0, 'DELTS':0}
    const numbers = Array.from({length:props.days},(v,k)=>k+1)
    const split = props.split

    return numbers.map((n) => {
      const cols = [[], [], []];

      if (split != null && n <= split.length) {
        for (const group in groups) {
          if (split[n - 1].includes(group)) {
            cols[groups[group]].push(mapGroup(group))
            groups[group] += 1
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
    <table align="center">
      <tbody>
        <tr> 
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
