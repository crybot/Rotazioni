import { Typography } from '@material-ui/core';

function SplitCell(props) {
  return (
    <td>
      <Typography align="center">
        {props.groups.join(' & ')} 
      </Typography>
    </td>
  );
}

function SplitTable(props) {

  function weekday(n) {
    return {0: 'LUNEDÌ', 1: 'MARTEDÌ', 2: 'MERCOLEDÌ',                          
      3: 'GIOVEDÌ', 4: 'VENERDÌ', 5: 'SABATO',                          
      6: 'DOMENICA'}[(n-1) % 7]    
  }

  function makeRow(split, n, groups) {
    var cols = [[], [], []]

    if (split != null) {
      for (var group in groups) {
        if (split[n-1].includes(group)) {
          cols[groups[group]].push(group)
          groups[group] += 1
        }
      }
    }

    return (
      <tr key={n.toString()}> 
        <td align="left"> 
          <Typography>
            {weekday(n)}
          </Typography>
        </td>
        <SplitCell groups={cols[0]}/>
        <SplitCell groups={cols[1]}/>
        <SplitCell groups={cols[2]}/>
        <td> </td>
      </tr>
    );

  }

  const groups = {'CHEST': 0, 'BACK':0, 'LEGS':0, 'ARMS':0, 'DELTS':0}
  const numbers = Array.from({length:props.days},(v,k)=>k+1)
  const split = props.split
  const rows = numbers.map((n) => 
    makeRow(split, n, groups)
  );

  return (
    <table align="center">
      <tr> 
        <th> </th>
        <th>
          <Typography>
            ROTAZIONE I 
          </Typography>
        </th>
        <th>
          <Typography>
            ROTAZIONE II
          </Typography>
        </th>
        <th>
          <Typography>
            ROTAZIONE III
          </Typography>
        </th>
        <th>
          <Typography>
            RICHIAMO
          </Typography>
        </th>
      </tr>
      {rows}
    </table>
  );

}

export default SplitTable
