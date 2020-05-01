import React from "react";
import { linkTo } from "@storybook/addon-links";
import { Welcome } from "@storybook/react/demo";
import { ApolloProvider } from "@apollo/react-hooks";
export default {
  title: "Wolf",
  component: Welcome,
};

import God from "../src/God"
import AddRole from "../src/AddRole";
import Login from "../src/App";
import Admin from "../src/Admin";
import EditTemplateRole from "../src/EditTemplateRole";
import ApolloClient from "apollo-boost";
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

export const GodView = () =>( <ApolloProvider client={client}>
 <God/>
</ApolloProvider>);

AdminView.story = {
  name: "Admin",
};

ToStorybook.story = {
  name: "Add Role Template",
};
