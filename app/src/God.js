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
import { RoleTable } from "./RoleTable";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Admin from "./Admin";
import Typography from "@material-ui/core/Typography";
import EnabedTemplateInfo from "./EnabledTemplateInfo";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";
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
    players {
      id
      name
      roleName
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

const GENERATE_TEMPLATE_ROLE = gql`
  mutation GenerateTemplateRole {
    generateTemplateRole
  }
`;

const GENERATE_TEMPLATE_PLAYER = gql`
  mutation GenerateTemplatePlayer {
    generateTemplatePlayer
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
const GET_TEMPLATE = gql`
  query GetTemplate($name: String!) {
    template(name: $name) {
      roles {
        name
        number
        id
      }
      description
    }
    players {
      id
      name
      roleName
    }
  }
`;

function TemplateRoleTable(props) {
  return (
    <RoleTable
      query={GET_ENABLED_TEMPLATE}
      variables={{}}
      parseData={(data) => {
        const playerGroup = {};

        data.players.forEach((p) => {
          const { roleName, name, id } = p;
          if (playerGroup[roleName]) {
            playerGroup[roleName].push({ name: name || "", id });
          } else {
            playerGroup[roleName] = [{ name: name || "", id }];
          }
        });

        console.log(playerGroup);

        const result = [];

        data.enabledTemplate.roles.forEach((r) => {
          console.log("r", r);

          const { name } = r;
          result.push({ ...r, players: playerGroup[name] });
        });

        console.log(result);

        return result;
      }}
      pollInterval={500}
    />
  );
}

function Game(props) {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_ROLES, {
    pollInterval: 500,
  });

  //const [updateRoleNumber] = useMutation(UPDATE_ROLE_NUMBER);

  const [generateRole] = useMutation(GENERATE_TEMPLATE_ROLE);
  const [generatePlayer] = useMutation(GENERATE_TEMPLATE_PLAYER);
  const [removeAllPlayer] = useMutation(REMOVE_ALL_PLAYER);
  //const [roleId, setRoleId] = React.useState(-1);
  //const [roleNumber, setRoleNumber] = React.useState(0);

  const [value, setValue] = useDebounce(props.name, 500);
  const [name, setName] = React.useState(props.name||'');
  const [updatePlayerName, { called }] = useMutation(UPDATE_PLAYER_NAME);

  React.useEffect(() => {
    if (value && (value !== props.name || called)) {
      updatePlayerName({
        variables: { id: 0, name: value },
      });
    }
  }, [value]);
  /*
  const handleRoleChange = (event, newValue) => {
    setRoleId(newValue.id);
  };
  */

  if (props.isPlayerMode) {
    return (
      <div style={{}}>
        <Box display="flex">
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
        </Box>
        <Box display="flex">
        <TextField
          id="standard-basic"
          label="姓名"
          variant="outlined"
          margin="dense"
          value={name}
          onChange={(e) => {
            setValue(e.target.value);
            setName(e.target.value);
          }}
        />
        </Box>
        <PlayerTable data={props.players} />
      </div>
    );
  }

  return (
    <div style={{}}>
      <Box display="flex">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            generatePlayer();
          }}
        >
          加入玩家
        </Button>
      </Box>
      <EnabedTemplateInfo />
    </div>
  );
}

export default function God(props) {
  const [value, setValue] = React.useState(0);
  const { loading, error, data } = useQuery(GET_ROLES, {
    pollInterval: 500,
  });
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return <div>Loading</div>;
  }

  const { id, pass, name } = props;

  const isPlayerMode = data.players.length > 1 ? true : false;

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
        <Tab label="遊戲" />
        <Tab label={isPlayerMode ? "黑夜視野" : "模式選擇"} />
        {isPlayerMode && <Tab label="模式" />}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Game isPlayerMode={isPlayerMode} id={id} pass={pass} name={name} players={data.players}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {isPlayerMode ? <TemplateRoleTable /> : <Admin />}
      </TabPanel>
      {isPlayerMode && (
        <TabPanel value={value} index={2}>
          <EnabedTemplateInfo />
        </TabPanel>
      )}
    </Paper>
  );
}
