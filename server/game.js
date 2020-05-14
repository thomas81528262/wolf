const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const Db = require("./db");
const nullActionFunction = () => {
  //console.log("no action");
};

class Dark {
  constructor() {
    this.playerFunctionNameMapping = {};
    this.isStart = false;
    this.remainTime = 0;
    this.actionFunction = nullActionFunction;
    this.resultFunction = nullActionFunction;
    this.roleFunctionName = null;
    this.darkDay = 0;
    this.actionList = [];
    this.roundActions = {};
    this.currentAction = {};
    this.players = [];
    this.actRoleType = null;

    this.witchControl = { isPoisonUsed: false, isCureUsed: false };

    this.actionFunctionMapping = {
      witch: [
        {
          act: this.witchKill,
          darkTimeSec: 15,
          msg: "女巫毒人",
          actRoleType: "WITCH",
          res: this.witchKillingList,
        },
        {
          act: this.witchCure,
          darkTimeSec: 15,
          msg: "女巫救人",
          actRoleType: "WITCH",
          res: this.witchKillingList,
        },
      ],
      wolf: [
        {
          act: this.wolfKill,
          darkTimeSec: 15,
          msg: "狼人殺人",
          res: this.wolfKillingList,
          actRoleType: "WOLF",
        },
      ],
      prophet: [
        {
          act: this.prophetCheck,
          darkTimeSec: 15,
          msg: "預言家驗人",
          res: this.wolfKillingList,
          actRoleType: "PROPHET",
        },
      ],
    };
  }

  reset() {}

  assignDarkRole({ id, roleFunctionName, camp }) {
    this.roundActions[id] = { playerId: id, isDie: 0, wolfKillDay: 0 , revealedRole:{}, camp};
    this.playerFunctionNameMapping[id] = { roleFunctionName };
  }



  characterCheckAction({ role, id, playerId, errorMsg }) {
    if (
      !this.playerFunctionNameMapping[id] &&
      this.playerFunctionNameMapping[id].roleFunctionName !== role
    ) {
      console.log(errorMsg);
      return { msg: errorMsg };
    }

    if (playerId === -1) {
      this.currentAction = {};
    }

    const { roundActions } = this;

    if (!roundActions[playerId]) {
      console.log("the player is not exist");
      return { msg: "The player is not exist", hasError: true };
    } else if (roundActions[playerId].die) {
      console.log("the player is die");
      return { msg: "The player is die", hasError: true };
    }

    return { hasError: false };
  }

  prophetCheck({ id, playerId }) {
    const result = this.characterCheckAction({
      role: "prophet",
      id,
      playerId,
      errorMsg: "You are not prophet",
    });

    if (result.hasError) {
      return result;
    }

    this.currentAction = { playerId, prophetCheckDay: this.darkDay, id };
    return { hasError: false };
  }

  prophetCheckList({ id }) {
    if (!this.playerFunctionNameMapping[id]) {
      return [];
    }

    if (this.playerFunctionNameMapping[id].roleFunctionName !== "prophet") {
      return [];
    }

    const result = [];
    for (let [key, value] of Object.entries(this.roundActions)) {
      const { isDie, playerId, prophetCheckDay } = value;

      if (!isDie && !prophetCheckDay) {
        if (playerId === this.currentAction.playerId) {
          const { prophetCheckDay } = this.currentAction;
          result.push({ id: playerId, isKill: prophetCheckDay });
        } else {
          result.push({ id: playerId });
        }
      }
    }

    return result;
  }

  wolfKill({ id, playerId }) {
    const result = this.characterCheckAction({
      role: "wolf",
      id,
      playerId,
      errorMsg: "You are not wolf",
    });

    if (result.hasError) {
      return result;
    }

    this.currentAction = { playerId, wolfKillDay: this.darkDay };

    return { hasError: false };
  }

  wolfKillingList({ id }) {
    if (!this.playerFunctionNameMapping[id]) {
      return [];
    }

    if (this.playerFunctionNameMapping[id].roleFunctionName !== "wolf") {
      return [];
    }

    const result = [];
    for (let [key, value] of Object.entries(this.roundActions)) {
      const { isDie, playerId } = value;

      if (!isDie) {
        if (playerId === this.currentAction.playerId) {
          const { wolfKillDay } = this.currentAction;
          result.push({ id: playerId, isKill: wolfKillDay });
        } else {
          result.push({ id: playerId });
        }
      }
    }

    return result;
  }

  witchKill({ id, playerId }) {
    const result = this.characterCheckAction({
      role: "witch",
      id,
      playerId,
      errorMsg: "You are not witch",
    });

    if (result.hasError) {
      return result;
    }

    for (let [key, value] of Object.entries(this.roundActions)) {
      const { witchKillDay, witchCureDay, isDie } = value;
      if (witchKillDay || witchCureDay === this.darkDay || isDie) {
        return;
      }
    }

    this.currentAction = { playerId, witchKillDay: this.darkDay };
  }

  witchKillingList({ id }) {
    if (!this.playerFunctionNameMapping[id]) {
      return [];
    }

    if (this.playerFunctionNameMapping[id].roleFunctionName !== "witch") {
      return [];
    }

    const result = [];
    let isNotAvaiable = false;

    for (let [key, value] of Object.entries(this.roundActions)) {
      const { isDie, playerId } = value;

      if (value.witchKillDay || value.witchCureDay) {
        isNotAvaiable = true;
        break;
      }

      if (!isDie) {
        if (playerId === this.currentAction.playerId) {
          const { witchKillDay } = this.currentAction;
          result.push({ id: playerId, isKill: witchKillDay });
        } else {
          result.push({ id: playerId });
        }
      }
    }

    if (isNotAvaiable) {
      return [];
    }

    return result;
  }
  witchCure({ playerId }) {
    if (this.roundActions[playerId].wolfKillDay === this.darkDay) {
      this.currentAction = { playerId, witchCureDay: this.darkDay };
    }
  }

  witchCuringList({ id }) {
    if (!this.playerFunctionNameMapping[id]) {
      return [];
    }

    if (this.playerFunctionNameMapping[id].roleFunctionName !== "witch") {
      return [];
    }

    const result = [];
    for (let [key, value] of Object.entries(this.roundActions)) {
      const { isDie, playerId, wolfKillDay } = value;
      if (value.witchCureDay) {
        isNotAvaiable = true;
        break;
      }
      if (!isDie && wolfKillDay === this.darkDay) {
        if (playerId === this.currentAction.playerId) {
          const { witchKillDay } = this.currentAction;
          result.push({ id: playerId, isKill: witchKillDay });
        } else {
          result.push({ id: playerId });
        }
      }
    }

    if (isNotAvaiable) {
      return [];
    }

    return result;
  }


  addAction() {
    const { playerId, id, prophetCheckDay } = this.currentAction;

    if (this.roundActions[playerId]) {
      this.roundActions[playerId] = {
        ...this.roundActions[playerId],
        ...this.currentAction,
      };
    } else if (playerId) {
      this.roundActions[playerId] = { ...this.currentAction };
    }

    if (prophetCheckDay) {
      //this.roundActions[id].revealedRole[playerId] = 
    }


    console.log(this.roundActions);
  }

  getResult() {
    const result = { ...this.roundActions };
    for (let [id, value] of Object.entries(this.roundActions)) {
      const { wolfKillDay, witchCureDay, witchKillDay } = value;

      if (wolfKillDay === this.darkDay) {
        if (!witchCureDay === this.darkDay) {
          result[id] = { ...result[id], isDie: this.darkDay };
        } else {
          result[id] = {
            ...result[id],
            isDie: this.darkDay,
            wolfKillDay,
            witchCureDay,
          };
        }
      }

      if (witchKillDay === this.darkDay) {
        result[id] = { ...result[id], isDie: this.darkDay };
      }
    }
    this.roundActions = result;
    console.log(this.roundActions);
  }

  async iniActionList() {
    const template = await Db.getEnabledTemplate();
    const { name } = template;
    const roles = await Db.getAllTemplateRole({ name });
    const actionList = [];
    roles.forEach((r) => {
      const { functionName } = r;
      const fList = this.actionFunctionMapping[functionName];
      console.log(this.actionFunctionMapping[functionName]);
      if (fList) {
        fList.forEach((f) => {
          const { act, darkTimeSec, res, actRoleType } = f;

          actionList.push({
            act,
            roleFunctionName: functionName,
            darkTimeSec,
            res,
            actRoleType,
          });
        });
      }
    });

    return actionList;
  }

  async start() {
    if (this.isStart) {
      return { msg: "the dark is start" };
    }

    /*
    this.roundActions = {
      0: { playerId: 0, isDie: 0, wolfKillDay: 0 },
      1: { playerId: 1, isDie: 0, wolfKillDay: 0 },
      2: { playerId: 2, isDie: 0, wolfKillDay: 0 },
      3: { playerId: 3, isDie: 0, wolfKillDay: 0 },
    };
    */

    this.isStart = true;
    this.darkDay += 1;
    //const roles = [{ name: "狼人", darkTimeSec: 10, roleFunction: "狼人" }];
    /*
    const actionList = [
      { act: this["wolfKill"], darkTimeSec: 4, roleFunctionName: "wolfKill" },
      { act: this["wolfKill"], darkTimeSec: 4, roleFunctionName: "wolfKill" },
    ];
    */

    const actionList = await this.iniActionList();
    console.log(actionList, "action list");

    for (let i = 0; i < actionList.length; i += 1) {
      const {
        darkTimeSec,
        act,
        roleFunctionName,
        res,
        actRoleType,
      } = actionList[i];
      this.actionFunction = act;
      this.resultFunction = res;
      this.roleFunctionName = roleFunctionName;
      this.actRoleType = actRoleType;
      let remainTime = darkTimeSec;

      while (remainTime) {
        await timeout(1000);
        remainTime -= 1;
        this.remainTime = remainTime;
      }

      this.addAction();
    }

    this.getResult();
    this.isStart = false;
  }
}

const dark = new Dark();

module.exports = { dark };
