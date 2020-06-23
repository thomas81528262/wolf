import { Event } from "../controllers/event";

enum State {
  Die,
}

interface Status {
  name: string;
  day: number;
  initiatorId: number;
}

export interface Action {
  initiatorId: number;
  name: string;
  day: number;
  date: Date;
}

interface StateEvent {
  event: Event;
  state: State;
}

class Player {
  private _id: number = null;
  private _role: string = null;
  private _actions: Action[] = [];
  private _stateEvents: StateEvent[] = [];
  private _status: Status[] = [];
  private _states: { state: State; day: number }[] = [];
  isActionLock = false;

  constructor({ id, role }) {
    this._id = id;
    this._role = role;
  }

  removeAction({ initiatorId, name }: { initiatorId: number; name: string }) {
    this._actions = this._actions.filter(
      (v) => v.initiatorId !== initiatorId || v.name !== name
    );
  }

  addAction({
    initiatorId,
    name,
    day,
  }: {
    initiatorId: number;
    name: string;
    day: number;
  }) {
    this._actions.push({ initiatorId, name, day, date: new Date() });
  }

  addEvent({ event, state }: { event: Event; state: State }) {
    this._stateEvents.push({ event, state });
  }

  addStatus() {
    this._actions.forEach((act) => {
      const { initiatorId, name, day } = act;
      this._status.push({ initiatorId, name, day });
    });

    this._actions = [];
  }

  addState({ day, state }: { day: number; state: State }) {
    this._states.push({ day, state });
  }

  getState(day: number) {
    const result = this._states.filter((s) => s.day === day);
    return result.sort();
  }

  get id() {
    return this._id;
  }

  get role() {
    return this._role;
  }

  get actions(): ReadonlyArray<Readonly<Action>> {
    return this._actions;
  }

  get isDie(): boolean {
    return this._states.filter((s) => s.state === State.Die).length > 0;
  }

  get stateEvent(): ReadonlyArray<Readonly<StateEvent>> {
    return this._stateEvents;
  }
}

export { Player, State };
