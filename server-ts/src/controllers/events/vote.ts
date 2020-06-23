import { Event, Target } from "../event";
import { State as PlayerState } from "../../models/player";
enum State {
  NightResult,
  Vote,
  Character,
}

class VoteKill extends Event {
  private state = State.NightResult;
  constructor() {
    super({ eventName: "VOTE_KILL", timeOut: 1, permissionRole: [] });
  }

  end() {
    console.log("endddddd");
  }

  private waitNightResult() {
    this.state = State.Vote;
  }

  private waitVote() {
    let isFinish = true;

    this.status.forEach((s) => {
      const { isActionLocked } = s;
      if (!isActionLocked) {
        isFinish = false;
      }
    });

    if (isFinish) {
      this.state = State.Character;
    }
  }

  private waitCharacter() {
    let isFinish = true;
    this.status.forEach((s) => {
      const { events } = s;
      events.forEach((event) => {
        const { isWaiting } = event;
        if (isWaiting) {
          isFinish = false;
        }
      });
    });

    if (isFinish) {
      this.next();
    }
  }

  addAction({
    initiatorId,
    targetId,
    name,
  }: {
    initiatorId: number;
    targetId: number;
    day: number;
    name: string;
  }) {
    const player = this.world.players.get(initiatorId);
    if (!player) {
      return;
    }

    switch (this.state) {
      case State.Vote:
        super.addAction({ initiatorId, targetId, name: this.eventName });
        break;
      case State.NightResult:
        break;
      case State.Character:
        player.stateEvent.forEach((playerEvent) => {
          if (playerEvent.state === PlayerState.Die) {
            playerEvent.event.addAction({ initiatorId, targetId, name });
          }
        });

        break;
    }

    /*
    this.status.forEach((players) => {
      const { events } = players;
      events.forEach((e) => {
        const { event } = e;
        event.addAction({ initiator, target, day, name });
      });
    });

    */
  }

  async wait() {
    switch (this.state) {
      case State.Vote:
        this.waitVote();
        break;
      case State.NightResult:
        this.waitNightResult();
        break;
      case State.Character:
        this.waitCharacter();
        break;
    }
  }

  targets({ initiatorId }: { initiatorId: number }) {
    

    return [];
  }
}

const defAct = [new VoteKill()];

export default { VoteKill, defAct };
