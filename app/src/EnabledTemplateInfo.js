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
//import RoleTable from "./RoleTable";
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

import {BaseTable as BaseRoleTable} from "./RoleTable";

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



export default function EnabledTemplate(props) {

  /*
    const { loading, error, data } = useQuery(GET_ENABLED_TEMPLATE, {
      fetchPolicy: "network-only",
    });
  
    if (loading) {
      return <div>Loading</div>;
    }
  
   */
    const { name, description ,roles} = props.data.enabledTemplate;

    
    return (
      <div>
        <Typography variant="h2" gutterBottom>
          {name}
        </Typography>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={6}
          fullWidth
          value={description || ""}
          variant="outlined"
          label="規則"
          disabled
          
        />
       <BaseRoleTable data={roles}/>
      </div>
    );
  }



