import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { gql } from "apollo-boost";
import {
  useLazyQuery,
  useQuery,
  useMutation,
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";
import Footer from "./Footer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import Avatar from "react-avatar";
import { ReactSVG } from 'react-svg'
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";
//import ApolloClient from "apollo-boost";

import God from "./God";
import Admin from "./Admin";
import Player from "./Player";

import LoginPage from "./Login";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


import { ThemeProvider } from '@material-ui/styles';
import blue from '@material-ui/core/colors/blue';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "/graphql",
  }),
});

const auth = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "/auth",
  }),
});

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
    login {
      id
      isValid
    }
  }
`;

const LOG_OFF = gql`
  mutation Logoff {
    logoff
  }
`;

const UPDATE_PLAYER_PASS = gql`
  mutation UpdatePlayerPass($id: Int!, $pass: String!) {
    updatePlayerPass(id: $id, pass: $pass) {
      isValid
      name
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
/*
function Login() {
  const classes = useStyles();

  const [playerId, setPlayerId] = React.useState(-1);
  const [playerPass, setPlayerPass] = React.useState("");
  const { loading, error, data } = useQuery(GET_PLAYERS);
  const [updatePlayerPass, playerStatus] = useMutation(UPDATE_PLAYER_PASS);
  const [isValidPlayerStatus, setIsValidPlayerStatus] = React.useState(false);
  if (loading || playerStatus.loading) {
    return <div>Loading</div>;
  }

  //if (playerStatus.data)

  if (
    playerStatus.called &&
    playerStatus.data.updatePlayerPass.isValid &&
    isValidPlayerStatus
  ) {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <AppBar position="absolute">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                小狼狼
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setIsValidPlayerStatus(false);
                }}
              >
                退出
              </Button>
            </Toolbar>
          </AppBar>

          {
            <div style={{ marginTop: 100 }}>
              {playerId === 0 ? (
                <God
                  id={playerId}
                  pass={playerPass}
                  name={playerStatus.data.updatePlayerPass.name}
                />
              ) : (
                <Player
                  id={playerId}
                  pass={playerPass}
                  name={playerStatus.data.updatePlayerPass.name}
                />
              )}
            </div>
          }

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </React.Fragment>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ marginTop: "20%" }}>
        <Avatar round={true} src="wolf-login.png" />
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
            setIsValidPlayerStatus(true);
          }}
        >
          登入
        </Button>
      </div>

      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
*/

function LogoffButton() {
  const history = useHistory();
  const [logoff] = useMutation(LOG_OFF, {
    onCompleted: () => {
      history.push("/");
    },
  });

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={() => {
        logoff();
        //setIsValidPlayerStatus(false);
      }}
    >
      退出
    </Button>
  );
}

function Game(props) {
  const history = useHistory();
  const [getPlayer, { loading, error, data }] = useLazyQuery(GET_PLAYERS, {
    fetchPolicy: "network-only",
  });

  const classes = useStyles();

  let isMounted = true;
  useEffect(() => {
    if (isMounted) {
      getPlayer();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (error) {
      error.graphQLErrors.forEach((e) => {
        const { extensions } = e;
        if (extensions.code === "UNAUTHENTICATED") {
          history.push("/")
          //setIsLogoff(true);
        }
      });
    }
  }, [error]);

  if (loading || !data) {
    return <div>Loading</div>;
  }

  //const [playerId, setPlayerId] = React.useState(-1);
  //const [playerPass, setPlayerPass] = React.useState("");

  //const [isLogoff, setIsLogoff] = React.useState(false);
  /*
  const { loading, error, data } = useQuery(GET_PLAYERS, {
    fetchPolicy: "network-only",
  });
  */

  /*
  const [logoff, {loading:logoffLoading, data:logoffdata}] = useMutation(LOG_OFF, {
    onCompleted: () => {
      console.log('complete')
      //setIsLogoff(true);
    },
  });
  */

  /*
  
  */

  /*
  React.useEffect(() => {
    if (!loading && isLogoff && !logoffLoading) {
      history.push("/");
    }
  }, [loading, isLogoff, logoffLoading]);
  */
  /*
  if (loading) {
    return <div>Loading</div>;
  }
  */

  console.log(data, loading)

  const playerId = data.login.id;
  return (
    <React.Fragment>
      <CssBaseline />
      
        <AppBar position="absolute">
          <Toolbar>
            
            <Typography variant="h6" className={classes.title}>
              <div style={{width:50, margin:'auto', marginTop:10}}>
            <ReactSVG src="wolf.svg" />
            </div>
            </Typography>
            <LogoffButton />
          </Toolbar>
        </AppBar>

        <div style={{ marginTop: 100 }}>
          {playerId === 0 ? (
            <Container maxWidth={playerId === 0 ? "md" : "sm"}>
            <God id={playerId} pass={""} name={""} setDarkMode={props.setDarkMode} />
            </Container>
          ) : (
           
            <Player id={playerId} pass={""} name={""} setDarkMode={props.setDarkMode}/>
            
          )}
        </div>

        <Box pt={4}>
          <Copyright />
        </Box>
     
    </React.Fragment>
  );
}

/*
const theme = createMuiTheme({
  
  palette: {
    primary: {
      main: '#82b1ff',
    },
    type: 'dark',
  },
  
});
*/

function App() {


  const [isDarkMode, setDarkMode] = React.useState(false);


  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: isDarkMode ? 'dark' : 'light',
          primary: isDarkMode ? {
            main: '#F8A9A0',
          }:{
            main: '#F8A9A0',
          },
        },
       
      }),
    [isDarkMode],
  );


  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/">
            <ApolloProvider client={auth}>
              <LoginPage />
            </ApolloProvider>
          </Route>

          <Route exact path="/game">
            <ApolloProvider client={client}>
              <Game setDarkMode={setDarkMode}/>
            </ApolloProvider>
          </Route>
        </Switch>
      </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
