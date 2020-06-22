const status = require("../models/status");
const { timeout } = require("../util");

class Role {
  #actionName = "";
  #linkRole = "";
  #timeOut = 0;
  #remainTime = 0;

  constructor({ actionName, linkRole, timeOut }) {
    if (!linkRole) {
      throw Error("can not find any link role");
    }

    //time out unit is sec
    this.#timeOut = timeOut;
    this.#linkRole = linkRole;
    this.#actionName = actionName;
  }
  start() {
    status.startAction(this.#actionName);
  }

  end() {
    throw Error("No end method define!")
  }

  //default wait method
  async wait() {
    this.#remainTime = this.#timeOut;
    if (this.#remainTime) {
      while (this.#remainTime) {
        await timeout(1000);
        this.#remainTime -= 1;
      }
    } else {
      console.log("no timer set");
    }
  }

  addAction({ initiator, target, day }) {
    status.addAction({ initiator, target, day });
  }

  addStatus({ initiator, target, day }) {
    status.addStatus({ initiator, target, day });
  }

  hasPermission({initiator}) {

   
      const {linkRole} = status.status[initiator];
      return linkRole === this.#linkRole;
  }

  get actions() {
    return status.actions;
  }
  get linkRole() {
    return this.#linkRole;
  }

  get targets() {
     throw Error("No get target method define!")
  }
  get status() {
      return status.status;
  }

}

module.exports = Role;
