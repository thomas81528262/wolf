import React, { useEffect } from "react";
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import PlayerTable from "./PlayerTable";
import DarkPlayerTable from "./DarkPlayerTable";
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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
const GET_ROLES = gql`
  {
    templates {
      isEnabled
      name
    }
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
      isTarget
      id
      name
      roleName
      vote
      chiefVote
      isEmpty
      isDie
      isVoteFinish
      votedNumber
      chiefVoteState {
        isDropedOut
        isCandidate
        type
      }
    }
    gameInfo(id: 0) {
      isVoteFinish
      chiefId
      isDark
      voteWeightedId
      hasVoteTarget
      hasChief
    }
  }
`;

const UPDATE_PLAYER_NAME = gql`
  mutation UpdatePlayerName($id: Int!, $name: String!) {
    updatePlayerName(id: $id, name: $name)
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

const VOTE_START = gql`
  mutation VoteStart($targets: [Int]) {
    voteStart(targets: $targets)
  }
`;

const VOTE_CHIEF_START = gql`
  mutation VoteChiefStart {
    voteChiefStart
  }
`;






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

const parseData = (data) => {
  const playerGroup = {};

  data.players.forEach((p) => {
    const { roleName, name, id } = p;
    if (playerGroup[roleName]) {
      playerGroup[roleName].push({ name: name || "", id });
    } else {
      playerGroup[roleName] = [{ name: name || "", id }];
    }
  });

  const result = [];

  data.enabledTemplate.roles.forEach((r) => {
    const { name } = r;
    result.push({ ...r, players: playerGroup[name] });
  });

  return result;
};

function TemplateRoleTable(props) {
  return <RoleTable data={props.data} />;

  /*
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
  */
}

function VoteAction(props) {
  const [targetList, setTargetList] = React.useState([]);
  const [voteStart] = useMutation(
    props.hasChief  || props.hasVoteTarget?  VOTE_START : VOTE_CHIEF_START,
    {
      onCompleted: () => {
        props.onClose();
      },
    }
  );
  //const [submitVote, { called }] = useMutation(SUBMIT_VOTE);


  const isLock = props.hasTarget || props.hasChief;

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {`${
            props.hasChief ? `請選擇放逐的目標` : `請選擇警長候選人`
          }, 目標必須多於一人, 投票人數也必須多於一人`}
        </DialogContentText>
        {props.players
          .filter((p) => {


            if (props.hasVoteTarget) {
              return p.isTarget;
            }else if (!props.hasChief) {
              return (
                p.chiefVoteState.isCandidate && !p.chiefVoteState.isDropedOut
              );
            }

            return !p.isDie && p.id !== 0;
          })
          .map((player) => (
            <div key={player.id}>
              <Radio
                checked={targetList.includes(player.id)}
                name="radio-button-demo"
                inputProps={{ "aria-label": "B" }}
                onClick={() => {
                  if (
                    !targetList.includes(player.id) &&
                    targetList.length + 1 !==
                      props.players.filter((p) => !p.isDie && p.id !== 0).length
                  ) {
                    setTargetList([...targetList, player.id]);
                  }
                }}
              />
              {` ${player.id} : ${player.name || ""}`}
            </div>
          ))}
        <Radio
          checked={targetList.length === 0}
          name="radio-button-demo"
          inputProps={{ "aria-label": "B" }}
          onClick={() => {

            if (!isLock) {
              setTargetList([]);
            }
            
          }}
        />
        {`所有人`}
      </DialogContent>
      <DialogActions>
        {(targetList.length === 0 || targetList.length > 1) && (
          <Button
            onClick={() => {
              voteStart({ variables: { targets: targetList } });
              //submitVote({variables:{id:props.id, target}})
            }}
            color="primary"
          >
            確認
          </Button>
        )}
      </DialogActions>
    </>
  );
}

function Game(props) {
  const classes = useStyles();

  //const [updateRoleNumber] = useMutation(UPDATE_ROLE_NUMBER);

  const [generateRole] = useMutation(GENERATE_TEMPLATE_ROLE);
  const [generatePlayer] = useMutation(GENERATE_TEMPLATE_PLAYER);
  const [removeAllPlayer] = useMutation(REMOVE_ALL_PLAYER);
  const [voteStart] = useMutation(VOTE_START);
  //const [roleId, setRoleId] = React.useState(-1);
  //const [roleNumber, setRoleNumber] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = useDebounce(props.name, 500);
  const [name, setName] = React.useState(props.name || "");
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

  const hasChief = props.chiefId !== -1;

  if (props.isPlayerMode) {
    if (props.isDark) {
      return (
        <DarkPlayerTable
          data={props.players}
          chiefId={props.chiefId}
          voteWeightedId={props.voteWeightedId}
        />
      );
    }

    return (
      <>
        <Dialog
          aria-labelledby="simple-dialog-title"
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <DialogTitle id="form-dialog-title">
            {hasChief ? `放逐開始` : `競選警長`}
          </DialogTitle>
          <VoteAction
            players={props.players}
            onClose={() => {
              setIsOpen(false);
            }}
            hasChief={hasChief}
            hasVoteTarget={props.hasVoteTarget}
          />
        </Dialog>
        <Box display="flex">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              generateRole();
            }}
          >
            <div style={{fontWeight:800}}>
            產生角色
            </div>
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              removeAllPlayer();
            }}
          >
            <div style={{fontWeight:800}}>
            刪除玩家
            </div>
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              //voteStart();
              setIsOpen(true);
            }}
          >
            {hasChief ? `放逐` : `警長`}
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
        <PlayerTable
          data={props.players}
          chiefId={props.chiefId}
          voteWeightedId={props.voteWeightedId}
        />
      </>
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
      <EnabedTemplateInfo data={props.data} />
    </div>
  );
}

export default function God(props) {
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  const [getRole, { loading, data, error, called }] = useLazyQuery(GET_ROLES, {
    fetchPolicy: "network-only",
  });
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let isMounted = true;
  useEffect(() => {
    if (isMounted) {
      getRole();
    }

    const interval = setInterval(() => {
      if (isMounted) {
        getRole();
      }
    }, 500);

    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (error && !loading) {
      error.graphQLErrors.forEach((e) => {
        const { extensions } = e;
        if (extensions.code === "UNAUTHENTICATED") {
          console.log("no access!!!");
          history.push("/");
        }
      });

      console.log("set dark");

      if (data && data.gameInfo.isDark) {
        props.setDarkMode(true);
      }
    }
  }, [error, loading, data]);

  React.useEffect(() => {
    if (data) {
      props.setDarkMode(data.gameInfo.isDark);
    }
  }, [data]);

  if (!called || !data) {
    return <div>Loading</div>;
  }

  const { id, pass, name } = props;

  const isPlayerMode = data.players.length > 1 ? true : false;
  console.log(data);
  return (
    <Container maxWidth={isPlayerMode && value === 0 ? "lg" : "sm"}>
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
          <Game
            isPlayerMode={isPlayerMode}
            id={id}
            pass={pass}
            name={name}
            players={data.players}
            chiefId={data.gameInfo.chiefId}
            isDark={data.gameInfo.isDark}
            voteWeightedId={data.gameInfo.voteWeightedId}
            data={data}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          {isPlayerMode ? (
            <TemplateRoleTable data={parseData(data)} />
          ) : (
            <Admin data={parseData(data)} tData={data} />
          )}
        </TabPanel>

        {isPlayerMode && (
          <TabPanel value={value} index={2}>
            <EnabedTemplateInfo data={data} />
          </TabPanel>
        )}
      </Paper>
    </Container>
  );
}
