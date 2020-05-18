import React from "react";
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


export default function PlayerTable(props) {
    const classes = useStyles();
  
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
  
              <TableCell align="right">玩家</TableCell>
              <TableCell align="right">角色</TableCell>
              <TableCell align="right">上線</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.id}

                  
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.roleName}</TableCell>
                <TableCell align="right">
                  <span
                    style={{
                      color: row.isEmpty?"gray" :"lightgreen",
                      transition: "all .3s ease",
                      fontSize: "24px",
                      marginRight: "10px",
                    }}
                  >
                    &#x25cf;
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }