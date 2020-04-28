var express = require('express');
var app = express();
const { ApolloServer, gql } = require('apollo-server-express');
const WolfModel = require("./model")
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Player {
    name: String
    id: Int
    roleName: String
  }

  type Role {
    name: String
    id: Int,
    number: Int

  }

  type PlayerStatus {
    isValid: Boolean
    name: String
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    players:[Player]
    roles:[Role]
    player(id:Int, pass:String): Player
  }
  type Mutation {
    updateRoleNumber(id:Int, number:Int): String
    updatePlayerPass(id:Int, pass:String): PlayerStatus
    updatePlayerName(id:Int, name:String): String
    generatePlayer:String
    generateRole:String
    removeAllPlayer: String


  }
`;



const resolvers = {
  Query: {
    books: () => books,
    players: async ()=>{
      const result = await WolfModel.getPlayerList();
      
      return result;
    },
    roles: async()=>{
      const result = await WolfModel.getAllRole();
      return result;
    }, 
    player: async(root, args, context)=>{
      const {id, pass} = args;
      const result = await WolfModel.getPlayerInfo({id, pass});
      return result;
    }
  },
  Mutation: {
    updateRoleNumber: async(root, args, context)=>{
      const {id, number} = args;
      
      await WolfModel.updateRoleNumber({id, number})
      return "pass"
    },
    updatePlayerPass: async(root, args, context) =>{
      const {id, pass} = args;
      const result = await WolfModel.updatePlayerPass({id, pass});
      
      return {...result};
    },
    updatePlayerName: async(root, args, context) =>{
      const {id, name} = args;
      await WolfModel.updatePlayerName({id, name});
      return "pass";
    },
    
    generatePlayer: async(root, args, context)=>{
      await WolfModel.generatePlayer();
      return "pass"
    },
    generateRole: async (root, args, context)=>{
      await WolfModel.generateRole();
      return "pass"
    },
    removeAllPlayer: async(root, args, context) =>{
      await WolfModel.removeAllPlayer();
      return "pass"
    }

  }
};

/*
app.get('/', function (req, res) {
  res.send('Hello World!');
});
*/

const webPath = "/web";
app.use(express.static(`${process.cwd()}${webPath}`));
app.get("*", (request, response) => {
  response.sendFile(`${process.cwd()}${webPath}/index.html`);
});

/*
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
*/

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

// The `listen` method launches a web server.
var port = process.env.PORT || 4000
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
