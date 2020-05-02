import React from "react";
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import PlayerTable from "./PlayerTable";
import { RoleTable } from "./RoleTable";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import Container from "@material-ui/core/Container";
import AddRole from "./AddRole";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DragBox from "../src/drag/Container";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";



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
  }
`;

const UPDATE_ROLE_NUMBER = gql`
  mutation UpdateTempl($roleId: Int!, $number: Int!, $name: String!) {
    updateTemplateRole(name: $name, number: $number, roleId: $roleId)
  }
`;

const UPDATE_RULE = gql`
  mutation UpdateRule($name: String!, $description: String!) {
    updateTemplateDescription(name: $name, description: $description)
  }
`;

const UPDATE_ROLE_PRIORITY = gql`
  mutation UpdateRolePriority($name: String!, $ids: [Int]!) {
    updateTemplateRolePriority(name: $name, ids: $ids)
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

const convertToDragData = (data) => {
  const result = [];
  data.forEach((d) => {
    const { name, id } = d;
    result.push({ id, text: name });
  });
  return result;
};

function EditDarkPriority(props) {
  const { name } = props;

  const [priorityList, setPrioritylist] = React.useState([]);
  const [orgPriorityList, setOrgPriorityList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { loading, error, data, refetch } = useQuery(GET_TEMPLATE, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: { name },
    onCompleted: (res) => {
      console.log("complete", res);
      const idData = convertToDragData(res.template.roles);
      setPrioritylist(idData.map((v) => v.id));
      setOrgPriorityList(idData.map((v) => v.id));
    },
  });
  const [updateRolePriority, res] = useMutation(UPDATE_ROLE_PRIORITY, {
    onCompleted: () => {
      refetch();
    },
  });

  if (loading || res.loading) {
    return <div>Loading</div>;
  }

  console.log(data, orgPriorityList, priorityList);
  const dragData = convertToDragData(data.template.roles);

  return (
    <DndProvider backend={Backend}>
      <IconButton
        aria-label="delete"
        onClick={() => {
          updateRolePriority({ variables: { name, ids: priorityList } });
        }}
        color={
          orgPriorityList.toString() === priorityList.toString()
            ? "primary"
            : "secondary"
        }
      >
        <SaveIcon />
      </IconButton>
      <DragBox
        data={dragData}
        onUpdate={(data) => {
          console.log("update view");
          setPrioritylist(data.map((v) => v.id));
        }}
      />
    </DndProvider>
  );
}

function EditRole(props) {
  const { name } = props;
  const [updateRoleNumber] = useMutation(UPDATE_ROLE_NUMBER);
  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {name}
      </Typography>
      <AddRole
        updateRoleNumber={({ id: roleId, number }) => {
          console.log(roleId, name);
          updateRoleNumber({ variables: { roleId, name, number } });
        }}
      />

      <RoleTable
        query={GET_TEMPLATE}
        variables={{ name }}
        parseData={(d) => {
            console.log(d)
          return d.template.roles;
        }}
        pollInterval={500}
    />
    </div>
  );
}

function EditRuleCore(props) {
  const [value, setValue] = React.useState(props.value);
  return (
    <div>
      <IconButton
        aria-label="delete"
        onClick={() => {
          props.updateRule({
            variables: { description: value, name: props.name },
          });
        }}
        color={value === props.value ? "primary" : "secondary"}
      >
        <SaveIcon />
      </IconButton>
      <TextField
        id="outlined-multiline-static"
        multiline
        rows={4}
        fullWidth
        value={value}
        variant="outlined"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function EditRule(props) {
  const { name } = props;

  const { loading, error, data, refetch } = useQuery(GET_TEMPLATE, {
    variables: { name },
  });

  const [updateRule, ruleResult] = useMutation(UPDATE_RULE, {
    onCompleted: () => {
      refetch();
    },
  });

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <EditRuleCore
      value={data.template.description}
      updateRule={updateRule}
      name={name}
    />
  );
}

export default function EditTemplate(props) {
  const { name } = props;
    
  const [value, setValue] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper square>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="角色" />
        <Tab label="規則" />
        <Tab label="黑夜順序" />
        
      </Tabs>
      <TabPanel value={value} index={0}>
        <EditRole name={name} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <EditRule name={name} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EditDarkPriority name={name} />
        
      </TabPanel>
     
    </Paper>
  );
}
