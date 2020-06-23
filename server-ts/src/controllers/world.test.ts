import { World } from "./world";
import Wolf from "./controllers/events/wolf";
import Hunter from "./controllers/events/hunter";
import VoteKill from "./controllers/events/vote";
import { worldStatus } from "./models/status";
import { timeout } from "./util";

test("add action", async () => {
  
  const world = new World(
    [Wolf.defAct, VoteKill.defAct],
    ["WOLF_KILL", "VOTE_KILL"],
    [...Hunter.statusEvent]
  );
  const status = worldStatus;
  console.log("world");

  // add three player to the game
  world.addTarget({ linkRole: "wolf", target: 1 });
  world.addTarget({ linkRole: "wolf", target: 2 });
  world.addTarget({ linkRole: "test", target: 3 });

  world.start();
  
  //wolf
 
  world.addAction({ initiator: 2, target: 3 });
  world.addAction({ initiator: 1, target: 3 });
  let actions = status.actions;
  
  const targets = world.targets({initiator:1})
  await timeout(2000);
  
  world.addAction({ initiator: 2, target: 3 });
  actions = status.actions;
  const reusltStatus = worldStatus;
  await timeout(500);
  /*
  const actions = status.actions;
  
  
  await timeout(500);
  await timeout(4000);

  expect(1).toEqual(1);
  */
});
