import { StatusResult } from "../models/status";

const resultMapList = [
  { key: ["a", "b", "c"], status: StatusResult.Die },
  { key: ["VOTE_KILL"], status: StatusResult.Die },
];

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

const resultMap = converResultMap(resultMapList);

export { resultMap };
