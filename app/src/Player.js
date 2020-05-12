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
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ApolloProvider } from "@apollo/react-hooks";
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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "react-avatar";
import Radio from "@material-ui/core/Radio";
import DialogContent from "@material-ui/core/DialogContent";
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";
import ApolloClient from "apollo-boost";

import EnabedTemplateInfo from "./EnabledTemplateInfo";

const client = new ApolloClient({
  uri: "/graphql",
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
      roleName
      isEmpty
    }
  }
`;

const GET_PLAYER_INFO = gql`
  query GetPlayer($id: Int!, $pass: String!) {
    player(id: $id, pass: $pass) {
      id
      name
      roleName
    }
    players {
      id
      name
      isEmpty
    }
    wolfKillList(id: $id) {
      id
      isKill
    }
    darkInfo(id:$id) {
      isStart
      remainTime
      actRoleType
      targetList {
        id
        isKill
      }
    }
  }
`;

const UPDATE_ROLE_NUMBER = gql`
  mutation UpdateRoleNumber($id: Int!, $number: Int!) {
    updateRoleNumber(id: $id, number: $number)
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

const UPDATE_PLAYER_NAME = gql`
  mutation UpdatePlayerName($id: Int!, $name: String!) {
    updatePlayerName(id: $id, name: $name)
  }
`;

const DARK_ACTION = gql`
  mutation DarkAction($targetId: Int!, $id: Int!) {
    exeDarkAction(targetId: $targetId, id: $id)
  }
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function PlayerTable(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>

            <TableCell align="right">玩家</TableCell>

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
              <TableCell align="right">
                <span
                  style={{
                    color: row.isEmpty ? "gray" : "lightgreen",
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

function DarkAction(props) {
  const [darkActon] = useMutation(DARK_ACTION);
  const killingList = props.data.darkInfo.targetList.filter(v=>v.isKill)
  return (
    <DialogContent>
      {props.data.darkInfo.remainTime}
      {props.data.darkInfo.targetList.map((v) => (
        <div>
          <Radio
            checked={v.isKill}
            name="radio-button-demo"
            inputProps={{ "aria-label": "B" }}
            onChange={() => {
              console.log(v.id);
              darkActon({ variables: { targetId: v.id, id: props.id } });
            }}
          />
          {`player ${v.id}`}
        </div>
      ))}
      <Radio
        checked={killingList.length === 0}
        name="radio-button-demo"
        inputProps={{ "aria-label": "B" }}
        onChange={() => {
          darkActon({ variables: { targetId: -1, id: props.id } });
        }}
      />
      {`none`}
    </DialogContent>
  );
}

function PlayerControl(props) {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_PLAYER_INFO, {
    fetchPolicy: "network-only",
    variables: { id: props.id, pass: props.pass },
    pollInterval: 500,
  });

  const [open, setOpen] = React.useState(true);
  const [value, setValue] = useDebounce(props.name, 500);
  const [name, setName] = React.useState(props.name);
  const [updatePlayerName, { called }] = useMutation(UPDATE_PLAYER_NAME);

  React.useEffect(() => {
    if (value && (value !== props.name || called)) {
      updatePlayerName({
        variables: { id: props.id, name: value },
      });
    }
  }, [value]);

  if (loading) {
    return <div>Loading</div>;
  }

  const { id, name: playerName, roleName } = data.player;
  return (
    <>
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={data.darkInfo.isStart}
      >
        {data.darkInfo.actRoleType && (
          <DarkAction data={data} id={props.id} />
        )}
      </Dialog>

      <Box display="flex">
        <TextField
          id="standard-basic"
          label="姓名"
          variant="outlined"
          className={classes.margin}
          margin="dense"
          value={name}
          onChange={(e) => {
            setValue(e.target.value);
            setName(e.target.value);
          }}
        />
      </Box>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h1" component="h1">
            {roleName}
          </Typography>
        </CardContent>
      </Card>

      <PlayerTable data={data.players} />
    </>
  );
}

export default function Player(props) {
  const { id, pass, name } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={3}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
        variant="fullWidth"
      >
        <Tab label="玩家" />
        <Tab label="模式" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <PlayerControl id={id} pass={pass} name={name} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <EnabedTemplateInfo />
      </TabPanel>
    </Paper>
  );
}
