class Status {
  #status = {};
  #actions = [];
  #actionName = "";
  constructor() {
    this.reset();
  }

  reset() {
    //prevent duplicate user, every user should only has one state
    this.#status = {};
    //only keep last status for every user
    this.#actions = [];
    this.#actionName = "";
  }

  startAction(name) {
    if (!name) {
        throw Error("The action name can not be empty!")
    }

    this.#actionName = name;
  }

  //add new target to the status
  addTarget({target, linkRole}) {
      this.#status[target] = {die:false, linkRole, target}
  }

  //only keep the newest action for every user
  addAction({ initiator, target, day }) {
    //remove the previous initiator action
    const result = this.#actions.filter((v) => v.initiator !== initiator);
    //add the newest initiator acton
    result.push({
      initiator,
      target,
      actionName: this.#actionName,
      day,
    });
    this.#actions = result;
  }

  //merge the status to the target user, and clear the actions
  addStatus({ initiator, target, day }) {
    const targetStatus = this.#status[target];
    this.#status[target] = {
      ...targetStatus,
      [this.#actionName]: { day, initiator },
    };
    this.#actions = [];
  }

  //reveal the target role to the initiator
  addViewingRole({initiator, target, day, role}) {
    const {viewingRole} = this.#status[initiator];
    viewingRole.push({target, day, role})
    this.#actions = [];
  }


  get status() {
    return this.#status;
  }
  get actions() {
    return this.#actions;
  }
}

module.exports = new Status();
