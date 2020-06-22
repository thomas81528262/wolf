const status = require("../../models/status");
const { WolfKill } = require("./wolf");

test("wolf add action test", async () => {
  const data = [
    { initiator: 0, target: 2, actionName: "wolfKill", day: 3 },
    { initiator: 1, target: 1, actionName: "wolfKill", day: 3 },
  ];
  status.reset();
  const wolf = new WolfKill();
  wolf.start();
  wolf.addAction({ initiator: 0, target: 1, day: 3 });
  wolf.addAction({ initiator: 0, target: 2, day: 3 });
  wolf.addAction({ initiator: 1, target: 1, day: 3 });
  wolf.end();

  expect(status.actions).toEqual(data);
});

test("wolf add taget test", async () => {
  status.reset();
  const wolf = new WolfKill();
  wolf.start();
  status.addTarget({ target: 1, linkRole: "wolf" });
  status.addTarget({ target: 2, linkRole: "wolf" });

  expect(wolf.targets({ initiator: 1 })).toEqual([
    { initiators: [], target: 1 },
    { initiators: [], target: 2 },
  ]);
  //select the target 2
  wolf.addAction({ initiator: 1, target: 2, day: 3 });
  expect(wolf.targets({ initiator: 1 })).toEqual([
    { initiators: [], target: 1 },
    { initiators: [1], target: 2 },
  ]);
});
