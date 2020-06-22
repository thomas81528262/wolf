const status = require("./status");

test("add action", () => {
  status.reset();
  const data = { initiator: 0, target: 3, day: 3 };

  status.startAction("test");
  status.addAction({ ...data });
  expect(status.actions).toEqual([{ ...data, actionName: "test" }]);
});

test("add same initiator action", () => {
  const data = { initiator: 1, target: 3, actionName: "test", day: 3 };
  status.reset();
  status.startAction("test");
  status.addAction({ ...data });
  status.addAction({ ...data, target: 4 });

  expect(status.actions).toEqual([{ ...data, target: 4 }]);
});
