const Db = require("./db");
const shuffle = require("shuffle-array");
const { withTimeout, Mutex } = require("async-mutex");
const mutexWithTimeout = withTimeout(new Mutex(), 1000, new Error("timeout"));
const { v1: uuidv1 } = require("uuid");

class WolfModel {
  static voteList = [];
  static voteHistory = [];
  static chiefVoteHistory = [];
  static isValidCandidate = new Set();
  static player = [];
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

  static async setPlayerDieStatus({ id }) {

    await Db.updateIsDie({id});
    /*
    const p = this.player[id];
    if (p) {
      p.isDie = !p.isDie;

      if (p.isDie) {
        this.isDark = true;
      }
    }

    this.player.forEach((p) => {
      p.isTarget = false;
    });
    */
  }
  static async setDarkDieStatus(targets) {
    await Db.setDarkDieStatus({targets});
    /*
    targets.forEach((id) => {
      const p = this.player[id];
      p.isDie = true;
    });

    this.isDark = false;
    */
  }

  static async setChiefId({ id }) {

    await Db.updateIsChief({id});
    /*
    if (this.chiefId === id) {
      this.chiefId = -1;
    } else {
      this.chiefId = id;
    }

    this.player.forEach((p) => {
      p.isTarget = false;
    });
    */
  }

  static setVoteWeightedId({ id }) {
    if (this.voteWeightedId === id) {
      this.voteWeightedId = -1;
    } else {
      this.voteWeightedId = id;
    }
  }

  static async startVote(list) {

    await Db.startExileVote();
    /*
    if (!this.isVoteFinish || !this.canStartVote) {
      return;
    }

    this.isVoteFinish = false;
    this.isValidCandidate.clear();

    const result = await Db.getAllPlayer();
    for (let i = 0; i < result.length; i += 1) {
      const { id } = result[i];
      if (!id) {
        continue;
      }

      if (!this.player[id].isDie) {
        if (this.hasTarget) {
          if (p.isTarget) {
            this.voteList[id] = "T";
            this.isValidCandidate.add(id);
          } else {
            this.voteList[id] = 0;
          }
        } else {
          if (list.length === 0) {
            this.isValidCandidate.add(id);
            this.voteList[id] = 0;
          } else if (list.includes(id)) {
            this.voteList[id] = "T";
            this.isValidCandidate.add(id);
          } else {
            this.voteList[id] = 0;
          }
        }
      } else {
        this.isValidCandidate.delete(id);
        this.voteList[id] = "D";
      }
    }
    */
  }

  static async startVoteChief() {
    

    await Db.startChiefVote()

    /*
    this.isVoteFinish = false;
    this.isValidCandidate.clear();

    const result = await Db.getAllPlayer();
    for (let i = 0; i < result.length; i += 1) {
      const { id } = result[i];
      if (!id) {
        continue;
      }

      if (this.player[id].chiefVoteState.isCandidate) {
        if (this.player[id].chiefVoteState.isDropedOut) {
          this.voteList[id] = "DO";
        } else {
          this.isValidCandidate.add(id);
          this.voteList[id] = "T";
        }
      } else {
        this.voteList[id] = 0;
      }
    }
    */
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

  static getVotedNumber({ id }) {
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

  static getVoteStatus({ id }) {
    const isValidCandidate = this.isValidCandidate.has(id);
    const vote = [];
    const chiefVote = [];
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

  static async getPlayerStatus({ id}) {
    const { players: playersData } = await WolfModel.getPlayerList();
    let player = {};

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

    let chiefVoteState = { isCandidate: null, isDropout: null };
    const { isChiefCandidate, isChiefDropout } = player;
    //if (id === 0 || isChiefCandidateConfirmed) {
      chiefVoteState = {
        isCandidate: isChiefCandidate,
        isDropout: isChiefDropout,
      };
    //}

    const isVoteFinish =  player.voteTarget !== null;

    return { ...player, chiefVoteState , isChiefCandidateConfirmed,isVoteFinish, chiefId};

    /*
    const p = { ...this.player[id] };
    
    if (!p) {
      return {};
    }

    if (!p.chiefVoteState) {
      p.chiefVoteState = {};
    }

    p.chiefVoteState = { ...p.chiefVoteState };
    if (playerId !== 0 && !isChiefCandidateConfirmed) {
      p.chiefVoteState.type = null;
    }

    return p;
    */
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
   

    return {isEventFinish , repeatTimes,   isBusy, name, isDark, repeatTimes};
  }

  static async getVoteHistory() {
    const result = await Db.getVoteHistory();
    return result;
  }

  static getPlayerInfo({ id }) {
    const p = this.player[id];

    if (!p) {
      return {};
    }

    const { chiefVoteState } = p;

    return { chiefVoteState };
  }

  static getVoteResult({ id }) {
    const result = [];

    if (!id) {
      return result;
    }

    this.voteHistory.forEach((list) => {
      const target = list[id];
      result.push(target);
    });

    return result;
  }

  static async submitVote({ id, target }) {

    await Db.endVoteEvent({target, id})

    /*
    if (this.isVoteFinish) {
      return;
    }

    if (this.voteList[id] === 0) {
      this.voteList[id] = target === -1 ? "X" : target;
    }

    let isFinish = true;

    this.voteList.forEach((target, id) => {
      if (target === 0 && id !== 0) {
        isFinish = false;
      }
    });

    if (isFinish) {
      if (this.chiefId === -1) {
        this.chiefVoteHistory.push(this.voteList);
      } else {
        this.voteHistory.push(this.voteList);
      }

      this.voteList = [];
      this.isVoteFinish = true;

      this.player.forEach((p, id) => {
        p.votedNumber = this.getVotedNumber({ id });
      });

     
      let maxVote = -1;

      this.player.forEach((p, id) => {
        maxVote = Math.max(p.votedNumber, maxVote);
      });

      const pNum = this.player.filter((p) => p.votedNumber === maxVote).length;
      if (pNum === 1) {
        this.player.forEach((p, id) => {
          p.isTarget = false;
          if (p.votedNumber === maxVote) {
            if (this.hasChief) {
              p.isDie = true;
              this.isDark = true;
            } else {
              this.chiefId = id;
            }
          }
        });

        
      } else if (pNum > 1) {
        this.player.forEach((p, id) => {
          if (p.votedNumber === maxVote) {
            p.isTarget = true;
          } else {
            p.isTarget = false;
          }
        });
      }
    }
    */
  }

  static async enableTemplate({ name }) {
    await Db.enableTemplate({ name });
  }

  static async getTemplate({ name }) {
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

  static async addNewTemplate({ name }) {
    await Db.insertTemplateHeader({ name });
  }

  static async deleteTemplate({ name }) {
    await Db.deleteTemplateHeader({ name });
  }

  static async updateTemplateRolePriority({ name, ids }) {
    await Db.updateTemplateRolePriority({ name, ids });
  }

  static async updateTemplateRole({ name, roleId, number }) {
    await Db.upsertTemplateRole({ name, roleId, number });
  }

  static async updateTemplateDescription({ name, description }) {
    await Db.updateTemplateDescription({ name, description });
  }

  static async updateRoleNumber({ id, number }) {
    await Db.updateRoleNumber({ id, number });
  }

  static async updatePlayerName({ id, name }) {
    await Db.updatePlayerName({ id, name });
    return "pass";
  }

  static async getPlayerIdInfo({ id }) {
    const result = await Db.getPlayerIdInfo({ id });
    if (result.length === 1) {
      return result[0];
    }
    return {};
  }

  static async getPlayerInfo({ id, pass }) {
    const result = await Db.getPlayerInfo({ id, pass });
    if (result.length === 1) {
      return result[0];
    }
    return {};
  }

  static async updatePass({ id, pass }) {
    await Db.updatePass({ id, pass });
  }

  static async updatePlayerPass({ id, pass, session }) {
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

  static async resetChiefCandidate({ id }) {
    await Db.updateCheifCandidate({ isCandidate: null, isDropout: false, id });
  }

  static async updateChiefCandidate({ id, isLockSet }) {
    await Db.updateIsCheifCandidate({ isCandidate: true, id });

    /*
    const p = this.player[id];

    if (p) {
      if (isLockSet) {
        p.chiefVoteState.isCandidate = true;
        p.chiefVoteState.type = "chief";

        

      } else {
        p.chiefVoteState.isCandidate = false;
        p.chiefVoteState.type = null;
      }

      if (!p.chiefVoteState.isCandidate) {
        p.chiefVoteState.isDropedOut = false;
      }
    }
    */
  }

  static async updateChiefVoterCandidate({ id, isLockSet }) {
    await Db.updateIsCheifCandidate({ isCandidate: false, id });

    /*
    const p = this.player[id];

    if (p) {
      if (isLockSet) {
        p.chiefVoteState.type = "voter";
      }
    }
    */
  }

  static async updateChiefCandidateDropOut({ id, isLockSet }) {
    await Db.updateIsCheifCandidateDropout({ id, isDropout: true });
    /*
    const p = this.player[id];
    if (p) {
      if (!isLockSet) {
        p.chiefVoteState.isCandidate = !p.chiefVoteState.isCandidate;
      }

      if (p.chiefVoteState.isCandidate) {
        if (isLockSet) {
          p.chiefVoteState.isDropedOut = true;
          p.chiefVoteState.type = "drop";
        } else {
          p.chiefVoteState.isDropedOut = !p.chiefVoteState.isDropedOut;
        }
      }
    }
    */
  }

  static async createPlayer({ totalNumber }) {
    await Db.removeAllPlayer();

    //0 is GOD dont touch

    this.player = [{ isJoin: true, isDie: false }];
    for (let i = 0; i < totalNumber; i += 1) {
      await Db.addPlayer({ id: i + 1 });
      this.player.push({
        isTarget: false,
        isJoin: false,
        isDie: false,
        votedNumber: 0,
        chiefVoteState: { isCandidate: false, isDropedOut: false, type: null },
      });
    }
  }
  static async removeAllPlayer({ store }) {
    await Db.removeAllPlayer();
    store.all((e, sessions) => {
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

    const list = [];
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

  static async generateTemplateRole({ isCovertWolfToHuman }) {
    if (mutexWithTimeout.isLocked()) {
      return;
    }

    await mutexWithTimeout.acquire();
    try {
      const template = await Db.getEnabledTemplate();
      const { name } = template;
      const roles = await Db.getAllTemplateRole({ name });

      const list = [];
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

        list.push({ ...villager, index: len }, { ...villager, index: len + 1 });

        shuffle(list);
      } else {
        shuffle(list);
      }

      //Game.dark.reset();
      await this.reset();
      const waitRoleList = [];

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

module.exports = WolfModel;
