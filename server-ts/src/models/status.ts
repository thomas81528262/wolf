
import {Event} from "../controllers/event"

enum StatusResult {
  Die,
  None
}

enum PlayerState {
  Die
}


interface PlayerAction {
  initiators: number[];
  target: number;
  name: string;
  day: number;
}

interface PlayerEvent {
  linkRole: string;
  event:Event;
  isWaiting: boolean;
  status: StatusResult;
}

interface TargetInfo {
  target: number;
  value: string;
  day: number;
}

interface PlayerStatus {
  name: string;
  day: number;
  initiators:number[];
}


interface Status {
  stateResults: {state:PlayerState, day:number}[]

}


interface Test {
  id: number;
  role: string
}


interface Player {
  isDie: boolean;
  linkRole: string;
  target: number;
  actions: PlayerAction[];
  view: TargetInfo[];
  status: PlayerStatus[];
  isActionLocked: boolean;
  isWaiting: boolean;
  statusResult:StatusResult[];
  events: PlayerEvent[];
}



/**
 * A class save all the status of the world
 */
class WorldStatus {
  private _status = new Map<number, Player>();
  private _actions: PlayerAction[] = [];
  //private eventName: string = "";

  rest() {
    this._status = new Map();
    this._actions = [];
    //this.eventName = "";
  }

  get status() {
    return this._status;
  }

  get actions() {
    return this._actions;
  }

  startEvent(name: string) {
    if (!name) {
      throw Error("The action name can not be empty!");
    }

    //this.eventName = name;
  }

  addTarget({ target, linkRole }: { target: number; linkRole: string }) {
    this._status.set(target, {
      isDie: false,
      linkRole,
      target,
      actions: [],
      view: [],
      status: [],
      isActionLocked:false,
      isWaiting: false,
      events:[],
      statusResult:[]
    });
  }

  addPlayerEvent({target, event, status}:{target:number, event:Event, status:StatusResult}) {
    const targetStatus = this._status.get(target);

    if (!targetStatus) {
      return;
    }

    const {linkRole} = targetStatus
    targetStatus.events.push({event,isWaiting: true, status, linkRole})
  }



  //check the target and initiator is exist
  private isValidTarget({ target }: { target: number }) {
    const targetsStatus = this._status.get(target);
    return targetsStatus !== null;
  }

  private isValidInitiator({ initiator }: { initiator: number }) {
    const initiatorStatus = this._status.get(initiator);
    return initiatorStatus !== null;
  }

 

  //every intiator only can select one target for every event
  addAction({
    initiator,
    target,
    day,
    name
  }: {
    initiator: number;
    target: number;
    day: number;
    name:string
  }) {
    if (!this.isValidInitiator({initiator })) {
      return;
    }

    const initiatorStatus = this._status.get(initiator)
    if (initiatorStatus.isActionLocked) {
      return;
    }


    let isAddInitiator = false;
    const result = [];
    //remove the previous selection in the same event
    //if no one select it, the target will be removed.
    this._actions.forEach((act) => {

      if (act.name !== name) {
        return;
      }


      act.initiators = act.initiators.filter((v) => v !== initiator);

      if (act.initiators.length === 0) {
        return;
      }

      if (act.target === target) {
        act.initiators.push(initiator);
        isAddInitiator = true;
      }

      result.push({ ...act });
    });

    if (!isAddInitiator && this.isValidTarget({target})) {
      result.push({
        initiators: [initiator],
        target,
        day,
        name
      });
    }

    this._actions = result;
  }

  addStatus({
    initiators,
    target,
    day,
    name
  }: {
    initiators: number[];
    target: number;
    day: number;
    name:string
  }) {
    const targetStatus = this._status.get(target);

    // the target must exist, or just ingore it.
    if (targetStatus) {
      const { status } = targetStatus;
      //every time when wee update the status, we clear the current action
      if (status) {
        status.push({ initiators,  day, name });
        this._actions = [];
      }
    }
  }

  addViewingRole({
    initiator,
    target,
    day,
    value,
  }: {
    initiator: number;
    target: number;
    day: number;
    value: string;
  }) {
    const { view } = this._status.get(initiator);
    view.push({ target, value, day });
  }

  async getResult() {}
}

const worldStatus = new WorldStatus();

export { WorldStatus, worldStatus , StatusResult, PlayerEvent};
