import express from "express";
import { ApolloServer,  } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import session from "express-session";
import { json } from 'body-parser';
const MemoryStore = require("memorystore")(session);


import http from 'http';
import GraphqlGame from "./graphql/game";
import GraphqlAuth from "./graphql/auth";

interface MyContext {
  req?: any;
}


const app = express();



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



const httpServer = http.createServer(app);
const gameServer = new ApolloServer<MyContext>({
  typeDefs:GraphqlGame.typeDefs,
  resolvers:GraphqlGame.resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const authServer = new ApolloServer<MyContext>({
  typeDefs:GraphqlAuth.typeDefs,
  resolvers:GraphqlAuth.resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const run = async ()=>{
  const port = process.env.PORT || 4000;
  await gameServer.start();
  await authServer.start();
  app.use(
    '/graphql',json(),
    expressMiddleware(gameServer, {
      context: async ({ req }) => ({ session: req.session }),
    }),
  );

  app.use(
    '/auth',json(),
    expressMiddleware(authServer, {
      context: async ({ req }) => ({ session: req.session }),
    }),
  );
  
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
}

run();


