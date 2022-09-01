import algosdk from "algosdk";
import { getAccounts, getAlgodClient } from "../../";
import { SandboxAccount } from "../../sandbox/accounts";
import {ConstantProductAMM} from "./constantproductamm_client";

(async function () {
  const acct = (await getAccounts()).pop();

  const appClient = new ConstantProductAMM({
    client: getAlgodClient(),
    signer: acct.signer,
    sender: acct.addr,
  });

  const [appId, appAddr, txId] = await appClient.create();
  console.log(`Created app ${appId} with address ${appAddr} in tx ${txId}`);

  const [assetA, assetB] = await createAssets(appClient.client, acct)
  console.log(`created ${assetA}, ${assetB}`)

  const bootstrapResult = await appClient.bootstrap(algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(1e6)
  }), assetA, assetB)

  console.log(bootstrapResult.returnValue)


})();

async function createAssets(client: algosdk.Algodv2, acct: SandboxAccount): Promise<[bigint, bigint]> {
    const sp = await client.getTransactionParams().do()
    const createA = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: acct.addr,
        suggestedParams: sp,
        total: 10000000,
        decimals: 0,
        defaultFrozen: false,
        assetName: "Asset A",
        unitName: "a"
    })

    const createB = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: acct.addr,
        suggestedParams: sp,
        total: 10000000,
        decimals: 0,
        defaultFrozen: false,
        assetName: "Asset B",
        unitName: "b"
    })

    const groupedTxns = algosdk.assignGroupID([createA, createB])
    const signedTxns = groupedTxns.map((txn)=>{
       return txn.signTxn(acct.privateKey) 
    })

    await client.sendRawTransaction(signedTxns).do()

    const aResult = await algosdk.waitForConfirmation(client, groupedTxns[0].txID(), 4)
    const bResult = await algosdk.waitForConfirmation(client, groupedTxns[1].txID(), 4)

    return [BigInt(aResult['asset-index']), BigInt(bResult['asset-index'])]
}