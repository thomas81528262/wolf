const Db = require("../db");

class World {
  #actMap = new Map();
  #day = 0;
  #isStart = fasle;
  #name = "";
  constructor(defActList) {
    defActList.forEach((acts) => {
      const actList = this.#actMap.get(acts.linkRole);
      if (!actList) {
        this.#actMap.set(acts.linkRole, [acts]);
      } else {
        actList.push(acts);
      }
    });
  }

  async getActionList() {
    const template = await Db.getEnabledTemplate();
    const { name } = template;
    const roles = await Db.getAllTemplateRole({ name });
    const actList = [];
    roles.forEach((r) => {
      const { functionName } = r;
      const acts = this.#actMap.get(functionName);
      acts.forEach((act) => {
        actList.push(act);
      });
    });
  }

  get day() {
    return this.#day;
  }

  get isStart() {
    return this.#isStart;
  }

  async start() {
    if (this.#isStart) {
      return { msg: `the ${this.#name} event is already start` };
    }

    this.#day += 1;
    const actionList = this.getActionList();
    for (let i = 0; i < actionList.length; i += 1) {
      const act = actionList[i];
      act.start();
      await act.wait();
      act.end();
    }
  }
}

module.exports = World;
