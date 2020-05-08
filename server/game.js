const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nullActionFunction = () => {
  console.log("no action");
};

class Dark {
  constructor() {
    this.playerFunctionNameMapping = {};
    this.isStart = false;
    this.remainTime = 0;
    this.actionFunction = nullActionFunction;
    this.roleFunctionName = null;
    this.darkDay = 0;
    this.actionList = [];
    this.roundActions = {};
    this.currentAction = {};
    this.players = [];

    this.actionFucntionMapping = {
      witch: [],
      wolf: [this.wolfKill],
    };
  }


  reset() {

  }


  assignDarkRole({ id, roleFunctionName }) {
    this.roundActions[id] = { playerId: id, isDie: 0, isWolfKill: 0 };
    this.playerFunctionNameMapping[id] = { roleFunctionName };
  }

  addAction() {
    const { playerId } = this.currentAction;

    if ([playerId]) {
      this.roundActions[playerId] = {
        ...this.roundActions[playerId],
        ...this.currentAction,
      };
    } else if(playerId){
      this.roundActions[playerId] = { ...this.currentAction };
    }

    console.log(this.roundActions);
  }

  wolfKill({ id, playerId }) {
    if (
      !this.playerFunctionNameMapping[id] &&
      this.playerFunctionNameMapping[id].roleFunctionName !== "wolf"
    ) {
      console.log("you are not wolf");
      return { msg: "You are not Wolf!" };
    }

    if (playerId === -1) {
      this.currentAction = {};
    }

    const { roundActions } = this;

    if (!roundActions[playerId]) {
      console.log("the player is not exist");
      return { msg: "The player is not exist", hasError: true };
    } else if (roundActions[playerId].die) {
      return { msg: "The player is die", hasError: true };
    }

    this.currentAction = { playerId, isWolfKill: this.darkDay };

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
          const { isWolfKill } = this.currentAction;
          result.push({ id: playerId, isKill: isWolfKill });
        } else {
          result.push({ id: playerId });
        }
      }
    }

    return result;
  }

  witchKill({ playerId }) {
    this.currentAction = { playerId, isWhichKill: this.darkDay };
  }

  witchCure({ playerId }) {
    const {
      roundActions: { cur },
    } = this;

    if (cur.isWolfKill) {
      this.currentAction = { playerId, isWhichCure: this.darkDay };
    }
  }

  getResult() {
    const result = { ...this.roundActions };
    for (let [key, value] of Object.entries(this.roundActions)) {
      const { isWolfKill } = value;

      if (isWolfKill) {
        result[key] = { ...result[key], isDie: this.darkDay };
      }
    }
    this.roundActions = result;
    console.log(this.roundActions);
  }

  iniActionList(roles) {
    const actionList = [];
    roles.forEach((r) => {
      const { functionnName, darkTimeSec } = r;
      const fList = this.actionFucntionMapping[functionnName];
      if (fList) {
        fList.forEach((f) => {
          actionList.push({
            act: f,
            roleFunctionName: functionnName,
            darkTimeSec,
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
    this.darkDay += 1;
    /*
    this.roundActions = {
      0: { playerId: 0, isDie: 0, isWolfKill: 0 },
      1: { playerId: 1, isDie: 0, isWolfKill: 0 },
      2: { playerId: 2, isDie: 0, isWolfKill: 0 },
      3: { playerId: 3, isDie: 0, isWolfKill: 0 },
    };
    */

    this.isStart = true;
    //const roles = [{ name: "狼人", darkTimeSec: 10, roleFunction: "狼人" }];
    /*
    const actionList = [
      { act: this["wolfKill"], darkTimeSec: 4, roleFunctionName: "wolfKill" },
      { act: this["wolfKill"], darkTimeSec: 4, roleFunctionName: "wolfKill" },
    ];
    */

    const actionList = this.iniActionList([
      { functionnName: "wolf", darkTimeSec: 30 },
    ]);

    for (let i = 0; i < actionList.length; i += 1) {
      const { darkTimeSec, act, roleFunctionName } = actionList[i];
      this.actionFunction = act;
      this.roleFunctionName = roleFunctionName;
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
