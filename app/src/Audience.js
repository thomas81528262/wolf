import React, { useEffect } from "react";
import { gql } from "apollo-boost";
import { useLazyQuery} from "@apollo/client";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ReactSVG } from "react-svg";

const GET_GAME_INFO = gql`
  {
    playersAudienceView {
      id
      name
      isChief
      isDie
      vote
      chiefVote
    }
  }
`;

function GameInfoTable(props) {
    console.log("Game Report Table:");
    console.log(props.data);
    return (
      <TableContainer component={Paper}>
        <Table className="GameReport" aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="center">玩家</TableCell>
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
                <TableCell align="right">{row.chiefVote.toString()}</TableCell>
                <TableCell align="right">{row.vote.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

function GameInfoPanel() {
  const [gameInfo, {loading, data}] =
  useLazyQuery(GET_GAME_INFO, { fetchPolicy: "network-only" });


  let isMounted = true;
  useEffect(() => {
    if (isMounted) {
        gameInfo();
    }

    const interval = setInterval(() => {
      if (isMounted) {
        gameInfo();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, []);

  if (!data) {
    return <div>Loading</div>;
  }
  console.log({data});
  console.log(data.playersAudienceView);
  return <GameInfoTable data={data.playersAudienceView} />; 
}

export default function Audience() {
    return (
        <Container maxWidth={"sm"}>
            <GameInfoPanel/>
        </Container>
    );
}