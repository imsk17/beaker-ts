import ConstantProductAMM from "./constantproductamm_client";
import { getAccounts } from "./sandbox/accounts";
import { getAlgodClient } from "./sandbox/clients";

(async function(){
    const accts = await getAccounts();
    const acct = accts[0]
    const cpamm_client = new ConstantProductAMM({client: getAlgodClient(), appId:10, signer:acct.signer, sender: acct.addr});
    cpamm_client.create();
})()