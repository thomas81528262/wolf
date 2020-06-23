import { Event, Target, TargetEvent } from "../event";
import { Action } from "../../models/player";
class WolfKill extends Event {
  constructor() {
    super({ eventName: "WOLF_KILL", timeOut: 1, permissionRole: ["wolf"] });
  }

  get lastAction(): Action {
    let action = null;

    this.world.players.forEach((p) => {
      p.actions.forEach((act) => {
        if (act.name === this.eventName) {
          if (action && act.date > action.date) {
            action = act;
          }
        }
      });
    });

    return action;
  }

  targets({ initiatorId }: { initiatorId: number }) {
    const targets: Target[] = [];

    if (!this.hasPermission({ initiatorId })) {
      return [];
    }

    const action = this.lastAction;

    if (!action) {
      return [];
    }

    this.world.players.forEach((player) => {
      const { id } = player;

      const initiatorsId = [];
      player.actions.forEach((act) => {
        initiatorsId.push(act.initiatorId);
      });
      targets.push({
        targetId: id,
        initiatorsId,
        value: null,
        eventName: this.eventName,
      });
    });

    return targets;
  }
}

const dayEvent = [new WolfKill()];

export default { WolfKill, dayEvent };
