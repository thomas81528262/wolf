import React from "react";
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "apollo-boost";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import PlayerTable from "./PlayerTable";
import RoleTable from "./RoleTable";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import Container from "@material-ui/core/Container";

const GET_ROLES = gql`
  {
    roles {
      id
      name
      
    }
    
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

export default function AddRole(props) {
  const classes = useStyles();
  const [roleId, setRoleId] = React.useState(-1);
  const [roleNumber, setRoleNumber] = React.useState(0);
  const { loading, error, data } = useQuery(GET_ROLES);
  const handleRoleChange = (event, newValue) => {
    setRoleId(newValue.id);
  };

  if (loading) {
    return <div>Loading</div>;
  }

  console.log(data)

  return (
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
            props.updateRoleNumber({
              id: roleId,
              number: parseInt(roleNumber),
            });
            /*
            updateRoleNumber({
              variables: { id: roleId, number: parseInt(roleNumber) },
            });
            */
          }}
        >
          <SaveIcon />
        </Fab>
      </div>
    </div>
  );
}
