const { ApolloServer, gql } = require("apollo-server-express");
const WolfModel = require("./model");


const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Player {
    name: String
    id: Int
    roleName: String
    isEmpty: Boolean
    isKill: Boolean
    isDie: Boolean
    revealedRole: String
    vote: [String]
    chiefVote: [String]
    isValidCandidate: Boolean
    isVoteFinish: Boolean
    votedNumber: Float
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
    id: Int
  }

  enum ActRoleType {
    WITCH_KILL
    WITCH_SAVE
    WOLF
    PROPHET
    HUNTER
    GUARD
  }

  type DarkInfo {
    isStart: Boolean
    remainTime: Int
    targetList: [Player]
    actRoleType: ActRoleType
    darkDay: Int
  }

  type GameInfo {
    isVoteFinish: Boolean
    chiefId: Int
  }

  input RoleOrder {
    id: [Int]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    players(id: Int): [Player]
    login:PlayerStatus
  }
  type Mutation {
    updatePlayerPass(id: Int, pass: String): PlayerStatus
  }
`;

const resolvers = {
  Query: {

   
    players: async (root, args, context) => {
      const { id } = args;

      const {players:result} = await WolfModel.getPlayerList();

      result.forEach((role, idx) => {
        const voteStatus = WolfModel.getVoteStatus({ id: idx });
        const playerStatus = WolfModel.getPlayerStatus({ id: idx });

        result[idx] = { ...result[idx], ...voteStatus, ...playerStatus };
      });

      return result;
    },
  },
  Mutation: {
    updatePlayerPass: async (root, args, context) => {
      const { session } = context;
      if (session.isValid) {
          return {isValid:true, id:session.playerId};
      }
     

      const { id, pass } = args;
      const result = await WolfModel.updatePlayerPass({ id, pass , session});

      return { ...result, id };
    },
  },
};

const authServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const session = req.session;

    return { session };
  },
});
module.exports = authServer;
