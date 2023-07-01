import { Resolvers } from './__generated__/resolvers-types';
import WolfModel from "../../model";
import { readFileSync } from 'fs';
import path from 'path';



const typeDefs = readFileSync(path.resolve(__dirname, "./schema.graphql"), { encoding: 'utf-8' });

const resolvers:Resolvers = {
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

export default {typeDefs, resolvers};
