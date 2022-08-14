import { generateClient } from "./generate/generate";
import { AppSpec } from "./generate/appspec";

import fs from "fs";

(async function () {
  //TODO: read in path from args
  //const appSpec = JSON.parse(fs.readFileSync("amm.json").toString());
  //generateClient(appSpec as AppSpec, "./src/")

  generateClient(
    JSON.parse(fs.readFileSync("hello.json").toString()) as AppSpec,
    "./src/"
  );
})();
