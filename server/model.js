const Db = require("./db");
const shuffle = require("shuffle-array");
const Game = require("./game");
const { withTimeout, Mutex } = require("async-mutex");
const mutexWithTimeout = withTimeout(new Mutex(), 1000, new Error("timeout"));

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class WolfModel {
  static voteList = [];
  static voteHistory = [];
  static isValidCandidate = new Set();
  static player = [];
  static isVoteFinish = true;

  static setPlayerDieStatus({ id }) {
    const p = this.player[id];
    console.log(p);
    if (p) {
      p.isDie = !p.isDie;
    }
  }

  static async startVote(list) {
    
    if (!this.isVoteFinish) {
      return;
    }

    this.isValidCandidate.clear();
    

    const result = await Db.getAllPlayer();
    for (let i = 0; i < result.length; i += 1) {

      
      const {id} = result[i];
      if (!id) {
        continue;
      }
      console.log(this.player[id]);
      if (!this.player[id].isDie) {

        if (list.length === 0) {
          this.isValidCandidate.add(id);
          this.voteList[id] = 0;
        } else if (list.includes(id)) {
          this.voteList[id] = 'T';
          this.isValidCandidate.add(id);
        } else {
          this.voteList[id] = 0;
        }
        
      } else {
        this.isValidCandidate.delete(id)
        this.voteList[id] = 'D';
      }
    }
    this.isVoteFinish = false;
    console.log(this.voteList)
  }

  static getVoteStatus({ id }) {
    const isValidCandidate = this.isValidCandidate.has(id);
    const vote = [];
    let isVoteFinish = true;

    if (id) {
      this.voteHistory.forEach((list) => {
        const target = list[id];
        vote.push(target);
      });
      isVoteFinish = this.voteList[id] !== 0 || this.isVoteFinish;
    }

    return { isValidCandidate, vote , isVoteFinish};
  }

  static getPlayerStatus({ id }) {
    const p = this.player[id];

    if (!p) {
      return {};
    }
    return p;
  }

  static getIsVoteFinish({ id }) {
    if (this.isVoteFinish) {
      return true;
    }

    if (id === 0) {
      return this.isVoteFinish;
    }

    return this.voteList[id] !== 0;
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

  static submitVote({ id, target }) {
    if (this.isVoteFinish) {
      return;
    }

    if (this.voteList[id] === 0) {
      this.voteList[id] = target === -1 ? 'X': target;
    }

    let isFinish = true;

    this.voteList.forEach((target, id) => {
      if (target === 0 && id !== 0) {
        isFinish = false;
      }
    });

    if (isFinish) {
      this.voteHistory.push(this.voteList);
      this.voteList = [];
      this.isVoteFinish = true;
    }
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

  static async getPlayerInfo({ id, pass }) {
    const result = await Db.getPlayerInfo({ id, pass });
    if (result.length === 1) {
      return result[0];
    }
    return {};
  }

  static async updatePlayerPass({ id, pass }) {
    const info = await this.getPlayerInfo({ id, pass });

    console.log(info.id);
    if (info.id !== null && info.id !== undefined) {
      return { isValid: true, ...info };
    }

    const result = await Db.updatePlayerPass({ id, pass });
    console.log(result);

    return result;
  }

  static async createPlayer({ totalNumber }) {
    await Db.removeAllPlayer();
    console.log(totalNumber);
    //0 is GOD dont touch
    for (let i = 0; i < totalNumber; i += 1) {
      await Db.addPlayer({ id: i + 1 });
    }
  }
  static async removeAllPlayer() {
    await Db.removeAllPlayer();
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

  static async generateTemplateRole() {
    if (mutexWithTimeout.isLocked()) {
      return;
    }

    await mutexWithTimeout.acquire();
    try {
      const template = await Db.getEnabledTemplate();
      const { name } = template;
      const result = await Db.getAllTemplateRole({ name });

      const list = [];
      result.forEach((d) => {
        const { number, id, functionName, camp } = d;

        if (number) {
          for (let i = 0; i < number; i += 1) {
            list.push({ id, functionName, camp });
          }
        }
      });

      shuffle(list);

      Game.dark.reset();

      const waitRoleList = [];

      list.forEach((value, idx) => {
        const { id: roleId, functionName, camp } = value;
        Game.dark.assignDarkRole({
          id: idx + 1,
          roleFunctionName: functionName,
          camp,
        });
        waitRoleList.push(Db.updatePlayerRole({ id: idx + 1, roleId }));
        this.player[idx + 1] = { isDie: false };
      });

      this.voteHistory = [];

      await Promise.all(waitRoleList);
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
    const result = await Db.getAllPlayer();
    return result;
  }

  static async getAllRole() {
    const result = await Db.getAllRole();
    return result;
  }
}

module.exports = WolfModel;
