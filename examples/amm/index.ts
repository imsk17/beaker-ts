import algosdk from "algosdk";
import type { SandboxAccount } from "../../src/sandbox/accounts";
import { getAccounts, getAlgodClient } from "../../src";
import { ConstantProductAMM } from "./constantproductamm_client";

(async function () {
  const acct = (await getAccounts()).pop();

  if(acct === undefined) return

  const appClient = new ConstantProductAMM({
    client: getAlgodClient(),
    signer: acct.signer,
    sender: acct.addr,
  });

  // Create assets for demo that we'll want to use to create a pool
  const assetA = await createAsset(appClient.client, acct, "A");
  const assetB = await createAsset(appClient.client, acct, "B");
  console.log(`created ${assetA}, ${assetB}`);

  // Deploy app on chain
  const [appId, appAddr, txId] = await appClient.create();
  console.log(`Created app ${appId} with address ${appAddr} in tx ${txId}`);

  // Bootstrap the app with assets we're using
  const bootstrapResult = await appClient.bootstrap({
    seed: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(1e6),
    }),
    a_asset: assetA,
    b_asset: assetB
  });
  if(bootstrapResult === undefined || bootstrapResult.value === undefined) return

  // The return value is the id of the pool token
  const poolToken = bootstrapResult.value

  // Opt user into new pool token
  const optInToAsset = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: acct.addr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: 0,
      assetIndex: Number(poolToken),
   })
   appClient.client.sendRawTransaction(optInToAsset.signTxn(acct.privateKey)).do()
   await algosdk.waitForConfirmation(appClient.client, optInToAsset.txID(), 4)

   // Fund the pool with initial liquidity
  let result = await appClient.mint({
      a_xfer: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: acct.addr,
        to: appAddr,
        suggestedParams: await appClient.client.getTransactionParams().do(),
        amount: BigInt(1e8),
        assetIndex: Number(assetA),
      }),
      b_xfer: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: acct.addr,
        to: appAddr,
        suggestedParams: await appClient.client.getTransactionParams().do(),
        amount: BigInt(1e6),
        assetIndex: Number(assetB),
      }),
  })
  let amt: number|bigint|undefined = 0
  if(result.inners.length>0) amt = result.inners[0]?.txn.amount
  console.log(`Received ${amt} pool tokens`)

  // Try to swap A for B
  result = await appClient.swap({
    swap_xfer: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(1e3),
      assetIndex: Number(assetA),
    }),
  })
  console.log(`Received ${result.inners[0]?.txn.amount} B tokens`)

  // Try to swap B for A 
  result = await appClient.swap({
    swap_xfer: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(1e3),
      assetIndex: Number(assetB),
    }),
  })
  console.log(`Received ${result.inners[0]?.txn.amount} A tokens`)

  // Burn some pool tokens
  result = await appClient.burn({
    pool_xfer: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(10),
      assetIndex: Number(poolToken),
    }),
  })
  const [aRx, bRx] = result.inners
  console.log(`Received ${aRx?.txn.amount} A tokens and ${bRx?.txn.amount} B tokens`)

})();

async function createAsset(
  client: algosdk.Algodv2,
  acct: SandboxAccount,
  unitName: string,
): Promise<bigint> {
  const create = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: acct.addr,
    suggestedParams: await client.getTransactionParams().do(),
    total: BigInt(1e10),
    decimals: 0,
    defaultFrozen: false,
    assetName: `Asset ${unitName}`,
    unitName: unitName,
  });
  await client.sendRawTransaction(create.signTxn(acct.privateKey)).do();

  const result = await algosdk.waitForConfirmation( client, create.txID(), 4);

  return BigInt(result["asset-index"]);

}
