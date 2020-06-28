import React, {useEffect} from "react";
import { useQuery, useMutation , useLazyQuery} from "@apollo/client";
import { gql } from "apollo-boost";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
const GET_ROLES = gql`
  {
    roles {
      id
      name
      number
    }
    players {
      id
      name
      roleName
      isEmpty
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  table: {
    minWidth: 450,
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

//if the number = 0 will not show
//caculate the total number
function processData(data) {
  let total = 0;

  const result = [];

  data.forEach((d) => {
    const { number } = d;
    if (number) {
      total += number;
      result.push(d);
    }
  });
  return { total, data: result };
}

function BaseTable(props) {
  const classes = useStyles();

  console.log(props.data)
  
  const { total, data } = processData(props.data);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>角色</TableCell>

            <TableCell align="right">人數</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <React.Fragment key={row.name}>
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.number}</TableCell>
              </TableRow>
              {row.players ? (
                <TableRow align="left">
                  {row.players.map((v,idx) => (
                    <div style={{ fontSize: 22, marginLeft:45 }} key={idx}>{`${v.id} : ${v.name}`}</div>
                  ))}
                </TableRow>
              ) : null}
           </React.Fragment>
          ))}
          <TableRow>
            <TableCell align="right">總人數</TableCell>
            <TableCell align="right">{total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function RoleTable(props) {

  return <BaseTable data={props.data} />;

  /*
  const { variables, query, pollInterval } = props;

  
  const [queryData,{ loading, error, data: rawData, called}] = useLazyQuery(query, {
    //fetchPolicy:"network-only",
    variables,
    //pollInterval
  });


  let isMounted = true;
 useEffect(() => {
   if (isMounted) {
     queryData();
   }

   const interval = setInterval(() => {
     if (isMounted) {
       queryData();
     }
   }, 500);

   return () => {
     clearInterval(interval);
     isMounted = false;
   };
 }, []);

  if (!called || !rawData) {
    return <div>Loading</div>;
  }

  const data = props.parseData(rawData);

  console.log(data, variables, query, rawData);

  return <BaseTable data={data} />;
  */
}

export { RoleTable, BaseTable };
