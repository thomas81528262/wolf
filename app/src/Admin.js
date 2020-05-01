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
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import CreateIcon from "@material-ui/icons/Create";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import AddRole from "./AddRole";
import EditTemplateRole from "./EditTemplateRole";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
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

const GET_TEMPLATES = gql`
  {
    templates {
      isEnabled
      name
      description
      roles {
        name
        number
      }
    }
  }
`;

const ADD_TEMPLATE = gql`
  mutation addTemplate($name: String!) {
    addNewTemplate(name: $name)
  }
`;

const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($name: String!) {
    deleteTemplate(name: $name)
  }
`;


const ENABLE_TEMPLATE = gql`
  mutation EnableTemplate($name: String!) {
    enableTemplate(name: $name)
  }
`;

function TemplateTable(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>選擇</TableCell>
            <TableCell align="left">遊戲模式</TableCell>
            <TableCell align="right">
              <div style={{ marginRight: 10 }}>編輯</div>
            </TableCell>
            <TableCell align="right">
              <div style={{ marginRight: 10 }}>刪除</div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow key={row.name}>
              <TableCell>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                    props.onSelect(row.name);
                    }
                  }}
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  checked={row.isEnabled}
                />
              </TableCell>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    
                      props.onEdit(row.name);
                    
                  }}
                >
                  <CreateIcon />
                </IconButton>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    
                      //props.onEdit(row.name);
                      props.onDelete(row.name)
                  }}
                  disabled={row.isEnabled}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Admin() {
  const classes = useStyles();

  const [name, setName] = React.useState("");
  const [editName, setEditName] = React.useState("");
  const [addTemplate] = useMutation(ADD_TEMPLATE);
  const [deleteTemplate] = useMutation(DELETE_TEMPLATE)
  const [isBusy, setIsBusy] = React.useState(false);

  const { loading, error, data, stopPolling, startPolling, called } = useQuery(
    GET_TEMPLATES,
    {
      pollInterval: 500,
      //notifyOnNetworkStatusChange:true
    }
  );
  const [enableTemplate, enableResult] = useMutation(ENABLE_TEMPLATE, {
    onCompleted: () => {
      setIsBusy(true);
      startPolling(500);
      setTimeout(() => {
        setIsBusy(false);
        
      }, 2000);
      
    },
  });

  if (loading || enableResult.loading || isBusy) {
    return <div>Loading</div>;
  }

  if (editName) {
    return (
      <div>
        <Box display="flex">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setEditName("");
          }}
        >
          退出
        </Button>
        </Box>
        <EditTemplateRole name={editName} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <TextField
          id="standard-basic"
          label="模式名稱"
          variant="outlined"
          className={classes.margin}
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ marginTop: 5 }}>
          <Fab
            size="medium"
            color="secondary"
            aria-label="add"
            size="small"
            onClick={() => {
              addTemplate({ variables: { name } });
            }}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>
      <Container maxWidth="sm">
        <TemplateTable
          data={data.templates}
          onEdit={(name) => {
            console.log(name)
            setEditName(name);
          }}
          onSelect={(name) => {
            enableTemplate({ variables: { name } });
            stopPolling();
          }}
          onDelete={(name)=>{
            deleteTemplate({variables:{name}})
          }}
        />
      </Container>
    </div>
  );
}
