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
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from '@material-ui/core/SvgIcon';
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";

import TabPanel from "./TabPanel";
import EnabedTemplateInfo from "./EnabledTemplateInfo";
import { useHistory } from "react-router-dom";
import { ReactSVG } from "react-svg";
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
    players {
      id
      name
      isEmpty
      revealedRole
      isChief
      isDie
      vote
      chiefVote
      isValidCandidate
      isVoteFinish
      chiefVoteState {
        isDropout
        isCandidate
      }
    }

    gameInfo(id: $id) {
      uuid
      isVoteFinish
      chiefId
      isDark
      isChiefCandidateConfirmed
      chiefVoteState {
        isDropout
        isCandidate
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

const GET_GAME_REPORT_INFO = gql`
  {
    players {
      id
      name
      roleName
      isChief
      isDie
      vote
      chiefVote
    }
    gameInfo {
      gameEnded
    }
  }
`;

const CHECK_GAME_ENDED = gql`
  {
    gameInfo {
      gameEnded
    }
  }
`;


function ChiefIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M14.5,12.59l0.9,3.88L12,14.42l-3.4,2.05l0.9-3.87l-3-2.59l3.96-0.34L12,6.02l1.54,3.64L17.5,10L14.5,12.59z M12,3.19 l7,3.11V11c0,4.52-2.98,8.69-7,9.93C7.98,19.69,5,15.52,5,11V6.3L12,3.19 M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12 V5L12,1L12,1z" />
    </SvgIcon>
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
                  <div style={{ width: 30 }}>
                    <ReactSVG src="infinity.svg" />
                  </div>
                ) : row.isDie ? (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    🐾
                  </span>
                ) : (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    {row.id}
                  </span>
                )}
                {row.isChief && row.id !== 0 && (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    🌟
                  </span>
                )}
                {row.chiefVoteState &&
                  row.chiefVoteState.isCandidate === true &&
                  row.chiefVoteState.isDropout === false && (
                    <span
                      span
                      aria-label="paw"
                      style={{ fontSize: 30, marginLeft: 5 }}
                    >
                      🗳️
                    </span>
                  )}
                {row.chiefVoteState &&
                  row.chiefVoteState.isCandidate === true &&
                  row.chiefVoteState.isDropout === true && (
                    <span
                      span
                      aria-label="paw"
                      style={{ fontSize: 30, marginLeft: 5 }}
                    >
                      🚫
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

function GameReportTable(props) {
  console.log("Game Report Table:");
  console.log(props.data);
  return (
    <TableContainer component={Paper}>
      <Table className="GameReport" aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>

            <TableCell align="center">玩家</TableCell>
            <TableCell align="center">角色</TableCell>
            <TableCell align="center">警長</TableCell>
            <TableCell align="center">放逐</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id === 0 ? (
                  <div style={{ width: 30 }}>
                    <ReactSVG src="infinity.svg" />
                  </div>
                ) : row.isDie ? (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    🐾
                  </span>
                ) : (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    {row.id}
                  </span>
                )}
                {row.isChief && row.id !== 0 && (
                  <span aria-label="paw" style={{ fontSize: 30 }}>
                    🌟
                  </span>
                )}
                {row.chiefVoteState &&
                  row.chiefVoteState.isCandidate === true &&
                  row.chiefVoteState.isDropout === false && (
                    <span
                      span
                      aria-label="paw"
                      style={{ fontSize: 30, marginLeft: 5 }}
                    >
                      🗳️
                    </span>
                  )}
                {row.chiefVoteState &&
                  row.chiefVoteState.isCandidate === true &&
                  row.chiefVoteState.isDropout === true && (
                    <span
                      span
                      aria-label="paw"
                      style={{ fontSize: 30, marginLeft: 5 }}
                    >
                      🚫
                    </span>
                  )}
              </TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.roleName}</TableCell>
              <TableCell align="right">{row.chiefVote.toString()}</TableCell>
              <TableCell align="right">{row.vote.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
  const [setIsVoter] = useMutation(SET_IS_VOTER, {
    onCompleted: () => {
      props.onClose();
    },
  });

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
            
          >
            <CheckIcon style={{color:'green'}}/>
          </Button>
          {!props.isCandidate && (
            <Button
              onClick={() => {
                setIsVoter();
              }}
              
            >
             <CloseIcon style={{color:'red'}}/>
            </Button>
          )}
          <Button
            onClick={() => {
              props.onClose();
            }}
            
          >
            <CancelIcon/>
          </Button>
        </DialogActions>
      </DialogContent>
    </>
  );
}

function PlayerControl(props) {
  const classes = useStyles();
  const history = useHistory();

  const [playerInfo, { loading, error, data, called: playerCalled }] =
    useLazyQuery(GET_PLAYER_INFO, { fetchPolicy: "network-only" });

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
              {data.gameInfo.chiefVoteState.isCandidate === true ? (
               <Tooltip title="退水" placement="top">
               <IconButton
                 disabled={data.gameInfo.chiefVoteState.isDropout}
                 aria-label="delete"
                 onClick={() => {
                   setOpenChiefCandidate(true);
                 }}
               >
                 <BlockIcon fontSize="large"/>
               </IconButton>
             </Tooltip>
              ) : (
                <Tooltip title="競選警長" placement="top">
                  <IconButton
                    disabled={data.gameInfo.chiefVoteState.isCandidate !== null}
                    aria-label="delete"
                    onClick={() => {
                      setOpenChiefCandidate(true);
                    }}
                  >
                    <ChiefIcon fontSize="large"/>
                  </IconButton>
                </Tooltip>
              )}
            </>
          ) : null}
        </Box>
      )}
      <Box display="flex">
        <TextField
          autoComplete="off"
          color="secondary"
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

function GameDetailedInfoPanel() {
  const gameEndedResult =
  useQuery(CHECK_GAME_ENDED, { fetchPolicy: "network-only" });

  const gameReportResult =
  useQuery(GET_GAME_REPORT_INFO, { fetchPolicy: "network-only",
  skip: gameEndedResult.loading || !gameEndedResult.data.gameInfo.gameEnded});

  if (gameEndedResult.loading) {
    return <div>Loading</div>;
  }
  
  if (!gameEndedResult.data.gameInfo.gameEnded) {
    return <>遊戲結束始發布</>;
  } else {
    return GameDetailedInfoInternalPanel(gameReportResult);
  }
}

function GameDetailedInfoInternalPanel(props) {
  const { loading, data} = props;
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <>
    <GameReportTable data={data.players} />
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
    <Container maxWidth={"sm"}>
      <Paper elevation={3}>
        <Tabs
          value={value}
          indicatorColor="secondary"
          textColor="secondary"
          onChange={handleChange}
          aria-label="disabled tabs example"
          variant="fullWidth"
        >
          <Tab label="玩家" />
          <Tab label="模式" />
          <Tab label="覆盤完整資訊" />
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
        <TabPanel value={value} index={2}>
          <GameDetailedInfoPanel />
        </TabPanel>
      </Paper>
    </Container>
  );
}
