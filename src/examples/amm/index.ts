import algosdk from "algosdk";
import { getAccounts, getAlgodClient } from "../../";
import { SandboxAccount } from "../../sandbox/accounts";
import { ConstantProductAMM } from "./constantproductamm_client";

(async function () {
  const acct = (await getAccounts()).pop();

  const appClient = new ConstantProductAMM({
    client: getAlgodClient(),
    signer: acct.signer,
    sender: acct.addr,
  });

  // Deploy app on chain
  const [appId, appAddr, txId] = await appClient.create();
  console.log(`Created app ${appId} with address ${appAddr} in tx ${txId}`);

  // Create assets for demo that we'll want to use to create a pool
  const [assetA, assetB] = await createAssets(appClient.client, acct);
  console.log(`created ${assetA}, ${assetB}`);

  // Bootstrap the app with assets we're using
  const bootstrapResult = await appClient.bootstrap(
    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(1e6),
    }),
    assetA,
    assetB
  );

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
  const fundResult = await appClient.mint(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(1e8),
      assetIndex: Number(assetA),
    }),
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(1e6),
      assetIndex: Number(assetB),
    }),
    poolToken,
    assetA,
    assetB
  )
  console.log(`Received ${fundResult.inners[0].aamt} pool tokens`)

  // Try to swap A for B
  const swapAtoB = await appClient.swap(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(1e3),
      assetIndex: Number(assetA),
    }),
    assetA,
    assetB
  )
  console.log(`Received ${swapAtoB.inners[0].aamt} B tokens`)

  // Try to swap B for A 
  const swapBtoA = await appClient.swap(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(1e3),
      assetIndex: Number(assetB),
    }),
    assetA,
    assetB
  )
  console.log(`Received ${swapBtoA.inners[0].aamt} A tokens`)

  // Burn some pool tokens
  const burnResult = await appClient.burn(
    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: acct.addr,
      to: appAddr,
      suggestedParams: await appClient.client.getTransactionParams().do(),
      amount: BigInt(10),
      assetIndex: Number(poolToken),
    }),
    poolToken,
    assetA,
    assetB
  )
  const [aRcv, bRcv] = burnResult.inners

  console.log(`Received ${aRcv.aamt} A tokens and ${bRcv.aamt} B tokens`)

})();

async function createAssets(
  client: algosdk.Algodv2,
  acct: SandboxAccount
): Promise<[bigint, bigint]> {
  const sp = await client.getTransactionParams().do();
  const createA = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: acct.addr,
    suggestedParams: sp,
    total: BigInt(1e10),
    decimals: 0,
    defaultFrozen: false,
    assetName: "Asset A",
    unitName: "a",
  });

  const createB = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: acct.addr,
    suggestedParams: sp,
    total: BigInt(1e9),
    decimals: 0,
    defaultFrozen: false,
    assetName: "Asset B",
    unitName: "b",
  });

  const groupedTxns = algosdk.assignGroupID([createA, createB]);
  const signedTxns = groupedTxns.map((txn) => {
    return txn.signTxn(acct.privateKey);
  });

  await client.sendRawTransaction(signedTxns).do();

  const aResult = await algosdk.waitForConfirmation(
    client,
    groupedTxns[0].txID(),
    4
  );
  const bResult = await algosdk.waitForConfirmation(
    client,
    groupedTxns[1].txID(),
    4
  );

  return [BigInt(aResult["asset-index"]), BigInt(bResult["asset-index"])];
}
