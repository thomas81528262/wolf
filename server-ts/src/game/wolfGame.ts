import {World} from "../controllers/world";
import {} from "../controllers/event"
import {State} from "../models/player"
import Wolf from "../controllers/events/wolf"


const dayEvents = [...Wolf.dayEvent];

function getEvents(roleOrder:string[]) {
  const result = [];
  roleOrder.forEach(role=>{
    dayEvents.forEach(event=>{
      if (event.hasRolePermission(role)) {
        result.push(event);
      }
    })
  })
  return result;
}

class WolfGame extends World {

    constructor(roleOrder:string[]) {
      const events = this.getEvents(roleOrder);
      super();
    }

    private getEvents(roleOrder:string[]) {
      const result = [];
      roleOrder.forEach(role=>{
        dayEvents.forEach(event=>{
          if (event.hasRolePermission(role)) {
            result.push(event);
          }
        })
      })
      return result;
    }


    addState() {

    }
}