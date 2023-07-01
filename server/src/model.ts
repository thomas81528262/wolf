import Db, { TemplateRole } from "./db";
import shuffle  from "shuffle-array";
import { withTimeout, Mutex } from "async-mutex";
import { v1 as uuidv1 } from "uuid";
import session from 'express-session';

const mutexWithTimeout = withTimeout(new Mutex(), 1000, new Error("timeout"));


export interface Session extends session.Session {
  isAdmin:boolean;
  playerId:number;
  isValid: boolean;
}

interface Player {
    isJoin:boolean | null;
    isTarget:boolean | null;
    isDie:boolean | null;
    votedNumber:number | null ;
    isChiefCandidate:boolean | null;
    isChiefDropout:boolean | null;
    voteTarget:number | null;
    chiefVoteState: { isCandidate: boolean|null; isDropedOut: boolean|null; type: string|null };
}

const getIniPlayer = ()=>({isJoin: null,
  isTarget:null,
  isDie:null,
  votedNumber:null ,
  isChiefCandidate:null,
  isChiefDropout:null,
  voteTarget:null,chiefVoteState:{isCandidate:null, isDropedOut:null, type:null}});

export default class WolfModel {
  static voteList = [];
  static voteHistory:number[][] = [];
  static chiefVoteHistory = [];
  static isValidCandidate = new Set();
  static player:Player[] = [];
  static isVoteFinish = true;
  static chiefId = -1;
  static voteWeightedId = -1;
  static isDark = false;
  static uuid = uuidv1();

  static get canStartVote() {
    return (
      this.player.length > 1 &&
      this.player.filter((p) => !p.isJoin).length === 0
    );
  }

  static async reset() {

    await Db.resetGame();
    /*
    this.isVoteFinish = true;
    this.chiefId = -1;
    this.voteList = [];
    this.voteHistory = [];
    this.chiefVoteHistory = [];
    this.isDark = false;
    this.voteWeightedId = -1;
    for (let id = 1; id < this.player.length; id += 1) {
      this.player[id].isDie = false;
    }
    */
  }

  static get hasChief() {
    return this.chiefId !== -1;
  }

  static async setPlayerDieStatus({ id }:{id:number}) {
    await Db.updateIsDie({id});
  }
  static async setDarkDieStatus(targets:number[]) {
    await Db.setDarkDieStatus({targets});
  }

  static async setChiefId({ id }:{id:number}) {
    await Db.updateIsChief({id});
  }

  static setVoteWeightedId({ id }:{id:number}) {
    if (this.voteWeightedId === id) {
      this.voteWeightedId = -1;
    } else {
      this.voteWeightedId = id;
    }
  }

  static async startVote() {
    await Db.startExileVote();
  }

  static async startVoteChief() {
    await Db.startChiefVote()
  }

  static get hasVoteTarget() {
    let hasTarget = false;

    this.player.forEach((p) => {
      if (p.isTarget) {
        hasTarget = true;
      }
    });
    return hasTarget;
  }

  static getVotedNumber({ id }:{id:number}) {
    let votedNumber = 0;

    const voteList =
      this.chiefId === -1 ? this.chiefVoteHistory : this.voteHistory;

    if (voteList.length > 0) {
      const lastIdx = voteList.length - 1;
      voteList[lastIdx].forEach((tId, idx) => {
        if (tId === id) {
          votedNumber += 1;

          if (idx === this.chiefId) {
            votedNumber += 0.5;
          }
        }
      });
    }

    if (id === this.voteWeightedId) {
      votedNumber += 1;
    }

    return votedNumber;
  }

  static getVoteStatus({ id }:{id:number}) {
    const isValidCandidate = this.isValidCandidate.has(id);
    const vote:number[] = [];
    const chiefVote:number[] = [];
    let isVoteFinish = true;

    if (id) {
      this.voteHistory.forEach((list) => {
        const target = list[id];
        vote.push(target);
      });

      this.chiefVoteHistory.forEach((list) => {
        const target = list[id];
        chiefVote.push(target);
      });

      isVoteFinish = this.voteList[id] !== 0 || this.isVoteFinish;
    }

    const votedNumber = this.player[id] ? this.player[id].votedNumber : 0;

    return {
      isValidCandidate,
      vote,
      isVoteFinish,
      votedNumber,
      chiefVote,
    };
  }

  static isChiefCandidateConfirmed() {
    let isConfirmed = true;

    this.player.forEach((p, idx) => {
      if (!isConfirmed || !idx) {
        return;
      }

      if (!p.chiefVoteState) {
        isConfirmed = false;
        return;
      }

      if (!p.chiefVoteState.type) {
        isConfirmed = false;
        return;
      }
    });

    return isConfirmed;
  }

  static async getPlayerStatus({ id}:{id:number}) {
    const { players: playersData } = await WolfModel.getPlayerList();
    let player:Player = getIniPlayer();

    let isChiefCandidateConfirmed = true;
    let chiefId = - 1;
    playersData.forEach((d) => {
      if (d.id === id) {
        player = { ...d };

       

      }

      if (d.isChief) {
        chiefId = d.id;
      }

      const { isChiefCandidate } = d;
      if (isChiefCandidate === null && d.id !== 0 && !d.isDie) {
        isChiefCandidateConfirmed = false;
      }
    });

    let chiefVoteState:{isCandidate: null|boolean, isDropout: null|boolean} = { isCandidate: null, isDropout: null };
    const { isChiefCandidate, isChiefDropout } = player;
    
      chiefVoteState = {
        isCandidate: isChiefCandidate,
        isDropout: isChiefDropout,
      };
    

    const isVoteFinish =  player.voteTarget !== null;

    return { ...player, chiefVoteState , isChiefCandidateConfirmed,isVoteFinish, chiefId};

  }


  static async resetEvent() {
    await Db.resetEvent();
  }

  static async getIsEventInfo() {

    let isEventFinish = false;
    let isBusy = false;
    let name = null;
    let isDark = false;
    let repeatTimes = 0;
    const voteEvent = await Db.getVoteEvent();
    
    if (voteEvent.length > 0) {



      if (voteEvent[0].name === null) {
        isEventFinish = true;
        isDark = voteEvent[0].isDark;
      } else {
        repeatTimes = voteEvent[0].repeatTimes;
        isBusy = voteEvent[0].isBusy;
        name = voteEvent[0].name;
        isDark = voteEvent[0].isDark;
        repeatTimes = voteEvent[0].repeatTimes;
      }
    }
   

    return {isEventFinish , repeatTimes,   isBusy, name, isDark};
  }

  static async getIsGameEnded() {
    const gameEndedEvent = await Db.getGameEndedEvent();
    const gameEnded = gameEndedEvent !== null && gameEndedEvent.length > 0;
    return {gameEnded};
  }

  static async setGameEnded() {
    await Db.setGameEndedEvent();
  }

  static async getVoteHistory() {
    const result = await Db.getVoteHistory();
    return result;
  }


  static getVoteResult({ id }:{id:number}) {
    const result:number[] = [];

    if (!id) {
      return result;
    }

    this.voteHistory.forEach((list) => {
      const target = list[id];
      result.push(target);
    });

    return result;
  }

  static async submitVote({ id, target }:{id:number, target:number}) {
    await Db.endVoteEvent({target, id})
  }

  static async enableTemplate({ name }:{name:string}) {
    await Db.enableTemplate({ name });
  }

  static async getTemplate({ name }:{name:string}) {
    const roles = await Db.getAllTemplateRole({ name });
    const description = await Db.getTemplateDescription({ name });
    return { roles, description, name };
  }

  static async getEnabledTemplate() {
    const template = await Db.getEnabledTemplate();
    const { name } = template;
    let roles = null;
    if (name) {
      roles = await Db.getAllTemplateRole({ name });
    }

    return { ...template, roles };
  }

  static async getAllTemplate() {
    const templates = await Db.getAllTemplate();
    const result = [];

    for (let i = 0; i < templates.length; i += 1) {
      const { name, description, isEnabled } = templates[i];
      const roles = await Db.getAllTemplateRole({ name });

      result.push({ name, description, roles, isEnabled });
    }

    return result;
  }

  static async addNewTemplate({ name }:{name:string}) {
    await Db.insertTemplateHeader({ name });
  }

  static async deleteTemplate({ name }:{name:string}) {
    await Db.deleteTemplateHeader({ name });
  }

  static async updateTemplateRolePriority({ name, ids }:{name:string, ids:number[]}) {
    await Db.updateTemplateRolePriority({ name, ids });
  }

  static async updateTemplateRole({ name, roleId, number }:{name:string, roleId:number, number:number}) {
    await Db.upsertTemplateRole({ name, roleId, number });
  }

  static async updateTemplateDescription({ name, description }:{ name:string, description:string }) {
    await Db.updateTemplateDescription({ name, description });
  }

  static async updateRoleNumber({ id, number }:{id:number, number:number}) {
    await Db.updateRoleNumber({ id, number });
  }

  static async updatePlayerName({ id, name }:{id:number, name:string}) {
    await Db.updatePlayerName({ id, name });
    return "pass";
  }

  static async getPlayerIdInfo({ id }:{id:number}) {
    const result = await Db.getPlayerIdInfo({ id });
    if (result.length === 1) {
      return result[0];
    }
    return {};
  }

  static async getPlayerInfo({ id, pass }:{id:number, pass:string}) {
    const result = await Db.getPlayerInfo({ id, pass });
    if (result.length === 1) {
      return result[0];
    }
    return {};
  }

  static async updatePass({ id, pass }:{id:number, pass:string}) {
    await Db.updatePass({ id, pass });
  }

  static async updatePlayerPass({ id, pass, session }:{id:number, pass:string, session:Session}) {
    const info = await this.getPlayerInfo({ id, pass });

    //if db already have the data, set the session
    if (info.id !== null && info.id !== undefined) {
      if (info.adminPass === pass && info.id === 0) {
        session.isAdmin = true;
      }
      session.playerId = id;
      session.isValid = true;
      return { isValid: true, ...info };
    }

    const result = await Db.updatePlayerPass({ id, pass });

    
    if (result.isValid) {
      session.playerId = id;
      session.isValid = true;
      //this.player[id].isJoin = true;
    }

    return result;
  }

  static async resetChiefCandidate({ id }:{id:number}) {
    await Db.updateChiefCandidate({ isCandidate: null, isDropout: false, id });
  }

  static async updateChiefCandidate({ id }:{id:number}) {
    await Db.updateIsChiefCandidate({ isCandidate: true, id });
  }

  static async updateChiefVoterCandidate({ id }:{id:number}) {
    await Db.updateIsChiefCandidate({ isCandidate: false, id });
  }

  static async updateChiefCandidateDropOut({ id }:{id:number}) {
    await Db.updateIsChiefCandidateDropout({ id, isDropout: true });
  }

  static async createPlayer({ totalNumber }:{ totalNumber:number }) {
    await Db.removeAllPlayer();

    //0 is GOD dont touch

    this.player = [{...getIniPlayer(), isJoin: true, isDie: false }];
    for (let i = 0; i < totalNumber; i += 1) {
      await Db.addPlayer({ id: i + 1 });
      this.player.push({...getIniPlayer(),
        isTarget: false,
        isJoin: false,
        isDie: false,
        votedNumber: 0,
        chiefVoteState: { isCandidate: false, isDropedOut: false, type: null },
      });
    }
  }
  static async removeAllPlayer({ store }:{store:any}) {
    await Db.removeAllPlayer();
    store.all((_:any, sessions:any) => {
      Object.keys(sessions).forEach((k, v) => {
        if (sessions[k].playerId) {
          store.destroy(k);
        }
      });
    });

    await this.reset();
  }

  static async generateRole() {
    const result = await Db.getAllRole();

    const list:number[] = [];
    result.forEach((d) => {
      const { number, id } = d;
      if (number) {
        for (let i = 0; i < number; i += 1) {
          list.push(id);
        }
      }
    });

    shuffle(list);

    list.forEach((value, idx) => {
      Db.updatePlayerRole({ id: idx + 1, roleId: value });
    });
  }

  static async generateTemplateRole({ isCovertWolfToHuman }:{isCovertWolfToHuman:boolean}) {
    if (mutexWithTimeout.isLocked()) {
      return;
    }

    await mutexWithTimeout.acquire();
    try {
      const template = await Db.getEnabledTemplate();
      const { name } = template;
      const roles = await Db.getAllTemplateRole({ name });

      const list:{id:number, functionName:string, camp:string, index:number}[] = [];
      let lIdx = 0;
      roles.forEach((d, index) => {
        const { number, id, functionName, camp } = d;

        if (number) {
          for (let i = 0; i < number; i += 1) {
            list.push({ id, functionName, camp, index: lIdx });
            lIdx += 1;
          }
        }
      });

      //22 is Thieves, 2 is Villagers
      const thieve = list.find((v) => v.id === 22);
      if (thieve) {
        const villager = list.find((v) => v.id === 2);

        const len = list.length;
        if (villager) {
          list.push({ ...villager, index: len }, { ...villager, index: len + 1 });
        }
        

        shuffle(list);
      } else {
        shuffle(list);
      }

      //Game.dark.reset();
      await this.reset();
      const waitRoleList:any = [];

      list.slice(0, lIdx).forEach((value, idx) => {
        let roleId = value.id;

        if (isCovertWolfToHuman && roleId === 1) {
          roleId = 2;
        }

        waitRoleList.push(Db.updatePlayerRole({ id: idx + 1, roleId }));
      });

      await Promise.all(waitRoleList);
      this.uuid = uuidv1();
    } finally {
      mutexWithTimeout.release();
    }
  }

  static async generateTemplatePlayer() {
    //const result = await Db.getAllRole();
    const template = await Db.getEnabledTemplate();
    const { name } = template;
    const result = await Db.getAllTemplateRole({ name });
    let totalNumber = 0;
    result.forEach((d) => {
      const { number } = d;
      if (number) {
        totalNumber += number;
      }
    });

    this.createPlayer({ totalNumber });

    return "pass";
  }

  static async generatePlayer() {
    const result = await Db.getAllRole();

    let totalNumber = 0;
    result.forEach((d) => {
      const { number } = d;
      if (number) {
        totalNumber += number;
      }
    });

    this.createPlayer({ totalNumber });

    return "pass";
  }

  static async getPlayerList() {
    const players = await Db.getAllPlayer();

    let isChiefCandidateConfirmed = true;

    players.forEach((player) => {
      const { isChiefCandidate } = player;
      if (isChiefCandidate === null) {
        isChiefCandidateConfirmed = false;
      }
    });

    return { players, isChiefCandidateConfirmed };
  }

  static async getAllRole() {
    const result = await Db.getAllRole();
    return result;
  }
}


