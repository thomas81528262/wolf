var express = require("express");
var app = express();
const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require("apollo-server-express");
const WolfModel = require("./model");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const authServer = require("./auth");
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Player {
    pass: String
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
    chiefVoteState: ChiefVoteState
    isTarget: Boolean
    isChief:Boolean
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

  type ChiefVoteState {
    isCandidate: Boolean
    isDropout: Boolean
    type: String
  }

  type GameInfo {
    isVoteFinish: Boolean
    chiefId: Int
    isDark: Boolean
    voteWeightedId: Int
    hasChief: Boolean
    chiefVoteState: ChiefVoteState
    hasVoteTarget: Boolean
    isChiefCandidateConfirmed:Boolean
    uuid: String
    repeatTimes:Int
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
    gameInfo(id: Int): GameInfo
    login: PlayerStatus
  }
  type Mutation {
    updatePass(id: Int, pass: String): String
    updateRoleNumber(id: Int, number: Int): String
    updatePlayerPass(id: Int, pass: String): PlayerStatus
    updatePlayerName(id: Int, name: String): String
    generatePlayer: String
    generateRole: String
    removeAllPlayer: String
    addNewTemplate(name: String): String
    deleteTemplate(name: String): String
    generateTemplatePlayer: String
    generateTemplateRole(isCovertWolfToHuman: Boolean): String
    updateTemplateDescription(name: String, description: String): String
    updateTemplateRole(name: String, roleId: Int, number: Int): String
    updateTemplateRolePriority(ids: [Int], name: String): String
    enableTemplate(name: String): String
    voteStart(targets: [Int]): String
    voteChiefStart: String
    submitVote(target: Int): String
    setDieStatus(id: Int): String
    setDarkDieStatus(targets: [Int]): String
    setChiefId(id: Int): String
    setVoteWeightedId(id: Int): String
    setIsVoter: String
    setIsChiefCandidate: String
    setIsChiefDropOut: String
    resetChiefCaniddate(id: Int): String
    logoff: String
  }
`;

const resolvers = {
  Query: {
    login: (root, args, context) => {
      const { playerId, isValid } = context.session;

      return { id: playerId, isValid };
    },
    gameInfo: async (root, args, context) => {
      if (context.session.playerId === undefined) {
        throw new AuthenticationError("No Access!");
      }
      const { id } = args;
      const {isEventFinish, repeatTimes} = await WolfModel.getIsEventFinish({ id });
      const { chiefVoteState , isChiefCandidateConfirmed, isVoteFinish, chiefId} = await WolfModel.getPlayerStatus({
        id
      });
      const {  isDark, voteWeightedId, hasChief, hasVoteTarget, uuid } =
        WolfModel;
      return {
        isVoteFinish: isEventFinish || isVoteFinish,
        chiefId,
        isDark,
        voteWeightedId,
        hasChief,
        chiefVoteState,
        hasVoteTarget,
        uuid,
        isChiefCandidateConfirmed,
        repeatTimes
      };
    },

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
    players: async (root, args, context) => {
      if (context.session.playerId === undefined) {
        throw new AuthenticationError("No Access!");
      }

      const { playerId } = context.session;

      const {isEventFinish} = await WolfModel.getIsEventFinish();
      const {players:  playersData}= await WolfModel.getPlayerList();
      
      const chiefVoteHistory = await WolfModel.getChiefHistory();

      

      //const isChiefCandidateConfirmed = WolfModel.isChiefCandidateConfirmed();

      const result = [];

     // const chiefVoteHistory = await 

      let isChiefCandidateConfirmed = true;


      playersData.forEach(player=>{

        if (player.id  === 0) {
          return;
        }

        const { isChiefCandidate } = player;
        if (isChiefCandidate  === null) {
          isChiefCandidateConfirmed = false;
        }
      })



      playersData.forEach((player) => {
        let roleName = "";
        let pass = "";
        const chiefVote = [];

        chiefVoteHistory.forEach(d=>{
          if (d.id === player.id) {
            chiefVote.push(d.target);
          }
        })

        //const tmp = WolfModel.getVoteStatus({ id: idx });

       


        /*
        const playerStatus = WolfModel.getPlayerStatus({
          id: idx,
          isChiefCandidateConfirmed,
          playerId: context.session.playerId,
        });
        */
        //
        /*
         */
        /*
        player.ischiefcandidate as "isChiefCandidate", 
        player.ischiefdropout as "isChiefDropout",
        player.isdie as "isDie"
        */
        let isValidCandidate = false;
        let chiefVoteState = { isCandidate: null, isDropout: null };
        const { isChiefCandidate, isChiefDropout } = player;
        if (playerId === 0) {
          roleName = player.roleName;
          pass = player.pass;
          
        }

        if (playerId === 0 || isChiefCandidateConfirmed) {
          chiefVoteState = {
            isCandidate: isChiefCandidate,
            isDropout: isChiefDropout,
          };

          isValidCandidate = isChiefCandidate === true && isChiefDropout === false;

        }

        const isVoteFinish = isEventFinish || player.voteTarget !== null || player.id === 0;

        result.push({ ...player,isVoteFinish ,chiefVoteState,isValidCandidate, chiefVote, vote:[]});
       
      });

      return result;
    },
    roles: async () => {
      const result = await WolfModel.getAllRole();
      return result;
    },
    player: async (root, args, context) => {
      if (context.session.playerId === undefined) {
        throw new AuthenticationError("No Access!");
      }

      const { playerId } = context.session;
      const result = await WolfModel.getPlayerIdInfo({ id: playerId });
      return result;
    },
  },
  Mutation: {
    updatePass: async (root, args, context) => {
      if (context.session.playerId !== 0) {
        throw new AuthenticationError("No Access!");
      }

      const { id, pass } = args;

      if (id === 0 && !context.session.isAdmin) {
        throw new AuthenticationError("No Access!");
      }

      await WolfModel.updatePass({ id, pass });

      return "pass";
    },
    resetChiefCaniddate: async (root, args, context) => {
      if (context.session.playerId !== 0) {
        throw new AuthenticationError("No Access!");
      }
      

      const { id } = args;

      await WolfModel.resetChiefCandidate({id})
    },

    setIsVoter: (root, args, context) => {
      if (context.session.playerId === undefined) {
        throw new AuthenticationError("No Access!");
      }
      const { playerId } = context.session;
      WolfModel.updateChiefVoterCandidate({ id: playerId, isLockSet: true });
    },

    setIsChiefCandidate: async (_root, _args, context) => {
      if (context.session.playerId === undefined) {
        throw new AuthenticationError("No Access!");
      }
      const { playerId } = context.session;
      await WolfModel.updateChiefCandidate({ id: playerId, isLockSet: true });
    },
    setIsChiefDropOut: (root, args, context) => {
      if (context.session.playerId === undefined) {
        throw new AuthenticationError("No Access!");
      }
      const { playerId } = context.session;
      WolfModel.updateChiefCandidateDropOut({ id: playerId, isLockSet: true });
    },

    logoff: (root, args, context) => {
      context.session.destroy();
      return "pass";
    },
    setVoteWeightedId: (root, args, context) => {
      const { id } = args;
      WolfModel.setVoteWeightedId({ id });
      return "pass";
    },
    setChiefId: (root, args, context) => {
      const { id } = args;
      WolfModel.setChiefId({ id });
      return "pass";
    },
    setDarkDieStatus: (root, args, context) => {
      const { targets } = args;
      WolfModel.setDarkDieStatus(targets);
      return "pass";
    },

    setDieStatus: (root, args, context) => {
      const { id } = args;
      WolfModel.setPlayerDieStatus({ id });
      return "pass";
    },

    voteStart: async (root, args, context) => {
      const { targets } = args;
      await WolfModel.startVote(targets);
      return "pass";
    },

    voteChiefStart: async (root, args, context) => {
      await WolfModel.startVoteChief();
      return "pass";
    },
    submitVote: (root, args, context) => {
      if (context.session.playerId === undefined) {
        throw new AuthenticationError("No Access!");
      }
      const { playerId } = context.session;
      const { target } = args;
      WolfModel.submitVote({ id: playerId, target });
      return "pass";
    },

    enableTemplate: async (root, args, context) => {
      if (context.session.playerId !== 0) {
        throw new AuthenticationError("No Access!");
      }
      const { name } = args;

      await WolfModel.enableTemplate({ name });
      return "pass";
    },
    updateTemplateRolePriority: async (root, args, context) => {
      if (!context.session.isAdmin) {
        throw new AuthenticationError("No Access!");
      }
      const { ids, name } = args;

      await WolfModel.updateTemplateRolePriority({ name, ids });
      return "pass";
    },

    updateTemplateRole: async (root, args, context) => {
      if (!context.session.isAdmin) {
        throw new AuthenticationError("No Access!");
      }
      const { name, roleId, number } = args;

      await WolfModel.updateTemplateRole({ name, roleId, number });
      return "pass";
    },
    addNewTemplate: async (root, args, context) => {
      if (!context.session.isAdmin) {
        throw new AuthenticationError("No Access!");
      }
      const { name, description } = args;

      await WolfModel.addNewTemplate({ name });
      return "pass";
    },
    deleteTemplate: async (root, args, context) => {
      if (!context.session.isAdmin) {
        throw new AuthenticationError("No Access!");
      }
      const { name, description } = args;

      await WolfModel.deleteTemplate({ name });
      return "pass";
    },

    updateTemplateDescription: async (root, args, context) => {
      if (!context.session.isAdmin) {
        throw new AuthenticationError("No Access!");
      }
      const { name, description } = args;

      await WolfModel.updateTemplateDescription({ name, description });
      return "pass";
    },
    updateRoleNumber: async (root, args, context) => {
      /*
      if (!context.session.isAdmin) {
        throw new AuthenticationError("No Access!");
      }
      const { id, number } = args;

      await WolfModel.updateRoleNumber({ id, number });
      */
      return "pass";
    },
    updatePlayerPass: async (root, args, context) => {
      const { id, pass } = args;
      const result = await WolfModel.updatePlayerPass({ id, pass });

      return { ...result };
    },
    updatePlayerName: async (root, args, context) => {
      const { id, name } = args;
      if (context.session.playerId !== id) {
        throw new AuthenticationError("No Access!");
      }

      await WolfModel.updatePlayerName({ id, name });
      return "pass";
    },
    generateTemplatePlayer: async (root, args, context) => {
      if (context.session.playerId !== 0) {
        throw new AuthenticationError("No Access!");
      }
      await WolfModel.generateTemplatePlayer();
      return "pass";
    },
    generateTemplateRole: async (root, args, context) => {
      if (context.session.playerId !== 0) {
        throw new AuthenticationError("No Access!");
      }
      const { isCovertWolfToHuman } = args;
      await WolfModel.generateTemplateRole({ isCovertWolfToHuman });
      return "pass";
    },
    generatePlayer: async (root, args, context) => {
      if (context.session.playerId !== 0) {
        throw new AuthenticationError("No Access!");
      }
      await WolfModel.generatePlayer();
      return "pass";
    },
    generateRole: async (root, args, context) => {
      if (context.session.playerId !== 0) {
        throw new AuthenticationError("No Access!");
      }
      await WolfModel.generateRole();
      return "pass";
    },
    removeAllPlayer: async (root, args, context) => {
      if (context.session.playerId !== 0) {
        throw new AuthenticationError("No Access!");
      }
      await WolfModel.removeAllPlayer({ store });
      return "pass";
    },
  },
};

const webPath = "/web";

const store = new MemoryStore({});

app.use(
  session({
    secret: "thomas secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
    store,
  })
);

app.use(express.static(`${process.cwd()}${webPath}`));

app.get("/*", (request, response) => {
  response.sendFile(`${process.cwd()}${webPath}/index.html`);
});

const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: ({ req }) => {
    return { session: req.session };
  },
});

server.applyMiddleware({ app });
authServer.applyMiddleware({ app, path: "/auth" });
// The `listen` method launches a web server.
var port = process.env.PORT || 4000;
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
