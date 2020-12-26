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
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import ReactCardFlip from "react-card-flip";
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
import DialogActions from "@material-ui/core/DialogActions";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "react-avatar";
import Radio from "@material-ui/core/Radio";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";

import EnabedTemplateInfo from "./EnabledTemplateInfo";
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

const GET_PLAYER_INFO = gql`
  query GetPlayer($id: Int!, $pass: String!) {
    player(id: $id, pass: $pass) {
      id
      name
      roleName
    }
    players(id: $id) {
      id
      name
      isEmpty
      revealedRole
      isDie
      vote
      chiefVote
      isValidCandidate
      isVoteFinish
      chiefVoteState {
        type
      }
    }
    wolfKillList(id: $id) {
      id
      isKill
    }
    gameInfo(id: $id) {
      uuid
      isVoteFinish
      chiefId
      isDark
      chiefVoteState {
        isDropedOut
        isCandidate
        type
      }
    }
    darkInfo(id: $id) {
      isStart
      remainTime
      actRoleType
      darkDay
      targetList {
        id
        isKill
      }
    }
  }
`;

const SUBMIT_VOTE = gql`
  mutation SubmitVote($target: Int!) {
    submitVote(target: $target)
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

const SUBMIT_CHIEF_CANDIDATE = gql`
  mutation submitChiefCandidate {
    setIsChiefCandidate
  }
`;

const SET_IS_VOTER = gql`
  mutation setIsVoter {
    setIsVoter
  }
`;

const DROP_OUT_CHIEF_CANDIDATE = gql`
  mutation dropOutChiefCandidate {
    setIsChiefDropOut
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
  console.log(props.data);
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>

            <TableCell align="center">玩家</TableCell>
            <TableCell align="center">警長</TableCell>
            <TableCell align="center">放逐</TableCell>
            <TableCell align="right">狀態</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id === 0 ? (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    ♾️
                  </span>
                ) : row.isDie ? (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    🐾
                  </span>
                ) : (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    {row.id}
                  </span>
                )}
                {row.id === props.chiefId && row.id !== 0 && (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    🌟
                  </span>
                )}
                {row.chiefVoteState &&
                  row.chiefVoteState.type &&
                  row.chiefVoteState.type == "chief" && (
                    <span
                      span
                      aria-label="paw"
                      style={{ fontSize: 30, marginLeft: 5 }}
                    >
                      😃
                    </span>
                  )}
                {row.chiefVoteState &&
                  row.chiefVoteState.type &&
                  row.chiefVoteState.type == "drop" && (
                    <span
                      span
                      aria-label="paw"
                      style={{ fontSize: 30, marginLeft: 5 }}
                    >
                      😂
                    </span>
                  )}
              </TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="right">{row.chiefVote.toString()}</TableCell>
              <TableCell align="right">{row.vote.toString()}</TableCell>
              <TableCell align="right">
                <span
                  style={{
                    color: row.isEmpty
                      ? "gray"
                      : row.isVoteFinish
                      ? "lightgreen"
                      : "orange",
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

const dialogContent = {
  WITCH_KILL: { text: "女巫毒人中", music: new Audio("/witch_kill.mp3") },
  WITCH_SAVE: { text: "女巫救人中", music: new Audio("/witch_save.mp3") },
  WOLF: { text: "狼人正在忙碌的殺人 請稍後", music: new Audio("/wolf.mp3") },
  PROPHET: { text: "預言家驗人", music: new Audio("/prophet.mp3") },
  HUNTER: { text: "獵人獵殺", music: new Audio("/hunter.mp3") },
  GUARD: { text: "守衛守人", music: new Audio("/guard.mp3") },
};

function DarkAction(props) {
  const [darkActon] = useMutation(DARK_ACTION);
  const seletingList = props.data.darkInfo.targetList.filter(
    (v) => v.isKill === true
  );

  console.log(seletingList);
  //const [actRoleType, setActRoleType] = React.useState()
  const { actRoleType } = props.data.darkInfo;

  React.useEffect(() => {
    console.log("rerender");
    dialogContent[actRoleType].music.play();

    return () => {
      dialogContent[actRoleType].music.pause();
    };
  }, [actRoleType]);

  return (
    <DialogContent>
      <DialogTitle id="simple-dialog-title">
        第 {props.data.darkInfo.darkDay} 夜
      </DialogTitle>

      <DialogContentText id="alert-dialog-description">
        {dialogContent[actRoleType].text}
      </DialogContentText>
      {props.data.darkInfo.remainTime}

      {props.data.darkInfo.targetList.length !== 0 && (
        <>
          {props.data.darkInfo.targetList.map((v, idx) => (
            <div key={idx}>
              <Radio
                checked={v.isKill ? true : false}
                name="radio-button-demo"
                inputProps={{ "aria-label": "B" }}
                onClick={() => {
                  console.log(v.id);
                  darkActon({ variables: { targetId: v.id, id: props.id } });
                }}
              />
              {`player ${v.id}`}
            </div>
          ))}
          <Radio
            checked={seletingList.length === 0 ? true : false}
            name="radio-button-demo"
            inputProps={{ "aria-label": "B" }}
            onChange={() => {
              darkActon({ variables: { targetId: -1, id: props.id } });
            }}
          />
          {`none`}
        </>
      )}
    </DialogContent>
  );
}

function VoteAction(props) {
  const [target, setTarget] = React.useState(-1);

  const [submitVote, { called }] = useMutation(SUBMIT_VOTE);

  return (
    <>
      <DialogContent>
        {props.players
          .filter((p) => p.isValidCandidate)
          .map((player) => (
            <div key={player.id}>
              <Radio
                checked={player.id === target}
                name="radio-button-demo"
                inputProps={{ "aria-label": "B" }}
                onClick={() => {
                  setTarget(player.id);
                }}
              />
              {` ${player.id} : ${player.name || ""}`}
            </div>
          ))}
        <Radio
          checked={-1 === target}
          name="radio-button-demo"
          inputProps={{ "aria-label": "B" }}
          onClick={() => {
            setTarget(-1);
          }}
        />
        {`棄權`}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            submitVote({ variables: { target } });
          }}
          color="primary"
        >
          確認
        </Button>
      </DialogActions>
    </>
  );
}

function CandidateChiefDialog(props) {


  const [setIsVoter] = useMutation(SET_IS_VOTER, { onCompleted: () => {
    props.onClose();
  },})

  const [submitChiefCandidate] = useMutation(SUBMIT_CHIEF_CANDIDATE, {
    onCompleted: () => {
      props.onClose();
    },
  });

  const [dropOutChiefCandidate] = useMutation(DROP_OUT_CHIEF_CANDIDATE, {
    onCompleted: () => {
      props.onClose();
    },
  });

  return (
    <>
      {props.isCandidate ? (
        <DialogTitle id="form-dialog-title">是否退水？</DialogTitle>
      ) : (
        <DialogTitle id="form-dialog-title">是否競選警長？</DialogTitle>
      )}
      <DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (props.isCandidate) {
                dropOutChiefCandidate();
              } else {
                submitChiefCandidate();
              }
            }}
            color="primary"
          >
            確認
          </Button>
          {!props.isCandidate && <Button
            onClick={() => {
              setIsVoter();
            }}
            style={{color:'DarkOrange'}}
          >
            不要!
          </Button>}
          <Button
            onClick={() => {
              props.onClose();
            }}
            color="secondary"
          >
            取消
          </Button>
        </DialogActions>
      </DialogContent>
    </>
  );
}

function PlayerControl(props) {
  const classes = useStyles();
  const history = useHistory();

  const [
    playerInfo,
    { loading, error, data, called: playerCalled },
  ] = useLazyQuery(GET_PLAYER_INFO, { fetchPolicy: "network-only" });

  const [openChiefCandidate, setOpenChiefCandidate] = React.useState(false);
  const [value, setValue] = useDebounce(props.name, 500);
  const [name, setName] = React.useState(props.name);
  const [updatePlayerName, { called }] = useMutation(UPDATE_PLAYER_NAME);

  let isMounted = true;
  useEffect(() => {
    if (isMounted) {
      playerInfo({ variables: { id: props.id, pass: props.pass } });
    }

    const interval = setInterval(() => {
      if (isMounted) {
        playerInfo({ variables: { id: props.id, pass: props.pass } });
      }
    }, 500);

    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (value && (value !== props.name || called)) {
      updatePlayerName({
        variables: { id: props.id, name: value },
      });
    }

    if (error && !loading) {
      history.push("/");
    }

    //audioEl.play()
  }, [value, error, loading]);

  React.useEffect(() => {
    if (data) {
      props.setDarkMode(data.gameInfo.isDark);
    }
  }, [data]);

  const [roleName, setRoleName] = React.useState("");
  const uuid = data ? data.gameInfo.uuid : "";
  const dataRoleName = data ? data.player.roleName : "";
  React.useEffect(() => {
    setRoleName("");

    if (data) {
      console.log(data);
      setTimeout(() => {
        setRoleName(data.player.roleName);
      }, 1000);
    }

    return () => {
      setRoleName("");
    };
  }, [uuid, dataRoleName]);

  if (!playerCalled || !data) {
    return <div>Loading</div>;
  }

  const hasChief = data.gameInfo.chiefId !== -1;
  const { id, name: playerName } = data.player;
  return (
    <>
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={!data.gameInfo.isVoteFinish}
      >
        <DialogTitle id="form-dialog-title">
          {hasChief ? `放逐玩家` : `選擇警長`}
        </DialogTitle>
        <VoteAction players={data.players} id={id} />
      </Dialog>

      {!hasChief && (
        <Box display="flex">
          {data.gameInfo.chiefVoteState ? (
            <>
              <Dialog
                aria-labelledby="simple-dialog-title"
                open={openChiefCandidate}
              >
                <CandidateChiefDialog
                  onClose={() => {
                    setOpenChiefCandidate(false);
                  }}
                  isCandidate={data.gameInfo.chiefVoteState.isCandidate}
                />
              </Dialog>
              {data.gameInfo.chiefVoteState.isCandidate ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpenChiefCandidate(true);
                  }}
                  disabled={data.gameInfo.chiefVoteState.isDropedOut}
                >
                  退水
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setOpenChiefCandidate(true);
                  }}
                  disabled={data.gameInfo.chiefVoteState.type !== null}
                >
                   <div style={{fontWeight:800}}>
                  上警
                  </div>
                </Button>
              )}
            </>
          ) : null}
        </Box>
      )}
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
          <ReactCardFlip
            isFlipped={roleName ? true : false}
            flipDirection="vertical"
          >
            <Typography variant="h1" component="h1">
              {"❔"}
            </Typography>
            <Typography variant="h2" component="h2">
              {roleName || "❔"}
            </Typography>
          </ReactCardFlip>
        </CardContent>
      </Card>

      <PlayerTable data={data.players} chiefId={data.gameInfo.chiefId} />
    </>
  );
}

function TemplateInfo() {
  const { loading, error, data } = useQuery(GET_ENABLED_TEMPLATE, {
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <div>Loading</div>;
  }

  return <EnabedTemplateInfo data={data} />;
}

export default function Player(props) {
  const { id, pass, name } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={"sm"}>
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
          <PlayerControl
            id={id}
            pass={pass}
            name={name}
            setDarkMode={props.setDarkMode}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TemplateInfo />
        </TabPanel>
      </Paper>
    </Container>
  );
}
