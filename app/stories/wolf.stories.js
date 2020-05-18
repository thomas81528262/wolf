import React from "react";
import { linkTo } from "@storybook/addon-links";
import { Welcome } from "@storybook/react/demo";
import { ApolloProvider } from "@apollo/react-hooks";
import CssBaseline from "@material-ui/core/CssBaseline";
export default {
  title: "Wolf",
  component: Welcome,
};

import God from "../src/God";
import AddRole from "../src/AddRole";
import Login from "../src/App";
import Admin from "../src/Admin";
import EditTemplateRole from "../src/EditTemplateRole";
import ApolloClient from "apollo-boost";
import Container from "@material-ui/core/Container";
import Player from "../src/Player"
const client = new ApolloClient({
  uri: "/graphql",
});

export const ToStorybook = () => (
  <ApolloProvider client={client}>
    <EditTemplateRole name={"測試"} />
  </ApolloProvider>
);

export const AdminView = () => (
  <ApolloProvider client={client}>
    <Admin />
  </ApolloProvider>
);

export const LoginView = () => (
  <ApolloProvider client={client}>
    <Login />
  </ApolloProvider>
);

export const GodView = () => (
  <ApolloProvider client={client}>
     <CssBaseline />
    <Container maxWidth="sm">
      <God />
    </Container>
  </ApolloProvider>
);

export const PlayerView1 = () => (
  <ApolloProvider client={client}>
     <CssBaseline />
    <Container maxWidth="sm">
      <Player id={1} pass={'123'} name={'thomas'}/>
    </Container>
  </ApolloProvider>
);

export const PlayerView2 = () => (
  <ApolloProvider client={client}>
     <CssBaseline />
    <Container maxWidth="sm">
      <Player id={2} pass={'123'} name={'thomas'}/>
    </Container>
  </ApolloProvider>
);

export const PlayerView3 = () => (
  <ApolloProvider client={client}>
     <CssBaseline />
    <Container maxWidth="sm">
      <Player id={3} pass={'123'} name={'thomas'}/>
    </Container>
  </ApolloProvider>
);


export const PlayerView4 = () => (
  <ApolloProvider client={client}>
     <CssBaseline />
    <Container maxWidth="sm">
      <Player id={4} pass={'123'} name={'thomas'}/>
    </Container>
  </ApolloProvider>
);

export const PlayerView5 = () => (
  <ApolloProvider client={client}>
     <CssBaseline />
    <Container maxWidth="sm">
      <Player id={5} pass={'123'} name={'thomas'}/>
    </Container>
  </ApolloProvider>
);

AdminView.story = {
  name: "Admin",
};

ToStorybook.story = {
  name: "Add Role Template",
};
