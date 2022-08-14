import ConstantProductAMM from "./constantproductamm_client";
import HelloBeaker from "./hellobeaker_client";
import { getAccounts } from "./sandbox/accounts";
import { getAlgodClient } from "./sandbox/clients";

(async function(){
    const accts = await getAccounts();
    const acct = accts[0]

   // const appClient = new ConstantProductAMM({client: getAlgodClient(), signer:acct.signer, sender: acct.addr});
   // const [appId, appAddr, txId] = await appClient.create();
   // console.log(`Created app ${appId} with address ${appAddr} in tx ${txId}`)

    const appClient = new HelloBeaker({client: getAlgodClient(), signer:acct.signer, sender: acct.addr});
    const [appId, appAddr, txId] = await appClient.create();
    console.log(`Created app ${appId} with address ${appAddr} in tx ${txId}`)
    const result = await appClient.hello("Beaker")
    console.log(result.returnValue)

})()