const Role = require("../role");

class WolfKill extends Role {
  constructor() {
    super({ actionName: "wolfKill", timeOut: 3, linkRole: "wolf" });
  }

  end() {
    console.log(super.actions);

    //super.addStatus({})
  }

  //output

  get latestAction() {
    if (super.actions.length === 0) {
      return { target: -1, initiator: -1 };
    }

    const latestId = super.actions.length - 1;
    const { target, initiator } = super.actions[latestId];
    return { target, initiator };
  }

  targets({ initiator }) {
    const result = [];

    //only the initiator who has the same role name can access the action data
    if (!super.hasPermission({ initiator })) {
      return result;
    }

    //here only  use the latest selection
    const { target } = this.latestAction;

    
    for (let [id, value] of Object.entries(super.status)) {
      const { die } = value;
      if (!die) {
        if (target === value.target) {
          result.push({ target: value.target, initiators: [initiator] });
        } else {
          result.push({ target: value.target, initiators: [] });
        }
      }
    }

    return result;
  }

  //async wait() {}
}

const defAct = [new WolfKill()];

module.exports = { WolfKill, defAct };
