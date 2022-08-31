import algosdk from 'algosdk'
import { decodeNamedTuple, getAccounts, getAlgodClient } from "../../";
import {Order, Structer} from "./structer_client";

(async function () {
  const acct = (await getAccounts()).pop();

  const appClient = new Structer({
    client: getAlgodClient(),
    signer: acct.signer,
    sender: acct.addr,
  });

  const [appId, appAddr, txId] = await appClient.create();
  console.log(`Created app ${appId} with address ${appAddr} in tx ${txId}`);

  await appClient.optIn()

  const result = await appClient.place_order(1, {item: "cubes", quantity: 1});
  console.log(result.txID); 

  const result2 = await appClient.increase_quantity(1);
  console.log("Result: ", result2.value); 


  // TODO: can we make this obvious?
  // Try to decode the state value from the known tuple type
  const codec = algosdk.ABIType.from("(string,uint16)")
  const state = await appClient.getAccountState(acct.addr, true)
  for(const k in state){
    const val = state[k]
    if (typeof val !== 'string') continue;
    const order = decodeNamedTuple(codec.decode(Buffer.from(val, 'hex')), ['item', 'quantity'])
    console.log(order)
  }

})();
