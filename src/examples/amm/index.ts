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

  // Create assets for demo that we'll want to use to create a pool
  const assetA = await createAsset(appClient.client, acct, "A");
  const assetB = await createAsset(appClient.client, acct, "B");
  console.log(`created ${assetA}, ${assetB}`);

  // Deploy app on chain
  const [appId, appAddr, txId] = await appClient.create();
  console.log(`Created app ${appId} with address ${appAddr} in tx ${txId}`);

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
  // Can get the createdAsset from the inners 
  console.log(bootstrapResult.inners[0].createdAsset)

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
  console.log(`Received ${fundResult.inners[0].txn.amount} pool tokens`)

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
  console.log(`Received ${swapAtoB.inners[0].txn.amount} B tokens`)

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
  console.log(`Received ${swapBtoA.inners[0].txn.amount} A tokens`)

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

  console.log(`Received ${aRcv.txn.amount} A tokens and ${bRcv.txn.amount} B tokens`)

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
