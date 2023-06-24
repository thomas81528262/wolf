

import { Maybe, Player, PlayerAudienceView, ResolverTypeWrapper, Resolvers } from './__generated__/resolvers-types';
import { readFileSync } from 'fs';
import { GraphQLError } from 'graphql';
import WolfModel from "../../model";
import {store} from "../../store";
import path from 'path';

const typeDefs = readFileSync(path.resolve(__dirname, "./schema.graphql"), { encoding: 'utf-8' });
const resolvers:Resolvers = {
    Query: {
      login: (root, args, context) => {
        const { playerId, isValid } = context.session;
  
        return { id: playerId, isValid };
      },
      gameInfo: async (root, args, context) => {
        if (context.session.playerId === undefined) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { id } = args;
        const {
          isEventFinish,
          repeatTimes,
          isBusy: isEventBusy,
          isDark: isEventDark,
        } = await WolfModel.getIsEventInfo();
        const {
          chiefVoteState,
          isChiefCandidateConfirmed,
          isVoteFinish,
          chiefId,
        } = await WolfModel.getPlayerStatus({
          id,
        });
        const {gameEnded} = await WolfModel.getIsGameEnded();
        const { isDark, voteWeightedId, hasChief, hasVoteTarget, uuid } =
          WolfModel;
        return {
          isVoteFinish: isVoteFinish || !isEventBusy,
          chiefId,
          isDark: isEventDark,
          voteWeightedId,
          hasChief,
          chiefVoteState,
          hasVoteTarget,
          uuid,
          isChiefCandidateConfirmed,
          repeatTimes,
          isEventBusy,
          gameEnded,
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
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
  
        const { playerId } = context.session;
  
        const {
          isEventFinish,
          name: eventName,
          isBusy,
          repeatTimes,
        } = await WolfModel.getIsEventInfo();
        const { players: playersData } = await WolfModel.getPlayerList();
  
        const voteHistory = await WolfModel.getVoteHistory();
  
        //const isChiefCandidateConfirmed = WolfModel.isChiefCandidateConfirmed();
  
        const result: Player[] = [];
  
        // const chiefVoteHistory = await
  
        let isChiefCandidateConfirmed = true;
        let hasChief = false;
  
        playersData.forEach((player) => {
          if (player.isChief) {
            hasChief = true;
          }
  
          if (player.id === 0) {
            return;
          }
  
          const { isChiefCandidate } = player;
          if (isChiefCandidate === null) {
            isChiefCandidateConfirmed = false;
          }
        });
  
        playersData.forEach((player) => {
          let roleName = "";
          let pass = "";
          const chiefVote:(string | null)[] = [];
  
          voteHistory.forEach((d) => {
            if (d.id === player.id && d.name === "CHIEF_VOTE") {
              chiefVote.push(d.target);
            }
          });
  
          const vote:(string | null)[] = [];
  
          voteHistory.forEach((d) => {
            if (d.id === player.id && d.name === "EXILE_VOTE") {
              vote.push(d.target);
            }
          });
  
          let chiefVoteState = { isCandidate: null, isDropout: null };
          const { isChiefCandidate, isChiefDropout } = player;
  
          let isValidCandidate =
            (player.voteTarget === "T" && !hasChief && repeatTimes > 0) ||
            (isChiefCandidate && !isChiefDropout && repeatTimes === 0 && !hasChief) || (
              player.isDie === false && hasChief
            );
  
            if (player.id === 0) {
              isValidCandidate = false;
            }
  
          if (playerId === 0) {
            roleName = player.roleName;
            pass = player.pass;
            
          }
  
          if (playerId === 0 || isChiefCandidateConfirmed) {
            chiefVoteState = {
              isCandidate: isChiefCandidate,
              isDropout: isChiefDropout,
            };
          }
  
          const isVoteFinish =
            !isBusy || player.voteTarget !== null || player.id === 0;
  
          result.push({
            ...player,
            isVoteFinish,
            chiefVoteState,
            isValidCandidate,
            chiefVote,
            vote,
          });
        });
  
        return result;
      },
      playersAudienceView: async (root, args) => {
        const { players: playersData } = await WolfModel.getPlayerList();
  
        const voteHistory = await WolfModel.getVoteHistory();
  
        const result:PlayerAudienceView[] = [];
  
        playersData.forEach((player) => {
          const chiefVote:(null|string)[] = [];
  
          voteHistory.forEach((d) => {
            if (d.id === player.id && d.name === "CHIEF_VOTE") {
              chiefVote.push(d.target);
            }
          });
  
          const vote:(null|string)[] = [];
  
          voteHistory.forEach((d) => {
            if (d.id === player.id && d.name === "EXILE_VOTE") {
              vote.push(d.target);
            }
          });
          result.push({
            ...player,
            chiefVote,
            vote,
          });
        });
  
        return result;
      },
      roles: async () => {
        const result = await WolfModel.getAllRole();
        return result;
      },
      player: async (root, args, context) => {
        if (context.session.playerId === undefined) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
  
        const { playerId } = context.session;
        const result = await WolfModel.getPlayerIdInfo({ id: playerId });
        return result;
      },
    },
    Mutation: {
      resetEvent: async (root, args, context) => {
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
  
        await WolfModel.resetEvent();
        return "pass";
      },
  
      updatePass: async (root, args, context) => {
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
  
        const { id, pass } = args;
  
        if (id === 0 && !context.session.isAdmin) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
  
        await WolfModel.updatePass({ id, pass });
  
        return "pass";
      },
      resetChiefCaniddate: async (root, args, context) => {
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
  
        const { id } = args;
  
        await WolfModel.resetChiefCandidate({ id });
        return "pss"
      },
  
      setIsVoter: (root, args, context) => {
        if (context.session.playerId === undefined) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { playerId } = context.session;
        WolfModel.updateChiefVoterCandidate({ id: playerId });
        return "pass"
      },
  
      setIsChiefCandidate: async (_root, _args, context) => {
        if (context.session.playerId === undefined) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { playerId } = context.session;
        await WolfModel.updateChiefCandidate({ id: playerId });
        return "pass"
      },
      setIsChiefDropOut: (root, args, context) => {
        if (context.session.playerId === undefined) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { playerId } = context.session;
        WolfModel.updateChiefCandidateDropOut({ id: playerId });
        return "pass"
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
        await WolfModel.startVote();
        return "pass";
      },
  
      voteChiefStart: async (root, args, context) => {
        await WolfModel.startVoteChief();
        return "pass";
      },
      submitVote: (root, args, context) => {
        if (context.session.playerId === undefined) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { playerId } = context.session;
        const { target } = args;
        WolfModel.submitVote({ id: playerId, target });
        return "pass";
      },
  
      enableTemplate: async (root, args, context) => {
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { name } = args;
  
        await WolfModel.enableTemplate({ name });
        return "pass";
      },
      setGameEnded: async (root, args, context) => {
        console.log("ready to set game ended.")
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
  
        await WolfModel.setGameEnded();
        console.log("set game ended.")
        return "pass";
      },
      updateTemplateRolePriority: async (root, args, context) => {
        if (!context.session.isAdmin) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { ids, name } = args;
  
        await WolfModel.updateTemplateRolePriority({ name, ids });
        return "pass";
      },
  
      updateTemplateRole: async (root, args, context) => {
        if (!context.session.isAdmin) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { name, roleId, number } = args;
  
        await WolfModel.updateTemplateRole({ name, roleId, number });
        return "pass";
      },
      addNewTemplate: async (root, args, context) => {
        if (!context.session.isAdmin) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { name } = args;
  
        await WolfModel.addNewTemplate({ name });
        return "pass";
      },
      deleteTemplate: async (root, args, context) => {
        if (!context.session.isAdmin) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { name } = args;
  
        await WolfModel.deleteTemplate({ name });
        return "pass";
      },
  
      updateTemplateDescription: async (root, args, context) => {
        if (!context.session.isAdmin) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
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
        const { id, pass, } = args;
        const { session } = context;
        const result = await WolfModel.updatePlayerPass({ id, pass, session });
  
        return { ...result };
      },
      updatePlayerName: async (root, args, context) => {
        const { id, name } = args;
        if (context.session.playerId !== id) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
  
        await WolfModel.updatePlayerName({ id, name });
        return "pass";
      },
      generateTemplatePlayer: async (root, args, context) => {
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        await WolfModel.generateTemplatePlayer();
        return "pass";
      },
      generateTemplateRole: async (root, args, context) => {
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const { isCovertWolfToHuman } = args;
        await WolfModel.generateTemplateRole({ isCovertWolfToHuman });
        return "pass";
      },
      generatePlayer: async (root, args, context) => {
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        await WolfModel.generatePlayer();
        return "pass";
      },
      generateRole: async (root, args, context) => {
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        await WolfModel.generateRole();
        return "pass";
      },
      removeAllPlayer: async (root, args, context) => {
        if (context.session.playerId !== 0) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        await WolfModel.removeAllPlayer({ store });
        return "pass";
      },
    },
  };



  export default {resolvers, typeDefs}