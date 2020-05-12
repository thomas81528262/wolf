var express = require("express");
var app = express();
const { ApolloServer, gql } = require("apollo-server-express");
const WolfModel = require("./model");
const Game = require("./game");
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Player {
    name: String
    id: Int
    roleName: String
    isEmpty: Boolean
    isKill: Boolean
    isDie: Boolean
  }

  type Role {
    name: String
    id: Int
    number: Int
    description: String
  }

  type Template {
    name: String
    description: String
    roles: [Role]
    isEnabled: Boolean
  }

  type PlayerStatus {
    isValid: Boolean
    name: String
  }

  enum ActRoleType {
    WITCH
    WOLF
  }

  type DarkInfo {
    isStart: Boolean
    remainTime: Int
    targetList: [Player]
    actRoleType:ActRoleType
  }

  input RoleOrder {
    id: [Int]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    enabledTemplate: Template
    template(name: String): Template
    templates: [Template]
    players: [Player]
    roles: [Role]
    player(id: Int, pass: String): Player
    wolfKillList(id: Int): [Player]
    darkInfo(id: Int): DarkInfo
  }
  type Mutation {
    exeDarkAction(id: Int, targetId: Int): String
    updateRoleNumber(id: Int, number: Int): String
    updatePlayerPass(id: Int, pass: String): PlayerStatus
    updatePlayerName(id: Int, name: String): String
    generatePlayer: String
    generateRole: String
    removeAllPlayer: String
    addNewTemplate(name: String): String
    deleteTemplate(name: String): String
    generateTemplatePlayer: String
    generateTemplateRole: String
    updateTemplateDescription(name: String, description: String): String
    updateTemplateRole(name: String, roleId: Int, number: Int): String
    updateTemplateRolePriority(ids: [Int], name: String): String
    enableTemplate(name: String): String
    darkStart: String
  }
`;

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolvers = {
  Query: {
    darkInfo: (root, args, context) => {
      const { id } = args;
      const actionResult = Game.dark.resultFunction({ id });
      const { isStart, remainTime, actRoleType } = Game.dark;
      return { isStart, remainTime, targetList:actionResult, actRoleType };
    },
    wolfKillList: (root, args, context) => {
      const { id } = args;
      const result = Game.dark.wolfKillingList({ id });
      return result;
    },
    /*
    whichKillList: (root, args, context) => {
      const {id} = args;
      const result = Game.dark.witchKillingList({id});
      return result;
    },
    */
    enabledTemplate: async (root, args, context) => {
      const result = await WolfModel.getEnabledTemplate();
      return result;
    },
    template: async (root, args, context) => {
      const { name } = args;
      const result = await WolfModel.getTemplate({ name });
      return result;
    },
    templates: async () => {
      const result = await WolfModel.getAllTemplate();

      return result;
    },
    players: async () => {
      const result = await WolfModel.getPlayerList();

      return result;
    },
    roles: async () => {
      const result = await WolfModel.getAllRole();
      return result;
    },
    player: async (root, args, context) => {
      const { id, pass } = args;
      const result = await WolfModel.getPlayerInfo({ id, pass });
      return result;
    },
  },
  Mutation: {
    exeDarkAction: async (root, args, context) => {
      const { targetId, id } = args;
      Game.dark.actionFunction({ playerId: targetId, id });

      return "pass";
    },
    darkStart: async () => {
      Game.dark.start();

      return "pass";
    },

    enableTemplate: async (root, args, context) => {
      const { name } = args;

      await WolfModel.enableTemplate({ name });
      return "pass";
    },
    updateTemplateRolePriority: async (root, args, context) => {
      const { ids, name } = args;

      await WolfModel.updateTemplateRolePriority({ name, ids });
      return "pass";
    },

    updateTemplateRole: async (root, args, context) => {
      const { name, roleId, number } = args;
      console.log(roleId);
      await WolfModel.updateTemplateRole({ name, roleId, number });
      return "pass";
    },
    addNewTemplate: async (root, args, context) => {
      const { name, description } = args;

      await WolfModel.addNewTemplate({ name });
      return "pass";
    },
    deleteTemplate: async (root, args, context) => {
      const { name, description } = args;

      await WolfModel.deleteTemplate({ name });
      return "pass";
    },

    updateTemplateDescription: async (root, args, context) => {
      const { name, description } = args;
      console.log(name, description);
      await WolfModel.updateTemplateDescription({ name, description });
      return "pass";
    },
    updateRoleNumber: async (root, args, context) => {
      const { id, number } = args;

      await WolfModel.updateRoleNumber({ id, number });
      return "pass";
    },
    updatePlayerPass: async (root, args, context) => {
      const { id, pass } = args;
      const result = await WolfModel.updatePlayerPass({ id, pass });

      return { ...result };
    },
    updatePlayerName: async (root, args, context) => {
      const { id, name } = args;
      await WolfModel.updatePlayerName({ id, name });
      return "pass";
    },
    generateTemplatePlayer: async (root, args, context) => {
      await WolfModel.generateTemplatePlayer();
      return "pass";
    },
    generateTemplateRole: async (root, args, context) => {
      await WolfModel.generateTemplateRole();
      return "pass";
    },
    generatePlayer: async (root, args, context) => {
      await WolfModel.generatePlayer();
      return "pass";
    },
    generateRole: async (root, args, context) => {
      await WolfModel.generateRole();
      return "pass";
    },
    removeAllPlayer: async (root, args, context) => {
      await WolfModel.removeAllPlayer();
      return "pass";
    },
  },
};

/*
app.get('/', function (req, res) {
  res.send('Hello World!');
});
*/

const webPath = "/web";

app.use(express.static(`${process.cwd()}${webPath}`));

app.get("/", (request, response) => {
  response.sendFile(`${process.cwd()}${webPath}/index.html`);
});

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

// The `listen` method launches a web server.
var port = process.env.PORT || 4000;
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
