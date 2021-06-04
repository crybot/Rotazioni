import { Typography } from '@material-ui/core';

function SplitTable(props) {

  function weekday(n) {
    return {0: 'LUNEDÌ', 1: 'MARTEDÌ', 2: 'MERCOLEDÌ',                          
      3: 'GIOVEDÌ', 4: 'VENERDÌ', 5: 'SABATO',                          
      6: 'DOMENICA'}[(n-1) % 7]    
  }

  const numbers = Array.from({length:props.days},(v,k)=>k+1)
  const split = props.split
  const rows = numbers.map((n) => 
    <tr key={n.toString()}> 
      <td align="left"> 
        <Typography>
          {weekday(n)}
        </Typography>
      </td>
      <td>
        <Typography align="center">
          {split && n <= split.length ? split[n-1].join(' & ') : ''}
        </Typography>
      </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
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
