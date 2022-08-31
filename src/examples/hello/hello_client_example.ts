import { getAccounts, getAlgodClient } from "../../";

import {HelloBeaker} from "./hellobeaker_client";

(async function () {
  const acct = (await getAccounts()).pop();

  const appClient = new HelloBeaker({
    client: getAlgodClient(),
    signer: acct.signer,
    sender: acct.addr,
  });

  const [appId, appAddr, txId] = await appClient.create();
  console.log(`Created app ${appId} with address ${appAddr} in tx ${txId}`);

  const result = await appClient.hello("Beaker");
  console.log(result.returnValue); // Hello, Beaker
})();
