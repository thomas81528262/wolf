import React from "react";
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import PlayerTable from "./PlayerTable";
import RoleTable from "./RoleTable";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Admin from "./Admin"
const GET_PLAYERS = gql`
  {
    players {
      id
      name
      isEmpty
    }
  }
`;

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

const GET_ENABLED_TEMPLATE = gql`
{
    enabledTemplate {
    name
    description
    roles {
      name
      id
      number
    }
  }
}
`;

const GET_PLAYER = gql`
  query GetPlayer($id: Int!, $pass: String!) {
    player(id: $id, pass: $pass) {
      id
      name
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

const GENERATE_ROLE = gql`
  mutation GenerateRole {
    generateRole
  }
`;

const GENERATE_PLAYER = gql`
  mutation GeneratePlayer {
    generatePlayer
  }
`;

const REMOVE_ALL_PLAYER = gql`
  mutation RemoveAllPlayer {
    removeAllPlayer
  }
`;
//enableTemplate(name:"777")


const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  table: {
    minWidth: 250,
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));



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


function Game() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_ROLES, {
    pollInterval: 500,
    
  });
  const [updateRoleNumber] = useMutation(UPDATE_ROLE_NUMBER);

  const [generateRole] = useMutation(GENERATE_ROLE);
  const [generatePlayer] = useMutation(GENERATE_PLAYER);
  const [removeAllPlayer] = useMutation(REMOVE_ALL_PLAYER);
  const [roleId, setRoleId] = React.useState(-1);
  const [roleNumber, setRoleNumber] = React.useState(0);
  if (loading) {
    return <div>Loading</div>;
  }

  const handleRoleChange = (event, newValue) => {
    setRoleId(newValue.id);
  };

  if (data.players.length > 1) {
    return (
      <div style={{ marginTop: 120 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            generateRole();
          }}
        >
          產生角色
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            removeAllPlayer();
          }}
        >
          刪除玩家
        </Button>
        <Container maxWidth="sm">
          <PlayerTable data={data.players} />
        </Container>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 120 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          generatePlayer();
        }}
      >
        加入玩家
      </Button>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Autocomplete
          id="combo-box-demo"
          options={data.roles.filter((d) => d.id > 0)}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          onChange={handleRoleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="角色"
              variant="outlined"
              margin="dense"
            />
          )}
        />

        <TextField
          id="standard-basic"
          label="人數"
          variant="outlined"
          className={classes.margin}
          margin="dense"
          type="number"
          value={roleNumber}
          onChange={(e) => setRoleNumber(e.target.value)}
        />
        <div style={{ marginTop: 5 }}>
          <Fab
            size="medium"
            color="secondary"
            aria-label="add"
            size="small"
            onClick={() => {
              console.log(roleId, roleNumber);
              updateRoleNumber({
                variables: { id: roleId, number: parseInt(roleNumber) },
              });
            }}
          >
            <SaveIcon />
          </Fab>
        </div>
      </div>
      <Container maxWidth="sm">{/*<RoleTable />*/}</Container>
    </div>
  );
}

export default function God() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container maxWidth="sm">
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="遊戲" />
          <Tab label="模式" />
          <Tab label="黑夜順序" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Game />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Admin />
        </TabPanel>
      </Paper>
    </Container>
  );
}
