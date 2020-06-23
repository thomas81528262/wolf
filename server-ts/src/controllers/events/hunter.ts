import { Event, Target } from "../event";
import {StatusResult} from "../../models/status"


class HunterKill extends Event {

    constructor() {
        super({ eventName: "HUNTER_KILL", timeOut: null, permissionRole: ["hunter"] });
      }
    targets({ initiator }: { initiator: number }) {
        return [];
    }


}

const statusEvent = [{status:StatusResult.Die, event:new HunterKill(), role:"hunter"}]



export default {statusEvent}