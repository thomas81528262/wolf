import { worldStatus } from "../models/status";
import { timeout } from "../util";
import { World } from "./world";


interface TargetEvent {
  name: string;
  targets: Target[];
}

interface Target {
  eventName: string
  targetId: number;
  initiatorsId: number[];
  value: string | number | null;
}


abstract class Event {
  private _name = "";
  private _remainTime = 0;
  private _permissionRole: string[] = [];
  private timeOut = 0;
  private nextEvent: Event = null;
  private isTimeoutMode = false;
  protected world: World = null;

  constructor({
    eventName,
    permissionRole,
    timeOut,
  }: {
    eventName: string;
    permissionRole: string[];
    timeOut: number;
  }) {
    this._name = eventName;
    this._permissionRole = permissionRole;
    this.timeOut = timeOut;
  }

  start(world: World) {
    this.world = world;
    world.event = this;
    this.wait();
  }

  setNextEvent(event: Event) {
    this.nextEvent = event;
  }

  //abstract end(): void;

  protected end() {
    
  }

  //end current event and start new event
  protected next() {
    this.end();
    this.nextEvent.start(this.world);
  }

  //default wait event
  async wait() {
    this._remainTime = this.timeOut;
    this.isTimeoutMode = true;
    if (this._remainTime) {
      while (this._remainTime) {
        await timeout(1000);
        this._remainTime -= 1;
      }
    } else {
      console.log("no timer set");
    }
    //when the event finish, must call the next event!!!
    this.next();
  }


  protected hasPermission({ initiatorId }: { initiatorId: number }) {
    const player = this.world.players.get(initiatorId)
    if (!player) {
      return false;
    }

    return this._permissionRole.includes(player.role);
  }

  //default mode is timeout mode, terminate in certain time,
  //user can override the wait method and call the next event in certain condition.
  addAction({
    initiatorId,
    targetId,
    name,
  }: {
    initiatorId: number;
    targetId: number;
    name: string;
  }) {
    if (name !== this._name) {
      return;
    }

    this.world.addEventAction({ name, initiatorId, targetId });
    if (!this.isTimeoutMode) {
      this.wait();
    }
  }

  get result() {
    return "result";
  }

  abstract targets({ initiatorId }: { initiatorId: number }): Target[];

  get status() {
    return worldStatus.status;
  }

  get eventName() {
    return this._name;
  }

  get actions() {
    return worldStatus.actions;
  }

  hasRolePermission(role: string) {
    return this._permissionRole.includes(role);
  }

}

export { Event, Target, TargetEvent };
