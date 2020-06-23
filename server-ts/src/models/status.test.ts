import { WorldStatus } from "./status";


//have to add the user first


describe("addAction test", () => {
  test("add action", () => {
    const status = new WorldStatus();

    

    status.addTarget({target:2, linkRole:'test target'});
    status.addTarget({target:3, linkRole:'test initiator'});
    status.startEvent("test action");
    
    status.addAction({ initiator: 3, target: 2, day: 2 , name:"test simple event"});

    expect(status.actions).toEqual([
      { day: 2, initiators: [3], name: "test action", target: 2 },
    ]);
  });
  test("add mutiple action with different target", () => {
    const status = new WorldStatus();
    status.addTarget({target:2, linkRole:'test target'});
    status.addTarget({target:3, linkRole:'test initiator'});
    status.startEvent("test action");
    status.addAction({ initiator: 3, target: 2, day: 2, name:"test action" });
    status.addAction({ initiator: 3, target: 3, day: 2 , name: "test action"});
    expect(status.actions).toEqual([
      { day: 2, initiators: [3], name: "test action", target: 3 },
    ]);
  });
  test("add mutiple initiator", () => {
    const status = new WorldStatus();
    status.addTarget({target:2, linkRole:'test target'});
    status.addTarget({target:3, linkRole:'test initiator'});
    status.startEvent("test action");
    status.addAction({ initiator: 3, target: 2, day: 2 , name:"test action"});
    status.addAction({ initiator: 2, target: 1, day: 2 , name:"test action"});
    expect(status.actions).toEqual([
      { day: 2, initiators: [3], name: "test action", target: 2 },
      { day: 2, initiators: [2], name: "test action", target: 1 },
    ]);
  });
});
