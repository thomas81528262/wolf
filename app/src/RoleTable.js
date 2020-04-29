
import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
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


function SimpleTable(props) {
    const classes = useStyles();
  
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
            {props.data.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }


export default function RoleTable() {
    const { loading, error, data } = useQuery(GET_ROLES, {
      pollInterval: 500,
    });
  
    if (loading) {
      return null;
    }
  
    return (
      <div>
        <SimpleTable data={data.roles.filter((d) => d.id > 0)} />
      </div>
    );
  }