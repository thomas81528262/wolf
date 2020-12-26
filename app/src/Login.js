import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/client";

import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Avatar from "react-avatar";
import { mdiPaw } from "@mdi/js";
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";

import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  margin: {
    //margin: theme.spacing(1),
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const GET_PLAYERS = gql`
  {
    players {
      id
      name
      isEmpty
    }
  }
`;

const UPDATE_PLAYER_PASS = gql`
  mutation UpdatePlayerPass($id: Int!, $pass: String!) {
    updatePlayerPass(id: $id, pass: $pass) {
      isValid
      id
    }
  }
`;

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {new Date().getFullYear()}
    </Typography>
  );
}

function Icon(props) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "1.5rem", fill: "white" }}>
      <path d={props.path} />
    </svg>
  );
}

export default function Login() {
  const history = useHistory();
  const classes = useStyles();

  const [playerId, setPlayerId] = React.useState(-1);
  const [playerPass, setPlayerPass] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);
  const { loading, error, data, stopPolling, startPolling } = useQuery(
    GET_PLAYERS,
    {
      //pollInterval: 500,
      //fetchPolicy: "network-only",
    }
  );
  console.log(mdiPaw);
  const [
    updatePlayerPass,
    { loading: passLoading, data: passData },
  ] = useMutation(UPDATE_PLAYER_PASS, {
    onCompleted: (data) => {
      if (data.updatePlayerPass.isValid) {
        history.push("/game");
      }
    },
  });

  React.useEffect(() => {
    startPolling(500);

    return () => {
      stopPolling();
    };
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <Container component="main">
      <div style={{ width: 350, position:'fixed', top:'50%', left:'50%', transform:"translate(-50%, -50%)" }}>
        <Avatar src="test-3.png" size="350" />
        <Autocomplete
          fullWidth
          id="combo-box-demo"
          className={classes.margin}
          options={data.players}
          getOptionLabel={(option) => `玩家 ${option.id}`}
          renderOption={(option) => (
            <React.Fragment>
              <span
                style={{
                  color: option.isEmpty ? "gray" : "lightgreen",
                  transition: "all .3s ease",
                  fontSize: "24px",
                  marginRight: "10px",
                }}
              >
                &#x25cf;
              </span>
              {` 玩家 ${option.id}`}
            </React.Fragment>
          )}
          onChange={(event, newValue) => {
            setPlayerId(newValue.id);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="玩家"
              variant="outlined"
              margin="dense"
            />
          )}
        />

        <TextField
          fullWidth
          id="standard-basic"
          label="密碼"
          variant="outlined"
          className={classes.margin}
          margin="dense"
          onChange={(e) => setPlayerPass(e.target.value)}
          value={playerPass}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => {
            updatePlayerPass({
              variables: { id: playerId, pass: playerPass },
            });
          }}
        >
          <Icon path={mdiPaw} />
        </Button>
      </div>

      {/*<Box mt={8}>
        <Copyright />
        </Box>*/}
    </Container>
  );
}
