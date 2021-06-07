import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/client";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import voteLogo from './ballot-box-with-ballot.png'
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
    minWidth: 750,
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const SET_DIE_STATUS = gql`
  mutation SetDieStatus($id: Int!) {
    setDieStatus(id: $id)
  }
`;
const SET_CHIEF_ID = gql`
  mutation SetChiefId($id: Int!) {
    setChiefId(id: $id)
  }
`;

const SET_VOTE_WEIGHTED_ID = gql`
  mutation SetVoteWeightedId($id: Int!) {
    setVoteWeightedId(id: $id)
  }
`;

const RESET_CHIEF_CANDIDATE = gql`
  mutation ResetChiefCandidate($id: Int!) {
    resetChiefCaniddate(id: $id)
  }
`;

const UPDATE_PASS = gql`
  mutation UpdatePass($id: Int!, $pass: String!) {
    updatePass(id: $id, pass: $pass)
  }
`;

//voteWeightedId

function FormDialog(props) {
  const [errMsg, setErrorMsg] = React.useState("");
  const [updatePass] = useMutation(UPDATE_PASS, {
    onError: () => {
      setErrorMsg("Access Error!");

      console.log("error");
    },
    onCompleted: () => {
      setOpen(false);
    },
  });
  const [open, setOpen] = React.useState(false);
  const [pass, setPass] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setPass(event.target.value);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        color={"secondary"}
        size="small"
      >
        重置
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="PWD"
            type="email"
            fullWidth
            onChange={handleChange}
            helperText={errMsg}
            error={errMsg !== ""}
            onClick={() => {
              setErrorMsg("");
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" size="small">
            Cancel
          </Button>
          <Button
            onClick={() => {
              updatePass({ variables: { id: props.id, pass } });
            }}
            color="secondary"
            size="small"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function VoteStatus(props) {
  const { isCandidate, isDropout } = props;

  return (
    <>
      {isCandidate === true && isDropout === false && (
         <img  src={voteLogo} style={{height:30, width:30}}/>
      )}
      {isCandidate === true && isDropout === true && (
        <span span aria-label="paw" style={{ fontSize: 30, marginLeft: 5 }}>
          🚫
        </span>
      )}

      {isCandidate === null && (
        <span span aria-label="paw" style={{ fontSize: 30, marginLeft: 5 }}>
          🤔
        </span>
      )}
    </>
  );
}

function CollapseSell(props) {
  const [setDie] = useMutation(SET_DIE_STATUS);
  const [setChiefId] = useMutation(SET_CHIEF_ID);
  const [setVoteWeightedId] = useMutation(SET_VOTE_WEIGHTED_ID);
  const [resetChiefCandidate] = useMutation(RESET_CHIEF_CANDIDATE);
  const row = props.row;
  const [openDetail, setOpenDetail] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenDetail(!openDetail)}
          >
            {openDetail ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {row.id === 0 || props.chiefId >= 0 ? (
            <Checkbox
              onChange={(e) => {
                setChiefId({ variables: { id: row.id } });
              }}
              checked={row.isChief}
              color="primary"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          ) : (
            row.chiefVoteState && (
              <VoteStatus
                isCandidate={row.chiefVoteState.isCandidate}
                isDropout={row.chiefVoteState.isDropout}
              />
            )
          )}

      
        </TableCell>
        <TableCell>
          {row.id ? (
            <Checkbox
              onChange={(e) => {
                setDie({ variables: { id: row.id } });
              }}
              checked={row.isDie}
              color="primary"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          ) : null}
        </TableCell>
        <TableCell>
          <Checkbox
            onChange={(e) => {
              //setChiefId({variables:{id:row.id}});
              setVoteWeightedId({ variables: { id: row.id } });
            }}
            checked={row.id === props.voteWeightedId}
            color="primary"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.roleName}</TableCell>
        <TableCell align="right">{row.votedNumber}</TableCell>
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
      <TableRow>
        <Collapse in={openDetail} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              進階
            </Typography>

            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell align="center">密碼 </TableCell>
                  <TableCell align="center">上警 </TableCell>
                  <TableCell align="center">退水 </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{row.pass || ""}</TableCell>
                  <TableCell align="center">
                    {row.chiefVoteState.isCandidate ? "Y" : "N"}
                  </TableCell>
                  <TableCell align="center">
                    {row.chiefVoteState.isDropout ? "Y" : "N"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">
                    <FormDialog id={row.id} />
                  </TableCell>

                  <TableCell align="center" colSpan={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        resetChiefCandidate({ variables: { id: row.id } });
                      }}
                      color={"secondary"}
                      size="small"
                    >
                      重置
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableRow>
    </React.Fragment>
  );
}

export default function PlayerTable(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>警長</TableCell>
            <TableCell>死亡</TableCell>
            <TableCell>放逐加權</TableCell>
            <TableCell>ID</TableCell>

            <TableCell align="left">玩家</TableCell>
            <TableCell align="right">角色</TableCell>
            <TableCell align="right">投票</TableCell>
            <TableCell align="center">警長</TableCell>
            <TableCell align="center">放逐</TableCell>
            <TableCell align="right">上線</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <CollapseSell {...props} row={row} key={row.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
