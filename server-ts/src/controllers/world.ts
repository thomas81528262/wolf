import { Event } from "./event";
import { worldStatus, StatusResult, PlayerEvent } from "../models/status";
import { Player, State } from "../models/player";

function converResultMap(
  list: {
    key: string[];
    status: StatusResult;
  }[]
) {
  const result = new Map<String, StatusResult>();
  list.forEach((l) => {
    const { key, status } = l;

    result.set(key.sort().toString(), status);
  });

  return result;
}

abstract class World {
  private _players: Map<number, Player> = new Map();
  private _day: number = 0;
  private _event: Event = null;
  private stateEvent: {
    state: State;
    event: Event;
    role: string;
  }[] = null;
  constructor(
    {dayEvents}:{dayEvents:}
    /*
    eventList: Event[][],
    eventOrder: string[],
    statusEvent: {
      state: State;
      event: Event;
      role: string;
    }[]
    */
  ) {
    this.stateEvent = statusEvent;

    const flattened: Event[] = [].concat(...eventList);

    let preEvent: Event = null;

    /*
    eventOrder.forEach((name) => {
      const events = flattened.filter((v) => v.eventName === name);

      events.forEach((event) => {
        if (!preEvent) {
          this._event = event;
          preEvent = event;
        } else {
          preEvent.setNextEvent(event);
          preEvent = event;
        }
      });
    });
    */
  }

  get players(): ReadonlyMap<number, Player> {
    return this._players;
  }

  addPlayer({ role, id }) {
    const player = new Player({ id, role });
    this._players.set(id, player);
    this.stateEvent.forEach((e) => {
      if (e.role === role) {
        player.addEvent({ event: e.event, state: e.state });
      }
    });
  }
  abstract addState(): void;

  addEventAction({ name, targetId, initiatorId }) {
    if (!this._players.get(initiatorId)) {
      return;
    }

    this._players.forEach((p) => {
      p.removeAction({ initiatorId, name });
    });

    const targetPlayer = this._players.get(targetId);

    if (targetPlayer) {
      targetPlayer.addAction({ initiatorId, name, day: this._day });
    }
  }

  addStatus() {
    this._players.forEach((p) => {
      p.addStatus();
    });
  }

  addAction({
    initiatorId,
    targetId,
    name,
  }: {
    initiatorId: number;
    targetId: number;
    name: string;
  }) {
    this._event.addAction({ initiatorId, targetId, name });
  }

  targets({ initiatorId }: { initiatorId: number }) {
    console.log("world target");
    return this._event.targets({ initiatorId });
  }

  async start() {
    this._event.start(this);

    /*
    for (let i = 0; i < this.eventList.length; i += 1) {
      const event = this.eventList[i];
      this.event = event;
      event.start(this.day);
      await event.wait();
      event.end();
    }
    */
  }

  get day() {
    return this._day;
  }

  set event(event: Event) {
    this._event = event;
  }

  static getResultMap(
    list: {
      key: string[];
      state: State[];
    }[]
  ) {
    const result = new Map<String, State[]>();
    list.forEach((l) => {
      const { key, state } = l;

      result.set(key.sort().toString(), state);
    });

    return result;
  }
}

export { World, converResultMap };
